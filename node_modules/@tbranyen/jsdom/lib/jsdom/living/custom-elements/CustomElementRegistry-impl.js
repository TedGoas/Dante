"use strict";

const DOMException = require("domexception");

const NODE_TYPE = require("../node-type");
const idlUtils = require("../generated/utils");

const { HTML_NS } = require("../helpers/namespaces");
const { INTERFACE_CACHE } = require("../helpers/create-element");
const {
  CUSTOM_ELEMENT_REACTION_STACK,
  isValidCustomElementName,
  tryToUpgrade
} = require("../helpers/custom-elements");
const {
  shadowDomIncludingDescendantIterator,
  shadowDomIncludingInclusiveDescendantIterator
} = require("../helpers/shadow-dom");

// Borrowed from: https://esdiscuss.org/topic/isconstructor#content-11
function isConstructor(o) {
  try {
    /* eslint-disable no-new */
    new new Proxy(o, { construct: () => ({}) })();
    return true;
  } catch (e) {
    return false;
  }
}

// https://html.spec.whatwg.org/multipage/custom-elements.html#customelementregistry
class CustomElementRegistryImpl {
  constructor(args, privateData) {
    this._customElementDefinitions = [];
    this._elementDefinitionIsRunning = false;
    this._whenDefinedPromiseMap = {};

    const { ownerDocument } = privateData;
    this._ownerDocument = ownerDocument;
  }

  // https://html.spec.whatwg.org/multipage/custom-elements.html#dom-customelementregistry-define
  define(name, constructor, options = {}) {
    if (!isConstructor(constructor)) {
      throw new TypeError("Invalid custom element constructor.");
    }

    if (!isValidCustomElementName(name)) {
      throw new DOMException("Invalid custom element name.", "SyntaxError");
    }

    if (this._customElementDefinitions.some(entry => entry.name === name)) {
      throw new DOMException(
        `Custom element "${name}" has already been registered in the registry.`,
        "NotSupportedError"
      );
    }

    if (this._customElementDefinitions.some(entry => entry.constructor === constructor)) {
      throw new DOMException(
        `Custom element constructor has already been registered in the registry.`,
        "NotSupportedError"
      );
    }

    let localName = name;
    const extendsName = options.extends;

    if (extendsName) {
      if (isValidCustomElementName(extendsName)) {
        throw new DOMException("Option extends can't be a custom element name.", "NotSupportedError");
      }

      const extendsInterface = INTERFACE_CACHE.getByElementNamespaceAndName(HTML_NS, extendsName);
      const htmlUnknownElementInterface = INTERFACE_CACHE.getByInterfaceName("HTMLUnknownElement");
      if (extendsInterface === htmlUnknownElementInterface) {
        throw new DOMException("TODO", "NotSupportedError");
      }

      localName = extendsName;
    }

    if (this._elementDefinitionIsRunning) {
      throw new DOMException("Invalid reentrant element definition invocation.", "NotSupportedError");
    }

    this._elementDefinitionIsRunning = true;

    const lifecycleCallbacks = {
      connectedCallback: null,
      disconnectedCallback: null,
      adoptedCallback: null,
      attributeChangedCallback: null
    };
    let observedAttributes = [];

    try {
      const { prototype } = constructor;
      if (typeof prototype !== "object") {
        throw new TypeError("Invalid constructor prototype.");
      }

      for (const callbackName of Object.keys(lifecycleCallbacks)) {
        const callbackValue = prototype[callbackName];

        if (callbackValue !== undefined) {
          if (typeof callbackValue !== "function") {
            throw new TypeError(`Invalid lifecycle callback definition for "${callbackName}", ` +
              `expected to be a function.`);
          }

          lifecycleCallbacks[callbackName] = callbackValue;
        }
      }

      if (lifecycleCallbacks.attributeChangedCallback !== null) {
        const observedAttributesIterable = constructor.observedAttributes;

        if (observedAttributesIterable) {
          if (!(Symbol.iterator in observedAttributesIterable)) {
            throw new TypeError(`Invalid "attributeChangedCallback" property, expected to be an iterable.`);
          }

          observedAttributes = Array.from(observedAttributesIterable);
        }
      }
    } finally {
      this._elementDefinitionIsRunning = false;
    }

    const definition = {
      name,
      localName,
      constructor,
      observedAttributes,
      lifecycleCallbacks,
      constructionStack: []
    };

    this._customElementDefinitions.push(definition);

    const document = this._ownerDocument;

    const upgradeCandidates = [];
    for (const descendant of shadowDomIncludingDescendantIterator(document)) {
      if (
        descendant.nodeType === NODE_TYPE.ELEMENT_NODE &&
        descendant._namespaceURI === HTML_NS &&
        descendant._localName === localName
      ) {
        upgradeCandidates.push(descendant);
      }

      if (extendsName && extendsName._isValue === name) {
        upgradeCandidates.push(descendant);
      }
    }

    for (const candidate of upgradeCandidates) {
      CUSTOM_ELEMENT_REACTION_STACK.enqueueCEUpgradeReaction(candidate, definition);
    }

    if (this._whenDefinedPromiseMap[name]) {
      const { resolve } = this._whenDefinedPromiseMap[name];
      resolve();

      delete this._whenDefinedPromiseMap[name];
    }
  }

  // https://html.spec.whatwg.org/multipage/custom-elements.html#dom-customelementregistry-get
  get(name) {
    const definition = this._customElementDefinitions.find(entry => entry.name === name);
    return definition && definition.constructor;
  }

  // https://html.spec.whatwg.org/multipage/custom-elements.html#dom-customelementregistry-whendefined
  whenDefined(name) {
    if (!isValidCustomElementName(name)) {
      const err = new DOMException("Invalid custom element name.", "SyntaxError");
      return Promise.reject(err);
    }

    if (this._customElementDefinitions.some(entry => entry.name === name)) {
      return Promise.resolve();
    }

    if (!this._whenDefinedPromiseMap[name]) {
      // Extract the user-land Promise constructor from the window object. This would avoid the identity discontinuity,
      // since the global.Promise is different from the window.Promise (in the script context).
      const UserRealmPromise = this._ownerDocument._defaultView.Promise;

      /* eslint-disable no-new */
      let resolve;
      const promise = new UserRealmPromise(r => {
        resolve = r;
      });

      this._whenDefinedPromiseMap[name] = {
        resolve,
        promise
      };
    }

    return this._whenDefinedPromiseMap[name].promise;
  }

  // https://html.spec.whatwg.org/multipage/custom-elements.html#dom-customelementregistry-upgrade
  upgrade(root) {
    // Mandatory step since the CustomElementRegistry is not exposed via the standard idl interface.
    const rootImpl = idlUtils.implForWrapper(root);

    const candidates = Array.from(shadowDomIncludingInclusiveDescendantIterator(rootImpl));

    for (const candidate of candidates) {
      tryToUpgrade(candidate);
    }
  }
}

module.exports = {
  implementation: CustomElementRegistryImpl
};
