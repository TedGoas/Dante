"use strict";

const parse5 = require("parse5");

const attributes = require("../../living/attributes");
const nodeTypes = require("../../living/node-type");

const Comment = require("../../living/generated/Comment");
const DocumentFragment = require("../../living/generated/DocumentFragment");
const DocumentType = require("../../living/generated/DocumentType");
const Text = require("../../living/generated/Text");

const { createElement } = require("../../living/helpers/create-element");
const { CUSTOM_ELEMENT_REACTION_STACK, lookupCEDefinition } = require("../../living/helpers/custom-elements");

const serializationAdapter = require("../../living/domparsing/parse5-adapter-serialization");

// Horrible monkey-patch to implement https://github.com/inikulin/parse5/issues/237
const OpenElementStack = require("parse5/lib/parser/open-element-stack");
const originalPop = OpenElementStack.prototype.pop;
OpenElementStack.prototype.pop = function (...args) {
  const before = this.items[this.stackTop];
  originalPop.apply(this, args);
  if (before._poppedOffStackOfOpenElements) {
    before._poppedOffStackOfOpenElements();
  }
};

const originalPush = OpenElementStack.prototype.push;
OpenElementStack.prototype.push = function (...args) {
  originalPush.apply(this, args);
  const after = this.items[this.stackTop];
  if (after._pushedOnStackOfOpenElements) {
    after._pushedOnStackOfOpenElements();
  }
};

class Parse5Adapter {
  constructor({ documentImpl, isFragment }) {
    this._documentImpl = documentImpl;
    this._isFragment = isFragment;
  }

  createDocument() {
    // parse5's model assumes that parse(html) will call into here to create the new Document, then return it. However,
    // jsdom's model assumes we can create a Window (and through that create an empty Document), do some other setup
    // stuff, and then parse, stuffing nodes into that Document as we go. So to adapt between these two models, we just
    // return the already-created Document when asked by parse5 to "create" a Document.
    return this._documentImpl;
  }

  createDocumentFragment() {
    return DocumentFragment.createImpl([], { ownerDocument: this._documentImpl });
  }

  // https://html.spec.whatwg.org/multipage/parsing.html#create-an-element-for-the-token
  createElement(localName, namespace, attrs) {
    let isValue = null;

    const isAttribute = attrs.find(attr => attr.name === "is");
    if (isAttribute !== undefined) {
      isValue = isAttribute.value;
    }

    const definition = lookupCEDefinition(this._documentImpl, namespace, localName, isValue);

    let willExecuteScript = false;
    if (definition && !this._isFragment) {
      willExecuteScript = true;
    }

    if (willExecuteScript) {
      CUSTOM_ELEMENT_REACTION_STACK.push([]);
    }

    const syncCE = willExecuteScript;
    const element = createElement(this._documentImpl, localName, namespace, null, isValue, syncCE);

    // TODO: Is it necessary to adopt the newly created element since it get inserted after.
    this.adoptAttributes(element, attrs);

    if ("_parserInserted" in element) {
      element._parserInserted = true;
    }

    return element;
  }

  createCommentNode(data) {
    return Comment.createImpl([], { data, ownerDocument: this._documentImpl });
  }

  appendChild(parentNode, newNode) {
    parentNode._append(newNode);
  }

  insertBefore(parentNode, newNode, referenceNode) {
    parentNode._insert(newNode, referenceNode);
  }

  setTemplateContent(templateElement, contentFragment) {
    templateElement._templateContents = contentFragment;
  }

  setDocumentType(document, name, publicId, systemId) {
    // parse5 sometimes gives us these as null.
    if (name === null) {
      name = "";
    }
    if (publicId === null) {
      publicId = "";
    }
    if (systemId === null) {
      systemId = "";
    }

    const documentType = DocumentType.createImpl([], { name, publicId, systemId, ownerDocument: this._documentImpl });
    document._append(documentType);
  }

  setDocumentMode(document, mode) {
    // TODO: the rest of jsdom ignores this
    document._mode = mode;
  }

  detachNode(node) {
    node.remove();
  }

  insertText(parentNode, text) {
    const { lastChild } = parentNode;
    if (lastChild && lastChild.nodeType === nodeTypes.TEXT_NODE) {
      lastChild.data += text;
    } else {
      const textNode = Text.createImpl([], { data: text, ownerDocument: this._documentImpl });

      parentNode._append(textNode);
    }
  }

  insertTextBefore(parentNode, text, referenceNode) {
    const { previousSibling } = referenceNode;
    if (previousSibling && previousSibling.nodeType === nodeTypes.TEXT_NODE) {
      previousSibling.data += text;
    } else {
      const textNode = Text.createImpl([], { data: text, ownerDocument: this._documentImpl });

      parentNode._insert(textNode, referenceNode);
    }
  }

  adoptAttributes(element, attrs) {
    for (const attr of attrs) {
      const prefix = attr.prefix === "" ? null : attr.prefix;
      attributes.setAttributeValue(element, attr.name, attr.value, prefix, attr.namespace);
    }
  }
}

// Assign shared adapters with serializer.
Object.assign(Parse5Adapter.prototype, serializationAdapter);

// The DOMParser doesn't have access to the user defined parsing options stored on the Document object when it invokes
// the parser. In this case, the parser doesn't record source location to avoid the performance overhead.
const DEFAULT_PARSE_OPTIONS = {
  sourceCodeLocationInfo: false
};

function parseDocument(documentImpl, input, parseOptions = DEFAULT_PARSE_OPTIONS) {
  const { sourceCodeLocationInfo } = parseOptions;

  return parse5.parse(input, {
    sourceCodeLocationInfo,
    treeAdapter: new Parse5Adapter({
      documentImpl,
      isFragment: false
    })
  });
}

function parseFragment(contextElementImpl, input, parseOptions = DEFAULT_PARSE_OPTIONS) {
  const { sourceCodeLocationInfo } = parseOptions;

  // Template are special since their templateContent (a DocumentFragment) has an inert document attached as owner
  // document. When parsing a fragment in the context of a HTMLTemplateElement, the document owner should the
  // ownerDocument should be the one from the templateContent and not the one of the Element.
  // TODO: Find reference in the spec.
  let documentImpl = contextElementImpl._ownerDocument;
  if (contextElementImpl.tagName === "TEMPLATE") {
    documentImpl = contextElementImpl._templateContents._ownerDocument;
  }

  return parse5.parseFragment(contextElementImpl, input, {
    sourceCodeLocationInfo,
    treeAdapter: new Parse5Adapter({
      documentImpl,
      isFragment: true
    })
  });
}

module.exports = {
  parseDocument,
  parseFragment
};
