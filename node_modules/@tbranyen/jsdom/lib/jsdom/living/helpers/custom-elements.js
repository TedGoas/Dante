"use strict";

const DOMException = require("domexception");
const isPotentialCEName = require("is-potential-custom-element-name");

const idlUtils = require("../generated/utils");

const { HTML_NS } = require("./namespaces");
const { domSymbolTree } = require("./internal-constants");
const reportException = require("./runtime-script-errors");

// https://dom.spec.whatwg.org/#concept-element-custom-element-state
const CUSTOM_ELEMENT_STATE = {
  UNDEFINED: "undefined",
  FAILED: "failed",
  UNCUSTOMZIED: "uncustomized",
  CUSTOM: "custom"
};

// https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-reaction-queue
const REACTION_TYPE = {
  UPGRADE: "upgrade",
  CALLBACK: "callaback"
};

// https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-reactions-stack
class CustomElementReactionStack {
  constructor() {
    this._stack = [];
    this._backupElementQueue = [];
    this._processingBackupElementQueue = false;
  }

  _currentElementQueue() {
    return this._stack[this._stack.length - 1];
  }

  push(element) {
    this._stack.push(element);
  }

  pop() {
    return this._stack.pop();
  }

  // https://html.spec.whatwg.org/multipage/custom-elements.html#enqueue-an-element-on-the-appropriate-element-queue
  _enqueueElementOnTheAppropriateElementQueue(element) {
    if (this._stack.length === 0) {
      this._backupElementQueue.push(element);

      if (this._processingBackupElementQueue) {
        return;
      }
      this._processingBackupElementQueue = true;

      Promise.resolve().then(() => {
        this.invokeCEReactions(this._backupElementQueue);
        this._processingBackupElementQueue = false;
      });
    } else {
      this._currentElementQueue().push(element);
    }
  }

  // https://html.spec.whatwg.org/multipage/custom-elements.html#enqueue-a-custom-element-callback-reaction
  enqueueCECallbackReaction(element, callbackName, args) {
    const {
      _customElementReactionQueue: reactionQueue,
      _customElementDefinition: definition
    } = element;

    if (definition === null) {
      return;
    }

    const callback = definition.lifecycleCallbacks[callbackName];
    if (callback === null) {
      return;
    }

    if (callbackName === "attributeChangedCallback") {
      const [attributeName] = args;

      if (!definition.observedAttributes.includes(attributeName)) {
        return;
      }
    }

    reactionQueue.push({
      type: REACTION_TYPE.CALLBACK,
      callback,
      args
    });

    this._enqueueElementOnTheAppropriateElementQueue(element);
  }

  // https://html.spec.whatwg.org/multipage/custom-elements.html#enqueue-a-custom-element-upgrade-reaction
  enqueueCEUpgradeReaction(element, definition) {
    const { _customElementReactionQueue: reactionQueue } = element;

    reactionQueue.push({
      type: REACTION_TYPE.UPGRADE,
      definition
    });

    this._enqueueElementOnTheAppropriateElementQueue(element);
  }

  // https://html.spec.whatwg.org/multipage/custom-elements.html#invoke-custom-element-reactions
  invokeCEReactions(queue) {
    for (const element of queue) {
      // TODO: Open spec bug, the element custom element state can either be "custom" or
      // "undefined" is the element is pending for upgrade. The spec only consider the "custom"
      // case.
      if (element._isCustom() || element._customElementState === CUSTOM_ELEMENT_STATE.UNDEFINED) {
        const { _customElementReactionQueue: reactions } = element;

        while (reactions.length > 0) {
          const reaction = reactions.shift();

          try {
            switch (reaction.type) {
              case REACTION_TYPE.UPGRADE:
                upgradeElement(reaction.definition, element);
                break;

              case REACTION_TYPE.CALLBACK: {
                const { callback, args } = reaction;

                const thisValueWrapper = idlUtils.wrapperForImpl(element);
                const argsWrappers = args.map(idlUtils.tryWrapperForImpl);
                callback.apply(thisValueWrapper, argsWrappers);
                break;
              }
            }
          } catch (error) {
            const window = element._ownerDocument._defaultView;
            reportException(window, error);
          }
        }
      }
    }
  }
}

