"use strict";

/* eslint global-require: 0 */

const DOMException = require("domexception");

const idlUtils = require("../generated/utils");

const { HTML_NS, SVG_NS } = require("./namespaces");
const { domSymbolTree } = require("./internal-constants");
const reportException = require("./runtime-script-errors");
const {
  CUSTOM_ELEMENT_STATE, CUSTOM_ELEMENT_REACTION_STACK, isValidCustomElementName,
  lookupCEDefinition, upgradeElement
} = require("./custom-elements");

const INTERFACE_MAPPING = {
  // https://html.spec.whatwg.org/multipage/dom.html#elements-in-the-dom%3Aelement-interface
  // https://html.spec.whatwg.org/multipage/indices.html#elements-3
  [HTML_NS]: {
    HTMLElement: {
      file: "../generated/HTMLElement.js",
      tags: [
        "abbr",
        "acronym",
        "address",
        "article",
        "aside",
        "b",
        "basefont",
        "bdi",
        "bdo",
        "big",
        "center",
        "cite",
        "code",
        "dd",
        "dfn",
        "dt",
        "em",
        "figcaption",
        "figure",
        "footer",
        "header",
        "hgroup",
        "i",
        "kbd",
        "main",
        "mark",
        "nav",
        "nobr",
        "noembed",
        "noframes",
        "noscript",
        "plaintext",
        "rb",
        "rp",
        "rt",
        "rtc",
        "ruby",
        "s",
        "samp",
        "section",
        "small",
        "strike",
        "strong",
        "sub",
        "summary",
        "sup",
        "tt",
        "u",
        "var",
        "wbr"
      ]
    },
    HTMLAnchorElement: {
      file: "../generated/HTMLAnchorElement.js",
      tags: ["a"]
    },
    HTMLAreaElement: {
      file: "../generated/HTMLAreaElement.js",
      tags: ["area"]
    },
    HTMLAudioElement: {
      file: "../generated/HTMLAudioElement.js",
      tags: ["audio"]
    },
    HTMLBaseElement: {
      file: "../generated/HTMLBaseElement.js",
      tags: ["base"]
    },
    HTMLBodyElement: {
      file: "../generated/HTMLBodyElement.js",
      tags: ["body"]
    },
    HTMLBRElement: {
      file: "../generated/HTMLBRElement.js",
      tags: ["br"]
    },
    HTMLButtonElement: {
      file: "../generated/HTMLButtonElement.js",
      tags: ["button"]
    },
    HTMLCanvasElement: {
      file: "../generated/HTMLCanvasElement.js",
      tags: ["canvas"]
    },
    HTMLDataElement: {
      file: "../generated/HTMLDataElement.js",
      tags: ["data"]
    },
    HTMLDataListElement: {
      file: "../generated/HTMLDataListElement.js",
      tags: ["datalist"]
    },
    HTMLDetailsElement: {
      file: "../generated/HTMLDetailsElement.js",
      tags: ["details"]
    },
    HTMLDialogElement: {
      file: "../generated/HTMLDialogElement.js",
      tags: ["dialog"]
    },
    HTMLDirectoryElement: {
      file: "../generated/HTMLDirectoryElement.js",
      tags: ["dir"]
    },
    HTMLDivElement: {
      file: "../generated/HTMLDivElement.js",
      tags: ["div"]
    },
    HTMLDListElement: {
      file: "../generated/HTMLDListElement.js",
      tags: ["dl"]
    },
    HTMLEmbedElement: {
      file: "../generated/HTMLEmbedElement.js",
      tags: ["embed"]
    },
    HTMLFieldSetElement: {
      file: "../generated/HTMLFieldSetElement.js",
      tags: ["fieldset"]
    },
    HTMLFontElement: {
      file: "../generated/HTMLFontElement.js",
      tags: ["font"]
    },
    HTMLFormElement: {
      file: "../generated/HTMLFormElement.js",
      tags: ["form"]
    },
    HTMLFrameElement: {
      file: "../generated/HTMLFrameElement.js",
      tags: ["frame"]
    },
    HTMLFrameSetElement: {
      file: "../generated/HTMLFrameSetElement.js",
      tags: ["frameset"]
    },
    HTMLHeadingElement: {
      file: "../generated/HTMLHeadingElement.js",
      tags: ["h1", "h2", "h3", "h4", "h5", "h6"]
    },
    HTMLHeadElement: {
      file: "../generated/HTMLHeadElement.js",
      tags: ["head"]
    },
    HTMLHRElement: {
      file: "../generated/HTMLHRElement.js",
      tags: ["hr"]
    },
    HTMLHtmlElement: {
      file: "../generated/HTMLHtmlElement.js",
      tags: ["html"]
    },
    HTMLIFrameElement: {
      file: "../generated/HTMLIFrameElement.js",
      tags: ["iframe"]
    },
    HTMLImageElement: {
      file: "../generated/HTMLImageElement.js",
      tags: ["img"]
    },
    HTMLInputElement: {
      file: "../generated/HTMLInputElement.js",
      tags: ["input"]
    },
    HTMLLabelElement: {
      file: "../generated/HTMLLabelElement.js",
      tags: ["label"]
    },
    HTMLLegendElement: {
      file: "../generated/HTMLLegendElement.js",
      tags: ["legend"]
    },
    HTMLLIElement: {
      file: "../generated/HTMLLIElement.js",
      tags: ["li"]
    },
    HTMLLinkElement: {
      file: "../generated/HTMLLinkElement.js",
      tags: ["link"]
    },
    HTMLMapElement: {
      file: "../generated/HTMLMapElement.js",
      tags: ["map"]
    },
    HTMLMarqueeElement: {
      file: "../generated/HTMLMarqueeElement.js",
      tags: ["marquee"]
    },
    HTMLMediaElement: {
      file: "../generated/HTMLMediaElement.js",
      tags: []
    },
    HTMLMenuElement: {
      file: "../generated/HTMLMenuElement.js",
      tags: ["menu"]
    },
    HTMLMetaElement: {
      file: "../generated/HTMLMetaElement.js",
      tags: ["meta"]
    },
    HTMLMeterElement: {
      file: "../generated/HTMLMeterElement.js",
      tags: ["meter"]
    },
    HTMLModElement: {
      file: "../generated/HTMLModElement.js",
      tags: ["del", "ins"]
    },
    HTMLObjectElement: {
      file: "../generated/HTMLObjectElement.js",
      tags: ["object"]
    },
    HTMLOListElement: {
      file: "../generated/HTMLOListElement.js",
      tags: ["ol"]
    },
    HTMLOptGroupElement: {
      file: "../generated/HTMLOptGroupElement.js",
      tags: ["optgroup"]
    },
    HTMLOptionElement: {
      file: "../generated/HTMLOptionElement.js",
      tags: ["option"]
    },
    HTMLOutputElement: {
      file: "../generated/HTMLOutputElement.js",
      tags: ["output"]
    },
    HTMLParagraphElement: {
      file: "../generated/HTMLParagraphElement.js",
      tags: ["p"]
    },
    HTMLParamElement: {
      file: "../generated/HTMLParamElement.js",
      tags: ["param"]
    },
    HTMLPictureElement: {
      file: "../generated/HTMLPictureElement.js",
      tags: ["picture"]
    },
    HTMLPreElement: {
      file: "../generated/HTMLPreElement.js",
      tags: ["listing", "pre", "xmp"]
    },
    HTMLProgressElement: {
      file: "../generated/HTMLProgressElement.js",
      tags: ["progress"]
    },
    HTMLQuoteElement: {
      file: "../generated/HTMLQuoteElement.js",
      tags: ["blockquote", "q"]
    },
    HTMLScriptElement: {
      file: "../generated/HTMLScriptElement.js",
      tags: ["script"]
    },
    HTMLSelectElement: {
      file: "../generated/HTMLSelectElement.js",
      tags: ["select"]
    },
    HTMLSlotElement: {
      file: "../generated/HTMLSlotElement.js",
      tags: ["slot"]
    },
    HTMLSourceElement: {
      file: "../generated/HTMLSourceElement.js",
      tags: ["source"]
    },
    HTMLSpanElement: {
      file: "../generated/HTMLSpanElement.js",
      tags: ["span"]
    },
    HTMLStyleElement: {
      file: "../generated/HTMLStyleElement.js",
      tags: ["style"]
    },
    HTMLTableCaptionElement: {
      file: "../generated/HTMLTableCaptionElement.js",
      tags: ["caption"]
    },
    HTMLTableCellElement: {
      file: "../generated/HTMLTableCellElement.js",
      tags: ["th", "td"]
    },
    HTMLTableColElement: {
      file: "../generated/HTMLTableColElement.js",
      tags: ["col", "colgroup"]
    },
    HTMLTableElement: {
      file: "../generated/HTMLTableElement.js",
      tags: ["table"]
    },
    HTMLTimeElement: {
      file: "../generated/HTMLTimeElement.js",
      tags: ["time"]
    },
    HTMLTitleElement: {
      file: "../generated/HTMLTitleElement.js",
      tags: ["title"]
    },
    HTMLTableRowElement: {
      file: "../generated/HTMLTableRowElement.js",
      tags: ["tr"]
    },
    HTMLTableSectionElement: {
      file: "../generated/HTMLTableSectionElement.js",
      tags: ["thead", "tbody", "tfoot"]
    },
    HTMLTemplateElement: {
      file: "../generated/HTMLTemplateElement.js",
      tags: ["template"]
    },
    HTMLTextAreaElement: {
      file: "../generated/HTMLTextAreaElement.js",
      tags: ["textarea"]
    },
    HTMLTrackElement: {
      file: "../generated/HTMLTrackElement.js",
      tags: ["track"]
    },
    HTMLUListElement: {
      file: "../generated/HTMLUListElement.js",
      tags: ["ul"]
    },
    HTMLUnknownElement: {
      file: "../generated/HTMLUnknownElement.js",
      tags: []
    },
    HTMLVideoElement: {
      file: "../generated/HTMLVideoElement.js",
      tags: ["video"]
    }
  },
  [SVG_NS]: {
    SVGElement: {
      file: "../generated/SVGElement.js",
      tags: []
    },
    SVGGraphicsElement: {
      file: "../generated/SVGGraphicsElement.js",
      tags: []
    },
    SVGSVGElement: {
      file: "../generated/SVGSVGElement.js",
      tags: ["svg"]
    }
  }
};

