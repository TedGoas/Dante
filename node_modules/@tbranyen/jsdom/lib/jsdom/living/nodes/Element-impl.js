"use strict";
const { addNwsapi } = require("../helpers/selectors");
const { HTML_NS } = require("../helpers/namespaces");
const { mixin, memoizeQuery } = require("../../utils");
const idlUtils = require("../generated/utils");
const NodeImpl = require("./Node-impl").implementation;
const ParentNodeImpl = require("./ParentNode-impl").implementation;
const ChildNodeImpl = require("./ChildNode-impl").implementation;
const attributes = require("../attributes");
const namedPropertiesWindow = require("../named-properties-window");
const NODE_TYPE = require("../node-type");
const { parseFragment } = require("../../browser/parser");
const { fragmentSerialization } = require("../domparsing/serialization");
const { domSymbolTree } = require("../helpers/internal-constants");
const DOMException = require("domexception");
const DOMTokenList = require("../generated/DOMTokenList");
const attrGenerated = require("../generated/Attr");
const NamedNodeMap = require("../generated/NamedNodeMap");
const validateNames = require("../helpers/validate-names");
const { asciiLowercase } = require("../helpers/strings");
const { listOfElementsWithQualifiedName, listOfElementsWithNamespaceAndLocalName,
  listOfElementsWithClassNames } = require("../node");
const SlotableMixinImpl = require("./Slotable-impl").implementation;
const NonDocumentTypeChildNode = require("./NonDocumentTypeChildNode-impl").implementation;
const ShadowRoot = require("../generated/ShadowRoot");
const { isValidHostElementName } = require("../helpers/shadow-dom");
const { CUSTOM_ELEMENT_STATE, isValidCustomElementName } = require("../helpers/custom-elements");

function attachId(id, elm, doc) {
  if (id && elm && doc) {
    if (!doc._ids[id]) {
      doc._ids[id] = [];
    }
    doc._ids[id].push(elm);
  }
}

function detachId(id, elm, doc) {
  if (id && elm && doc) {
    if (doc._ids && doc._ids[id]) {
      const elms = doc._ids[id];
      for (let i = 0; i < elms.length; i++) {
        if (elms[i] === elm) {
          elms.splice(i, 1);
          --i;
        }
      }
      if (elms.length === 0) {
        delete doc._ids[id];
      }
    }
  }
}

class ElementImpl extends NodeImpl {
  constructor(args, privateData) {
    super(args, privateData);

    this._namespaceURI = privateData.namespace;
    this._prefix = privateData.prefix;
    this._localName = privateData.localName;
    this._customElementState = privateData.customElementState;
    this._customElementDefinition = privateData.customElementDefinition;
    this._isValue = privateData.isValue;

    this.nodeType = NODE_TYPE.ELEMENT_NODE;
    this.scrollTop = 0;
    this.scrollLeft = 0;

    this._shadowRoot = null;

    this._customElementReactionQueue = [];

    this._attributeList = [];
    // Used for caching.
    this._attributesByNameMap = new Map();
    this._attributes = NamedNodeMap.createImpl([], {
      element: this
    });

    this._initSlotableMixin();
  }

  _attach() {
    namedPropertiesWindow.nodeAttachedToDocument(this);

    const id = this.getAttribute("id");
    if (id) {
      attachId(id, this, this._ownerDocument);
    }

    super._attach();
  }

  _detach() {
    super._detach();

    namedPropertiesWindow.nodeDetachedFromDocument(this);

    const id = this.getAttribute("id");
    if (id) {
      detachId(id, this, this._ownerDocument);
    }
  }

  _attrModified(name, value, oldValue) {
    this._modified();
    namedPropertiesWindow.elementAttributeModified(this, name, value, oldValue);

    if (name === "id" && this._attached) {
      const doc = this._ownerDocument;
      detachId(oldValue, this, doc);
      attachId(value, this, doc);
    }

    // update classList
    if (name === "class" && this._classList !== undefined) {
      this._classList.attrModified();
    }

    this._attrModifiedSlotableMixin(name, value, oldValue);
  }

  get namespaceURI() {
    return this._namespaceURI;
  }
  get prefix() {
    return this._prefix;
  }
  get localName() {
    return this._localName;
  }
  get _qualifiedName() {
    return this._prefix !== null ? this._prefix + ":" + this._localName : this._localName;
  }
  get tagName() {
    let qualifiedName = this._qualifiedName;
    if (this.namespaceURI === HTML_NS && this._ownerDocument._parsingMode === "html") {
      qualifiedName = qualifiedName.toUpperCase();
    }
    return qualifiedName;
  }

  get attributes() {
    return this._attributes;
  }

