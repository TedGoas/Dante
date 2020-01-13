"use strict";

const { CUSTOM_ELEMENT_REACTION_STACK } = require("./custom-elements");

/**
 * Mapping of all the property interfaces that are marked with the [CEReaction] attributes.
 */
const CE_REACTIONS_INTERFACES = {
  HTMLMetaElement: [
    "name",
    "httpEquiv",
    "content",
    "scheme"
  ],
  HTMLOutputElement: [
    "name",
    "defaultValue",
    "value"
  ],
  ParentNode: [
    "prepend",
    "append"
  ],
  HTMLMapElement: ["name"],
  HTMLImageElement: [
    "alt",
    "src",
    "srcset",
    "sizes",
    "crossOrigin",
    "useMap",
    "isMap",
    "width",
    "height",
    "referrerPolicy",
    "name",
    "lowsrc",
    "align",
    "hspace",
    "vspace",
    "longDesc",
    "border"
  ],
  ChildNode: [
    "before",
    "after",
    "replaceWith",
    "remove"
  ],
  CharacterData: [
    // Inherited from: ChildNode
    "before",
    "after",
    "replaceWith",
    "remove"
  ],
  HTMLQuoteElement: ["cite"],
  HTMLTableCaptionElement: ["align"],
  HTMLDataElement: ["value"],
  HTMLTitleElement: ["text"],
  HTMLStyleElement: [
    "media",
    "nonce",
    "type"
  ],
  ShadowRoot: ["innerHTML"],
  HTMLMediaElement: [
    "src",
    "crossOrigin",
    "preload",
    "autoplay",
    "loop",
    "controls",
    "defaultMuted"
  ],
  HTMLMenuElement: ["compact"],
  HTMLDialogElement: [
    "open",
    "show",
    "showModal",
    "close"
  ],
  HTMLTableCellElement: [
    "colSpan",
    "rowSpan",
    "headers",
    "scope",
    "abbr",
    "align",
    "axis",
    "height",
    "width",
    "ch",
    "chOff",
    "noWrap",
    "vAlign",
    "bgColor"
  ],
  HTMLParagraphElement: ["align"],
  HTMLOptionsCollection: [
    "length",
    "void",
    "add",
    "remove"
  ],
  HTMLObjectElement: [
    "data",
    "type",
    "typeMustMatch",
    "name",
    "useMap",
    "width",
    "height",
    "align",
    "archive",
    "code",
    "declare",
    "hspace",
    "standby",
    "vspace",
    "codeBase",
    "codeType",
    "border"
  ],
  HTMLAnchorElement: [
    "target",
    "download",
    "ping",
    "rel",
    "hreflang",
    "type",
    "text",
    "referrerPolicy",
    "coords",
    "charset",
    "name",
    "rev",
    "shape"
  ],
  HTMLHtmlElement: ["version"],
  HTMLBRElement: ["clear"],
  HTMLBodyElement: [
    "text",
    "link",
    "vLink",
    "aLink",
    "bgColor",
    "background"
  ],
  HTMLFontElement: [
    "color",
    "face",
    "size"
  ],
  HTMLIFrameElement: [
    "src",
    "srcdoc",
    "name",
    "allowFullscreen",
    "allowPaymentRequest",
    "allowUserMedia",
    "width",
    "height",
    "referrerPolicy",
    "align",
    "scrolling",
    "frameBorder",
    "longDesc",
    "marginHeight",
    "marginWidth"
  ],
  HTMLDListElement: ["compact"],
  HTMLMeterElement: [
    "value",
    "min",
    "max",
    "low",
    "high",
    "optimum"

  ],
  HTMLHRElement: [
    "align",
    "color",
    "noShade",
    "size",
    "width"
  ],
  HTMLLinkElement: [
    "href",
    "crossOrigin",
    "rel",
    "as",
    "media",
    "nonce",
    "integrity",
    "hreflang",
    "type",
    "referrerPolicy",
    "scope",
    "workerType",
    "updateViaCache",
    "charset",
    "rev",
    "target"
  ],
  HTMLSourceElement: [
    "src",
    "type",
    "srcset",
    "sizes",
    "media"

  ],
  HTMLTrackElement: [
    "kind",
    "src",
    "srclang",
    "label",
    "default"
  ],
  HTMLLegendElement: ["align"],
  HTMLLabelElement: ["htmlFor"],
  HTMLTableElement: [
    "caption",
    "deleteCaption",
    "tHead",
    "deleteTHead",
    "tFoot",
    "deleteTFoot",
    "deleteRow",
    "align",
    "border",
    "frame",
    "rules",
    "summary",
    "width",
    "bgColor",
    "cellPadding",
    "cellSpacing"
  ],
  HTMLMarqueeElement: [
    "behavior",
    "bgColor",
    "direction",
    "height",
    "hspace",
    "loop",
    "scrollAmount",
    "scrollDelay",
    "trueSpeed",
    "vspace",
    "width"
  ],
  HTMLDirectoryElement: ["compact"],
  HTMLParamElement: [

    "name",
    "value",
    "type",
    "valueType"
  ],
  HTMLTableColElement: [
    "span",
    "align",
    "ch",
    "chOff",
    "vAlign",
    "width"
  ],
  HTMLTableSectionElement: [
    "deleteRow",
    "align",
    "ch",
    "chOff",
    "vAlign"
  ],
  HTMLFrameSetElement: [
    "cols",
    "rows"
  ],
  HTMLLIElement: [

    "value",
    "type"
  ],
  HTMLFormElement: [
    "acceptCharset",
    "action",
    "autocomplete",
    "enctype",
    "encoding",
    "method",
    "name",
    "noValidate",
    "target",
    "reset"
  ],
  HTMLCanvasElement: [
    "width",
    "height"
  ],
  HTMLInputElement: [

    "accept",
    "alt",
    "autocomplete",
    "autofocus",
    "defaultChecked",
    "dirName",
    "disabled",
    "formAction",
    "formEnctype",
    "formMethod",
    "formNoValidate",
    "formTarget",
    "height",
    "inputMode",
    "max",
    "maxLength",
    "min",
    "minLength",
    "multiple",
    "name",
    "pattern",
    "placeholder",
    "readOnly",
    "required",
    "size",
    "src",
    "step",
    "type",
    "defaultValue",
    "value",
    "width",
    "align",
    "useMap"
  ],
  HTMLDetailsElement: ["open"],

  HTMLTableRowElement: [
    "deleteCell",
    "align",
    "ch",
    "chOff",
    "vAlign",
    "bgColor"
  ],
  HTMLTimeElement: ["dateTime"],
  DOMStringMap: ["void"],
  HTMLElement: [
    "title",
    "lang",
    "translate",
    "dir",
    "hidden",
    "tabIndex",
    "accessKey",
    "draggable",
    "spellcheck",
    "innerText"
  ],
  HTMLProgressElement: [
    "value",
    "max"
  ],
  HTMLDivElement: ["align"],
  Element: [
    "id",
    "className",
    "slot",
    "setAttribute",
    "setAttributeNS",
    "removeAttribute",
    "removeAttributeNS",
    "toggleAttribute",
    "setAttributeNode",
    "setAttributeNodeNS",
    "removeAttributeNode",
    "insertAdjacentElement",
    "innerHTML",
    "outerHTML",
    "insertAdjacentHTML",

    // Inherited from: ChildNode
    "before",
    "after",
    "replaceWith",
    "remove",

    // Inherited from: ParentNode
    "prepend",
    "append"
  ],
  HTMLBaseElement: [
    "href",
    "target"
  ],
  HTMLHyperlinkElementUtils: [

    "href",
    "protocol",
    "username",
    "password",
    "host",
    "hostname",
    "port",
    "pathname",
    "search",
    "hash"
  ],
  HTMLSelectElement: [
    "autocomplete",
    "autofocus",
    "disabled",
    "multiple",
    "name",
    "required",
    "size",
    "length",
    "add",
    "remove",
    "remove",
    "void"
  ],
  HTMLAreaElement: [
    "alt",
    "coords",
    "shape",
    "target",
    "download",
    "ping",
    "rel",
    "referrerPolicy",
    "noHref"
  ],
  HTMLHeadingElement: ["align"],
  HTMLTextAreaElement: [

    "autocomplete",
    "autofocus",
    "cols",
    "dirName",
    "disabled",
    "inputMode",
    "maxLength",
    "minLength",
    "name",
    "placeholder",
    "readOnly",
    "required",
    "rows",
    "wrap",
    "defaultValue",
    "value"
  ],
  HTMLButtonElement: [

    "autofocus",
    "disabled",
    "formAction",
    "formEnctype",
    "formMethod",
    "formNoValidate",
    "formTarget",
    "name",
    "type",
    "value"
  ],
  HTMLUListElement: [
    "compact",
    "type"
  ],
  Node: [
    "nodeValue",
    "textContent",
    "normalize",
    "cloneNode",
    "insertBefore",
    "appendChild",
    "replaceChild",
    "removeChild"
  ],
  HTMLModElement: [
    "cite",
    "dateTime"
  ],
  HTMLScriptElement: [
    "src",
    "type",
    "noModule",
    "async",
    "defer",
    "crossOrigin",
    "text",
    "nonce",
    "integrity",
    "charset",
    "event",
    "htmlFor"
  ],
  HTMLPreElement: ["width"],
  HTMLEmbedElement: [
    "src",
    "type",
    "width",
    "height",
    "align",
    "name"
  ],
  HTMLVideoElement: [
    "width",
    "height",
    "poster",
    "playsInline"
  ],
  HTMLFrameElement: [
    "name",
    "scrolling",
    "src",
    "frameBorder",
    "longDesc",
    "noResize",
    "marginHeight",
    "marginWidth"
  ],
  DOMTokenList: [
    "add",
    "remove",
    "toggle",
    "replace",
    "value"
  ],
  HTMLSlotElement: ["name"],
  Document: [
    "createElement",
    "createElementNS",
    "importNode",
    "adoptNode",
    "title",
    "dir",
    "body",
    "open",
    "close",
    "write",
    "writeln",
    "designMode",
    "execCommand",
    "fgColor",
    "linkColor",
    "vlinkColor",
    "alinkColor",
    "bgColor",

    // Inherited from: ParentNode
    "prepend",
    "append"
  ],
  DocumentType: [
    // Inherited from: ChildNode
    "before",
    "after",
    "replaceWith",
    "remove"
  ],
  DocumentFragment: [
    // Inherited from: ParentNode
    "prepend",
    "append"
  ],
  HTMLFieldSetElement: [
    "disabled",
    "name"
  ],
  HTMLOListElement: [
    "reversed",
    "start",
    "type",
    "compact"
  ],
  ElementContentEditable: ["contentEditable"],
  HTMLOptGroupElement: [
    "disabled",
    "label"
  ],
  HTMLOptionElement: [
    "disabled",
    "label",
    "defaultSelected",
    "value",
    "text"
  ],
  NamedNodeMap: [
    "setNamedItem",
    "setNamedItemNS",
    "removeNamedItem",
    "removeNamedItemNS"
  ],
  CustomElementRegistry: [
    "define",
    "upgrade"
  ],
  Attr: [
    "value",

    // Inherited from: Node
    "nodeValue",
    "textContent"
  ],
  CSSStyleDeclaration: [
    "cssText",
    "setProperty",
    "removeProperty",
    "cssFloat"
  ]
};