const LEGACY_UNKNOWN_ELEMENTS = new Set([
  "applet",
  "bgsound",
  "blink",
  "isindex",
  "keygen",
  "multicol",
  "nextid",
  "spacer"
]);

const OTHER_HTMLELEMENTS = new Set([
  "acronym",
  "basefont",
  "big",
  "center",
  "nobr",
  "noembed",
  "noframes",
  "plaintext",
  "rb",
  "rtc",
  "strike",
  "tt"
]);

const OTHER_HTMLPREELEMENTS = new Set([
  "listing",
  "xmp"
]);

/**
 * The create element algorithm, requires to have access to all the elements interfaces to pick up
 * the right one based on the requested name and namespace. However, requiring all those interfaces
 * in advances introduce circular dependencies issues.
 *
 * The InterfaceCache, lazily requires and cache the right interfaces to avoid running into the circular
 * dependencies issues.
 */
class InterfaceCache {
  constructor(mapping) {
    this._elementNamespaceNameLookup = {};
    this._interfaceNameLookup = {};

    // TODO: Change the mapping structure to accommodate the element cache entry
    // Element doesn't belong to any namespace
    this._ElementCacheEntry = {
      file: "../generated/Element.js",
      module: null
    };

    this._populate(mapping);
  }

  _populate(mapping) {
    for (const [namespace, interfaces] of Object.entries(mapping)) {
      this._elementNamespaceNameLookup[namespace] = {};

      for (const [interfaceName, { file, tags }] of Object.entries(interfaces)) {
        const cacheEntry = {
          file,
          module: null
        };

        this._interfaceNameLookup[interfaceName] = cacheEntry;

        for (const tag of tags) {
          this._elementNamespaceNameLookup[namespace][tag] = cacheEntry;
        }
      }
    }
  }

