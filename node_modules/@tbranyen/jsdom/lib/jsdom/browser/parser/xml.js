"use strict";

const saxes = require("saxes");

const attributes = require("../../living/attributes");
const { HTML_NS } = require("../../living/helpers/namespaces");

const CDATASection = require("../../living/generated/CDATASection");
const Comment = require("../../living/generated/Comment");
const DocumentFragment = require("../../living/generated/DocumentFragment");
const DocumentType = require("../../living/generated/DocumentType");
const ProcessingInstruction = require("../../living/generated/ProcessingInstruction");
const Text = require("../../living/generated/Text");

const { createElement } = require("../../living/helpers/create-element");

const HTML5_DOCTYPE = /<!doctype html>/i;
const PUBLIC_DOCTYPE = /<!doctype\s+([^\s]+)\s+public\s+"([^"]+)"\s+"([^"]+)"/i;
const SYSTEM_DOCTYPE = /<!doctype\s+([^\s]+)\s+system\s+"([^"]+)"/i;

function parseDocType(doc, html) {
  if (HTML5_DOCTYPE.test(html)) {
    return createDocumentTypeInternal(doc, "html", "", "");
  }

  const publicPieces = PUBLIC_DOCTYPE.exec(html);
  if (publicPieces) {
    return createDocumentTypeInternal(doc, publicPieces[1], publicPieces[2], publicPieces[3]);
  }

  const systemPieces = SYSTEM_DOCTYPE.exec(html);
  if (systemPieces) {
    return createDocumentTypeInternal(doc, systemPieces[1], "", systemPieces[2]);
  }

  // Shouldn't get here (the parser shouldn't let us know about invalid doctypes), but our logic likely isn't
  // real-world perfect, so let's fallback.
  return createDocumentTypeInternal(doc, "html", "", "");
}

function createDocumentTypeInternal(ownerDocument, name, publicId, systemId) {
  return DocumentType.createImpl([], { ownerDocument, name, publicId, systemId });
}

function createParser(stackRoot, documentImpl, parsingOptions) {
  const parser = new saxes.SaxesParser(parsingOptions);

  const openStack = [stackRoot];

  parser.ontext = text => {
    // In a fragment, all text events produced by saxes must result in a text node.
    // While when parsing a whole document, we must ignore those text nodes that are produced outside the root element.
    // Saxes produces events for them, but DOM trees do not record text outside the root element.
    if (parsingOptions.fragment || openStack.length > 1) {
      const textNode = Text.createImpl([], { data: text, ownerDocument: documentImpl });
      openStack[openStack.length - 1]._append(textNode);
    }
  };

  parser.oncdata = cdata => {
    const cdataNode = CDATASection.createImpl([], { data: cdata, ownerDocument: documentImpl });
    openStack[openStack.length - 1]._append(cdataNode);
  };

  parser.onopentag = tag => {
    const { local: tagLocal, uri: tagURI, prefix: tagPrefix, attributes: tagAttributes } = tag;

    const prefix = tagPrefix && tagPrefix.length ? tagPrefix : null;
    const elem = createElement(documentImpl, tagLocal, tagURI, prefix);

    // We mark a script element as "parser-inserted", which prevents it from
    // being immediately executed.
    if (tagLocal === "script" && tagURI === HTML_NS) {
      elem._parserInserted = true;
    }

    for (const key of Object.keys(tagAttributes)) {
      const { prefix, local, uri, value } = tagAttributes[key];
      attributes.setAttributeValue(
        elem, local, value, prefix === "" ? null : prefix,
        uri === "" ? null : uri
      );
    }

    openStack[openStack.length - 1]._append(elem);
    openStack.push(elem);
  };

  parser.onclosetag = () => {
    const elem = openStack.pop();
    // Once a script is populated, we can execute it.
    if (elem.localName === "script" && elem.namespaceURI === HTML_NS) {
      elem._eval();
    }
  };

  parser.oncomment = comment => {
    const commentNode = Comment.createImpl([], { data: comment, ownerDocument: documentImpl });
    openStack[openStack.length - 1]._append(commentNode);
  };

  parser.onprocessinginstruction = ({ target, body }) => {
    const piNode = ProcessingInstruction.createImpl([], { target, data: body, ownerDocument: documentImpl });
    openStack[openStack.length - 1]._append(piNode);
  };

  parser.ondoctype = dt => {
    const dtNode = parseDocType(documentImpl, `<!doctype ${dt}>`);
    openStack[openStack.length - 1]._append(dtNode);

    const entityMatcher = /<!ENTITY ([^ ]+) "([^"]+)">/g;
    let result;
    while ((result = entityMatcher.exec(dt))) {
      const [, name, value] = result;
      if (!(name in parser.ENTITIES)) {
        parser.ENTITIES[name] = value;
      }
    }
  };

  parser.onerror = err => {
    throw err;
  };

  return parser;
}

function parseDocument(documentImpl, input) {
  const parser = createParser(documentImpl, documentImpl, {
    xmlns: true
  });

  parser.write(input).close();

  return documentImpl;
}

function parseFragment(contextElementImpl, input) {
  const documentImpl = contextElementImpl._ownerDocument;

  const fragmentImpl = DocumentFragment.createImpl([], {
    ownerDocument: documentImpl
  });

  const parser = createParser(fragmentImpl, documentImpl, {
    xmlns: true,
    fragment: true,
    resolvePrefix: prefix => {
      // saxes wants undefined as the return value if the prefix is not defined, not null.
      return contextElementImpl.lookupNamespaceURI(prefix) || undefined;
    }
  });

  parser.write(input).close();

  return fragmentImpl;
}

module.exports = {
  parseDocument,
  parseFragment
};
