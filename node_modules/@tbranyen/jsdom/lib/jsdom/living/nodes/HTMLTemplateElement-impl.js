"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;

const Document = require("../generated/Document");
const DocumentFragment = require("../generated/DocumentFragment");

const { cloningSteps, domSymbolTree } = require("../helpers/internal-constants");
const { clone } = require("../node");

/* Symbol assigned to a document to store the associated inert template document. */
const ASSOCIATED_INERT_TEMPLATE_DOCUMENT_SYMBOL = Symbol("associated-inert-template-document");

class HTMLTemplateElementImpl extends HTMLElementImpl {
  constructor(args, privateData) {
    super(args, privateData);

    const doc = this._appropriateTemplateContentsOwnerDocument(this._ownerDocument);
    this._templateContents = DocumentFragment.createImpl([] , {
      ownerDocument: doc
    });

    // TODO:
    // Add custom document element on the document fragment: https://html.spec.whatwg.org/multipage/scripting.html#template-contents
    // Add adoption steps: https://html.spec.whatwg.org/multipage/scripting.html#template-adopting-steps
  }

  // https://html.spec.whatwg.org/multipage/scripting.html#appropriate-template-contents-owner-document
  _appropriateTemplateContentsOwnerDocument(doc) {
    if (doc[ASSOCIATED_INERT_TEMPLATE_DOCUMENT_SYMBOL] === undefined) {
      const newDoc = Document.createImpl([], {
        options: {
          parsingMode: doc._parsingMode,
          encoding: doc._encoding
        }
      });

      doc[ASSOCIATED_INERT_TEMPLATE_DOCUMENT_SYMBOL] = newDoc;
    }

    return doc[ASSOCIATED_INERT_TEMPLATE_DOCUMENT_SYMBOL];
  }

  // https://html.spec.whatwg.org/multipage/scripting.html#dom-template-content
  get content() {
    return this._templateContents;
  }

  [cloningSteps](copy, node, document, cloneChildren) {
    if (!cloneChildren) {
      return;
    }

    for (const child of domSymbolTree.childrenIterator(node._templateContents)) {
      const childCopy = clone(child, copy._templateContents._ownerDocument, true);
      copy._templateContents.appendChild(childCopy);
    }
  }

  // https://html.spec.whatwg.org/multipage/scripting.html#template-adopting-steps
  _adopted() {
    const doc = this._appropriateTemplateContentsOwnerDocument(this._ownerDocument);
    doc._adoptNode(this._templateContents);
  }
}

module.exports = {
  implementation: HTMLTemplateElementImpl
};