  _resolveEntry(entry) {
    if (entry.module === null) {
      entry.module = require(entry.file);
    }

    return entry.module;
  }

  getByInterfaceName(interfaceName) {
    if (this._interfaceNameLookup[interfaceName]) {
      return this._resolveEntry(this._interfaceNameLookup[interfaceName]);
    }

    return null;
  }

  getByElementNamespaceAndName(namespace, name) {
    if (namespace === HTML_NS) {
      // https://html.spec.whatwg.org/multipage/dom.html#htmlelement

      if (LEGACY_UNKNOWN_ELEMENTS.has(name)) {
        return this._resolveEntry(this._interfaceNameLookup.HTMLUnknownElement);
      }

      if (OTHER_HTMLELEMENTS.has(name)) {
        return this._resolveEntry(this._interfaceNameLookup.HTMLElement);
      }

      if (OTHER_HTMLPREELEMENTS.has(name)) {
        return this._resolveEntry(this._interfaceNameLookup.HTMLPreElement);
      }

      if (this._elementNamespaceNameLookup[HTML_NS][name]) {
        return this._resolveEntry(this._elementNamespaceNameLookup[HTML_NS][name]);
      }

      if (isValidCustomElementName(name)) {
        return this._resolveEntry(this._interfaceNameLookup.HTMLElement);
      }

      return this._resolveEntry(this._interfaceNameLookup.HTMLUnknownElement);
    }

    if (namespace === SVG_NS) {
      if (this._elementNamespaceNameLookup[SVG_NS][name]) {
        return this._resolveEntry(this._elementNamespaceNameLookup[SVG_NS][name]);
      }

      return this._resolveEntry(this._interfaceNameLookup.SVGSVGElement);
    }

    // https://dom.spec.whatwg.org/#concept-element-interface
    return this._resolveEntry(this._ElementCacheEntry);
  }
}