function patchWithCEReaction(original) {
  // https://html.spec.whatwg.org/multipage/custom-elements.html#cereactions
  return function CEReaction(...args) {
    CUSTOM_ELEMENT_REACTION_STACK.push([]);

    let value;
    let exception;
    try {
      value = original.apply(this, args);
    } catch (error) {
      exception = error;
    }

    const queue = CUSTOM_ELEMENT_REACTION_STACK.pop();
    CUSTOM_ELEMENT_REACTION_STACK.invokeCEReactions(queue);

    if (exception !== undefined) {
      throw exception;
    }

    return value;
  };
}

// Avoid patching multiple times the same prototype, for example when multiple windows get created.
// TODO: Evaluate the feasability to patch in the living/indx instead of the window, since the patching is done at the
// prototype level.
const CE_REACTION_SYMBOL = Symbol("CEReaction");

function patchCEReactionProperties(window) {
  for (const [interfaceName, properties] of Object.entries(CE_REACTIONS_INTERFACES)) {
    if (!(interfaceName in window)) {
      continue;
    }

    const proto = window[interfaceName].prototype;

    if (proto.hasOwnProperty(CE_REACTION_SYMBOL)) {
      continue;
    }
    proto[CE_REACTION_SYMBOL] = true;

    for (const property of properties) {
      const originalPropertyDescriptor = Object.getOwnPropertyDescriptor(proto, property);
      if (!originalPropertyDescriptor) {
        continue;
      }

      const patchedPropertyDescriptor = Object.assign({}, originalPropertyDescriptor);
      const { value: originalValue, get: originalGet, set: originalSet } = originalPropertyDescriptor;

      if (originalValue !== undefined) {
        patchedPropertyDescriptor.value = patchWithCEReaction(originalValue);
      } else {
        if (originalGet !== undefined) {
          patchedPropertyDescriptor.get = patchWithCEReaction(originalGet);
        }

        if (originalSet !== undefined) {
          patchedPropertyDescriptor.set = patchWithCEReaction(originalSet);
        }
      }

      Object.defineProperty(proto, property, patchedPropertyDescriptor);
    }
  }
}

module.exports = {
  patchCEReactionProperties
};