  // https://w3c.github.io/DOM-Parsing/#dfn-outerhtml
  get outerHTML() {
    // TODO: maybe parse5 can give us a hook where it serializes the node itself too:
    // https://github.com/inikulin/parse5/issues/230
    // Alternatively, if we can create a virtual node in domSymbolTree, that'd also work.
    // It's currently prevented by the fact that a node can't be duplicated in the same tree
    return fragmentSerialization({ childNodesForSerializing: [this], _ownerDocument: this._ownerDocument }, {
      requireWellFormed: true
    });
  }

  set outerHTML(value) {
    const document = this._ownerDocument;
    let parent = domSymbolTree.parent(this);

    if (!parent) {
      return;
    }

    if (parent.nodeType === NODE_TYPE.DOCUMENT_NODE) {
      throw new DOMException("Modifications are not allowed for this document", "NoModificationAllowedError");
    }

    if (parent.nodeType === NODE_TYPE.DOCUMENT_FRAGMENT_NODE) {
      parent = document.createElementNS(HTML_NS, "body");
    }

    const fragment = parseFragment(value, parent);

    const contextObjectParent = domSymbolTree.parent(this);
    contextObjectParent._replace(fragment, this);
  }

  // https://w3c.github.io/DOM-Parsing/#dfn-innerhtml
  get innerHTML() {
    return fragmentSerialization(this, { requireWellFormed: true });
  }

  set innerHTML(value) {
    const fragment = parseFragment(value, this);

    let contextObject = this;
    if (this.tagName === "TEMPLATE") {
      contextObject = this._templateContents;
    }

    contextObject._replaceAll(fragment);
  }

  get classList() {
    if (this._classList === undefined) {
      this._classList = DOMTokenList.createImpl([], {
        element: this,
        attributeLocalName: "class"
      });
    }
    return this._classList;
  }

  hasAttributes() {
    return attributes.hasAttributes(this);
  }

  getAttributeNames() {
    return attributes.attributeNames(this);
  }

  getAttribute(name) {
    const attr = attributes.getAttributeByName(this, name);
    if (!attr) {
      return null;
    }
    return attr._value;
  }

  getAttributeNS(namespace, localName) {
    const attr = attributes.getAttributeByNameNS(this, namespace, localName);
    if (!attr) {
      return null;
    }
    return attr._value;
  }

  setAttribute(name, value) {
    validateNames.name(name);

    if (this._namespaceURI === HTML_NS && this._ownerDocument._parsingMode === "html") {
      name = asciiLowercase(name);
    }

    const attribute = attributes.getAttributeByName(this, name);

    if (attribute === null) {
      const newAttr = attrGenerated.createImpl([], { localName: name, value });
      attributes.appendAttribute(this, newAttr);
      return;
    }

    attributes.changeAttribute(this, attribute, value);
  }

  setAttributeNS(namespace, name, value) {
    const extracted = validateNames.validateAndExtract(namespace, name);

    attributes.setAttributeValue(this, extracted.localName, value, extracted.prefix, extracted.namespace);
  }

  removeAttribute(name) {
    attributes.removeAttributeByName(this, name);
  }

  removeAttributeNS(namespace, localName) {
    attributes.removeAttributeByNameNS(this, namespace, localName);
  }

  toggleAttribute(qualifiedName, force) {
    validateNames.name(qualifiedName);

    if (this._namespaceURI === HTML_NS && this._ownerDocument._parsingMode === "html") {
      qualifiedName = asciiLowercase(qualifiedName);
    }

    const attribute = attributes.getAttributeByName(this, qualifiedName);

    if (attribute === null) {
      if (force === undefined || force === true) {
        const newAttr = attrGenerated.createImpl([], { localName: qualifiedName, value: "" });
        attributes.appendAttribute(this, newAttr);
        return true;
      }
      return false;
    }

    if (force === undefined || force === false) {
      attributes.removeAttributeByName(this, qualifiedName);
      return false;
    }

    return true;
  }

  hasAttribute(name) {
    if (this._namespaceURI === HTML_NS && this._ownerDocument._parsingMode === "html") {
      name = asciiLowercase(name);
    }

    return attributes.hasAttributeByName(this, name);
  }

  hasAttributeNS(namespace, localName) {
    if (namespace === "") {
      namespace = null;
    }

    return attributes.hasAttributeByNameNS(this, namespace, localName);
  }

  getAttributeNode(name) {
    return attributes.getAttributeByName(this, name);
  }

  getAttributeNodeNS(namespace, localName) {
    return attributes.getAttributeByNameNS(this, namespace, localName);
  }

  setAttributeNode(attr) {
    return attributes.setAttribute(this, attr);
  }

  setAttributeNodeNS(attr) {
    return attributes.setAttribute(this, attr);
  }

  removeAttributeNode(attr) {
    if (!attributes.hasAttribute(this, attr)) {
      throw new DOMException("Tried to remove an attribute that was not present", "NotFoundError");
    }

    attributes.removeAttribute(this, attr);

    return attr;
  }

