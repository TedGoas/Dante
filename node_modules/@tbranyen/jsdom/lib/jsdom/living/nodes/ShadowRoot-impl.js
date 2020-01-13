"use strict";

const { parseFragment } = require("../../browser/parser");
const { fragmentSerialization } = require("../domparsing/serialization.js");

const { getRoot } = require("../helpers/shadow-dom");

const DocumentFragment = require("./DocumentFragment-impl").implementation;

class ShadowRootImpl extends DocumentFragment {
  constructor(args, privateData) {
    super(args, privateData);

    const { mode, host } = privateData;
    this._mode = mode;
    this._host = host;
  }

  _getTheParent(event) {
    if (!event.composed && this === getRoot(event._path[0].item)) {
      return null;
    }

    return this._host;
  }

  get mode() {
    return this._mode;
  }

  get host() {
    return this._host;
  }

  // https://w3c.github.io/DOM-Parsing/#dfn-innerhtml
  get innerHTML() {
    return fragmentSerialization(this, { requireWellFormed: true });
  }

  set innerHTML(value) {
    // Note: Using the host as the context object for now. Aligning with Blink and Webkit behavior until the
    // issue is resolved. https://github.com/w3c/DOM-Parsing/issues/21#issuecomment-431791063
    const fragment = parseFragment(value, this._host);

    this._replaceAll(fragment);
  }
}

module.exports = {
  implementation: ShadowRootImpl
};