const INTERFACE_CACHE = new InterfaceCache(INTERFACE_MAPPING);

// https://dom.spec.whatwg.org/#concept-create-element
function createElement(document, localName, namespace, prefix = null, is = null, syncCustomElement = false) {
  const window = document._defaultView;
  let result = null;

  const definition = lookupCEDefinition(document, namespace, localName, is);

  if (definition && definition.name !== localName) {
    const elementInterface = INTERFACE_CACHE.getByElementNamespaceAndName(HTML_NS, localName);

    result = elementInterface.createImpl([], {
      localName,
      namespace: HTML_NS,
      prefix,
      customElementState: CUSTOM_ELEMENT_STATE.UNDEFINED,
      customElementDefinition: null,
      isValue: is,
      ownerDocument: document
    });

    if (syncCustomElement) {
      // TODO: Add spec bug, missing catching and error reporting. Is it the right place to put the try/catch ?
      try {
        upgradeElement(definition, result);
      } catch (error) {
        reportException(window, error);
      }
    } else {
      CUSTOM_ELEMENT_REACTION_STACK.enqueueCEUpgradeReaction(result, definition);
    }
  } else if (definition) {
    if (syncCustomElement) {
      try {
        const C = definition.constructor;

        const resultWrapper = new C();
        result = idlUtils.implForWrapper(resultWrapper);

        // TODO: Fix this piece of code later
        // let proto = result;
        // const HTMLElement = INTERFACE_CACHE.getByInterfaceName("HTMLElement");
        // while (true) {
        //   proto = Object.getPrototypeOf(proto);
        //   if (proto === HTMLElement.interface) {
        //     break;
        //   } else if (proto === undefined) {
        //     throw new TypeError("TODO");
        //   }
        // }

        if (result._attributeList.length) {
          throw new DOMException("TODO", "NotSupportedError");
        }
        if (domSymbolTree.childrenCount(result)) {
          throw new DOMException("TODO", "NotSupportedError");
        }
        if (domSymbolTree.parent(result)) {
          throw new DOMException("TODO", "NotSupportedError");
        }
        if (result._ownerDocument !== document) {
          throw new DOMException("TODO", "NotSupportedError");
        }
        if (result._localName !== localName) {
          throw new DOMException("TODO", "NotSupportedError");
        }

        result._prefix = prefix;
        result._isValue = null;
      } catch (error) {
        reportException(window, error);

        const HTMLUnknownElement = INTERFACE_CACHE.getByInterfaceName("HTMLUnknownElement");
        result = HTMLUnknownElement.createImpl([], {
          localName,
          namespace: HTML_NS,
          prefix,
          customElementState: CUSTOM_ELEMENT_STATE.FAILED,
          customElementDefinition: null,
          isValue: null,
          ownerDocument: document
        });
      }
    } else {
      const HTMLElement = INTERFACE_CACHE.getByInterfaceName("HTMLElement");
      result = HTMLElement.createImpl([], {
        localName,
        namespace: HTML_NS,
        prefix,
        customElementState: CUSTOM_ELEMENT_STATE.UNDEFINED,
        customElementDefinition: null,
        isValue: null,
        ownerDocument: document
      });

      CUSTOM_ELEMENT_REACTION_STACK.enqueueCEUpgradeReaction(result, definition);
    }
  } else {
    const elementInterface = INTERFACE_CACHE.getByElementNamespaceAndName(namespace, localName);
    result = elementInterface.createImpl([], {
      localName,
      namespace,
      prefix,
      customElementState: CUSTOM_ELEMENT_STATE.UNCUSTOMZIED,
      customElementDefinition: null,
      isValue: is,
      ownerDocument: document
    });

    if (namespace === HTML_NS && (isValidCustomElementName(localName) || is)) {
      result._customElementState = CUSTOM_ELEMENT_STATE.UNDEFINED;
    }
  }

  return result;
}

