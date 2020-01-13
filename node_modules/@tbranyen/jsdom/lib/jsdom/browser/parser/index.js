"use strict";

const xmlParser = require("./xml");
const htmlParser = require("./html");

// https://w3c.github.io/DOM-Parsing/#dfn-fragment-parsing-algorithm
function parseFragment(input, contextElementImpl) {
  const { _parseOptions, _parsingMode } = contextElementImpl._ownerDocument;
  const algorithm = _parsingMode === "html" ? htmlParser.parseFragment : xmlParser.parseFragment;

  // Note: HTML and XML fragment parsing algorithm already return a document fragments, no need to do steps 3. and 4.
  return algorithm(contextElementImpl, input, _parseOptions);
}

module.exports = {
  parseXmlDocument: xmlParser.parseDocument,
  parseHtmlDocument: htmlParser.parseDocument,

  parseFragment,
  parseXmlFragment: xmlParser.parseFragment,
  parseHtmlFragment: htmlParser.parseFragment
};