  getBoundingClientRect() {
    return {
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0
    };
  }

  getClientRects() {
    return [];
  }

  get scrollWidth() {
    return 0;
  }

  get scrollHeight() {
    return 0;
  }

  get clientTop() {
    return 0;
  }

  get clientLeft() {
    return 0;
  }

  get clientWidth() {
    return 0;
  }

  get clientHeight() {
    return 0;
  }

  // https://dom.spec.whatwg.org/#dom-element-attachshadow
  attachShadow(init) {
    if (this.namespaceURI !== HTML_NS) {
      throw new DOMException(
        "This element does not support attachShadow. This element is not part of the HTML namespace.",
        "NotSupportedError"
      );
    }

    if (!isValidHostElementName(this.localName) && !isValidCustomElementName(this.localName)) {
      const message = "This element does not support attachShadow. This element is not a custom element nor " +
        "a standard element supporting a shadow root.";
      throw new DOMException(message, "NotSupportedError");
    }

    if (this._shadowRoot !== null) {
      throw new DOMException(
        "Shadow root cannot be created on a host which already hosts a shadow tree.",
        "InvalidStateError"
      );
    }

    const shadow = ShadowRoot.createImpl([], {
      ownerDocument: this.ownerDocument,
      mode: init.mode,
      host: this
    });

    this._shadowRoot = shadow;

    return shadow;
  }

  // https://dom.spec.whatwg.org/#dom-element-shadowroot
  get shadowRoot() {
    const shadow = this._shadowRoot;

    if (shadow === null || shadow.mode === "closed") {
      return null;
    }

    return shadow;
  }

  // https://w3c.github.io/DOM-Parsing/#dom-element-insertadjacenthtml
  insertAdjacentHTML(position, text) {
    position = position.toLowerCase();

    let context;
    switch (position) {
      case "beforebegin":
      case "afterend": {
        context = this.parentNode;
        if (context === null || context.nodeType === NODE_TYPE.DOCUMENT_NODE) {
          throw new DOMException("Cannot insert HTML adjacent to " +
            "parent-less nodes or children of document nodes.", "NoModificationAllowedError");
        }
        break;
      }
      case "afterbegin":
      case "beforeend": {
        context = this;
        break;
      }
      default: {
        throw new DOMException("Must provide one of \"beforebegin\", \"afterend\", " +
          "\"afterbegin\", or \"beforeend\".", "SyntaxError");
      }
    }

    // TODO: use context for parsing instead of a <template>.
    const fragment = this.ownerDocument.createElement("template");
    fragment.innerHTML = text;

    switch (position) {
      case "beforebegin": {
        this.parentNode._insert(fragment.content, this);
        break;
      }
      case "afterbegin": {
        this._insert(fragment.content, this.firstChild);
        break;
      }
      case "beforeend": {
        this._append(fragment.content);
        break;
      }
      case "afterend": {
        this.parentNode._insert(fragment.content, this.nextSibling);
        break;
      }
    }
  }

  closest(selectors) {
    const matcher = addNwsapi(this);
    return matcher.closest(selectors, idlUtils.wrapperForImpl(this));
  }

  // https://dom.spec.whatwg.org/#concept-element-defined
  _isDefined() {
    return (
      this._customElementState === CUSTOM_ELEMENT_STATE.UNCUSTOMZIED ||
      this._customElementState === CUSTOM_ELEMENT_STATE.CUSTOM
    );
  }

  // https://dom.spec.whatwg.org/#concept-element-custom
  _isCustom() {
    return this._customElementState === CUSTOM_ELEMENT_STATE.CUSTOM;
  }
}

mixin(ElementImpl.prototype, NonDocumentTypeChildNode.prototype);
mixin(ElementImpl.prototype, ParentNodeImpl.prototype);
mixin(ElementImpl.prototype, ChildNodeImpl.prototype);
mixin(ElementImpl.prototype, SlotableMixinImpl.prototype);

ElementImpl.prototype.getElementsByTagName = memoizeQuery(function (qualifiedName) {
  return listOfElementsWithQualifiedName(qualifiedName, this);
});

ElementImpl.prototype.getElementsByTagNameNS = memoizeQuery(function (namespace, localName) {
  return listOfElementsWithNamespaceAndLocalName(namespace, localName, this);
});

ElementImpl.prototype.getElementsByClassName = memoizeQuery(function (classNames) {
  return listOfElementsWithClassNames(classNames, this);
});

ElementImpl.prototype.matches = function (selectors) {
  const matcher = addNwsapi(this);

  return matcher.match(selectors, idlUtils.wrapperForImpl(this));
};

ElementImpl.prototype.webkitMatchesSelector = ElementImpl.prototype.matches;

module.exports = {
  implementation: ElementImpl
};