const ALREADY_CONSTRUCTED_MARKER = "ALREADY_CONSTRUCTED_MARKER";

function patchHTMLElementConstructors(window) {
  for (const interfaceName of Object.keys(INTERFACE_MAPPING[HTML_NS])) {
    const originalConstructor = window[interfaceName];

    // https://html.spec.whatwg.org/multipage/dom.html#html-element-constructors
    function patchedHTMLElementConstructor() {
      const newTarget = new.target;

      if (!newTarget) {
        throw new TypeError("Illegal constructor");
      }

      if (newTarget === patchedHTMLElementConstructor) {
        throw new TypeError("Illegal constructor");
      }

      const definition = window.customElements._customElementDefinitions.find(entry => {
        return entry.constructor === newTarget;
      });

      if (!definition) {
        throw new TypeError("Illegal constructor");
      }

      let isValue = null;

      if (definition.localName === definition.name) {
        if (interfaceName !== "HTMLElement") {
          throw new TypeError("TODO");
        }
      } else {
        const validNames = INTERFACE_MAPPING[HTML_NS][interfaceName].tags;

        if (!validNames.includes(definition.localName)) {
          throw new TypeError("TODO");
        }

        isValue = definition.name;
      }

      const { prototype } = newTarget;

      if (definition.constructionStack.length === 0) {
        const elementInterface = INTERFACE_CACHE.getByInterfaceName(interfaceName);
        const ownerDocument = idlUtils.implForWrapper(window._document);

        const element = elementInterface.create([], {
          localName: definition.localName,
          namespace: HTML_NS,
          prefix: null,
          customElementState: CUSTOM_ELEMENT_STATE.CUSTOM,
          customElementDefinition: definition,
          isValue,
          ownerDocument
        });

        Object.setPrototypeOf(element, prototype);

        return element;
      }

      const element = definition.constructionStack[definition.constructionStack.length - 1];
      if (element === ALREADY_CONSTRUCTED_MARKER) {
        throw new DOMException("TODO", "InvalidStateError");
      }

      const wrapperElement = idlUtils.wrapperForImpl(element);
      Object.setPrototypeOf(wrapperElement, prototype);

      definition.constructionStack.pop();
      definition.constructionStack.push(ALREADY_CONSTRUCTED_MARKER);

      return wrapperElement;
    }
    patchedHTMLElementConstructor.prototype = originalConstructor.prototype;

    window[interfaceName] = patchedHTMLElementConstructor;
  }
}

module.exports = {
  INTERFACE_CACHE,

  createElement,
  patchHTMLElementConstructors
};