// TODO: This should not be global!
// Each unit of related similar-origin browsing contexts has a custom element reactions stack
const CUSTOM_ELEMENT_REACTION_STACK = new CustomElementReactionStack();

const RESTRICTED_CUSTOM_ELEMENT_NAME = new Set([
  "annotation-xml",
  "color-profile",
  "font-face",
  "font-face-src",
  "font-face-uri",
  "font-face-format",
  "font-face-name",
  "missing-glyph"
]);

// https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
function isValidCustomElementName(name) {
  if (RESTRICTED_CUSTOM_ELEMENT_NAME.has(name)) {
    return false;
  }

  return isPotentialCEName(name);
}

// https://html.spec.whatwg.org/multipage/custom-elements.html#look-up-a-custom-element-definition
function lookupCEDefinition(document, namespace, localName, is) {
  if (namespace !== HTML_NS) {
    return null;
  }

  if (!document._defaultView) {
    return null;
  }

  const { customElements } = document._defaultView;

  const definitionByName = customElements._customElementDefinitions.find(entry => {
    return entry.name === localName && entry.localName === localName;
  });
  if (definitionByName) {
    return definitionByName;
  }

  const definitionByIs = customElements._customElementDefinitions.find(entry => {
    return entry.name === is && entry.localName === localName;
  });
  if (definitionByIs) {
    return definitionByIs;
  }

  return null;
}

// https://html.spec.whatwg.org/multipage/custom-elements.html#concept-upgrade-an-element
function upgradeElement(definition, elementImpl) {
  if (elementImpl._isCustom()) {
    return;
  }

  if (elementImpl._customElementState === CUSTOM_ELEMENT_STATE.FAILED) {
    return;
  }

  elementImpl._customElementDefinition = definition;

  for (const attribute of elementImpl._attributeList) {
    CUSTOM_ELEMENT_REACTION_STACK.enqueueCECallbackReaction(elementImpl, "attributeChangedCallback", [
      attribute._localName,
      null,
      attribute._value,
      attribute._namespace
    ]);
  }

  if (elementImpl._isConnected()) {
    CUSTOM_ELEMENT_REACTION_STACK.enqueueCECallbackReaction(elementImpl, "connectedCallback", []);
  }

  definition.constructionStack.push(elementImpl);

  const C = definition.constructor;
  try {
    try {
      const constructResultWrapper = new C();

      if (idlUtils.implForWrapper(constructResultWrapper) !== elementImpl) {
        throw new DOMException("TODO", "InvalidStateError");
      }
    } finally {
      definition.constructionStack.pop();
    }
  } catch (error) {
    elementImpl._customElementState = CUSTOM_ELEMENT_STATE.FAILED;
    elementImpl._customElementDefinition = null;
    elementImpl._customElementReactionQueue.splice(0, elementImpl._customElementReactionQueue.length);

    throw error;
  }

  elementImpl._customElementState = CUSTOM_ELEMENT_STATE.CUSTOM;
}

// https://html.spec.whatwg.org/multipage/custom-elements.html#concept-try-upgrade
function tryToUpgrade(element) {
  const { _ownerDocument, _namespaceURI, _localName, _isValue } = element;
  const definition = lookupCEDefinition(_ownerDocument, _namespaceURI, _localName, _isValue);

  if (definition !== null) {
    CUSTOM_ELEMENT_REACTION_STACK.enqueueCEUpgradeReaction(element, definition);
  }
}

module.exports = {
  CUSTOM_ELEMENT_STATE,
  CUSTOM_ELEMENT_REACTION_STACK,

  isValidCustomElementName,

  lookupCEDefinition,
  tryToUpgrade,
  upgradeElement
};
