"use strict";

exports.DOMException = require("domexception");
exports.NamedNodeMap = require("./generated/NamedNodeMap").interface;
exports.Attr = require("./generated/Attr").interface;
exports.Node = require("./generated/Node").interface;
exports.Element = require("./generated/Element").interface;
exports.DocumentFragment = require("./generated/DocumentFragment").interface;
exports.Document = exports.HTMLDocument = require("./generated/Document").interface;
exports.XMLDocument = require("./generated/XMLDocument").interface;
exports.CharacterData = require("./generated/CharacterData").interface;
exports.Text = require("./generated/Text").interface;
exports.CDATASection = require("./generated/CDATASection").interface;
exports.ProcessingInstruction = require("./generated/ProcessingInstruction").interface;
exports.Comment = require("./generated/Comment").interface;
exports.DocumentType = require("./generated/DocumentType").interface;
exports.DOMImplementation = require("./generated/DOMImplementation").interface;
exports.NodeList = require("./generated/NodeList").interface;
exports.HTMLCollection = require("./generated/HTMLCollection").interface;
exports.HTMLOptionsCollection = require("./generated/HTMLOptionsCollection").interface;
exports.DOMStringMap = require("./generated/DOMStringMap").interface;
exports.DOMTokenList = require("./generated/DOMTokenList").interface;

exports.HTMLElement = require("./generated/HTMLElement").interface;
exports.HTMLAnchorElement = require("./generated/HTMLAnchorElement").interface;
exports.HTMLAreaElement = require("./generated/HTMLAreaElement").interface;
exports.HTMLAudioElement = require("./generated/HTMLAudioElement.js").interface;
exports.HTMLBaseElement = require("./generated/HTMLBaseElement.js").interface;
exports.HTMLBodyElement = require("./generated/HTMLBodyElement.js").interface;
exports.HTMLBRElement = require("./generated/HTMLBRElement.js").interface;
exports.HTMLButtonElement = require("./generated/HTMLButtonElement.js").interface;
exports.HTMLCanvasElement = require("./generated/HTMLCanvasElement.js").interface;
exports.HTMLDataElement = require("./generated/HTMLDataElement.js").interface;
exports.HTMLDataListElement = require("./generated/HTMLDataListElement.js").interface;
exports.HTMLDetailsElement = require("./generated/HTMLDetailsElement.js").interface;
exports.HTMLDialogElement = require("./generated/HTMLDialogElement.js").interface;
exports.HTMLDirectoryElement = require("./generated/HTMLDirectoryElement.js").interface;
exports.HTMLDivElement = require("./generated/HTMLDivElement.js").interface;
exports.HTMLDListElement = require("./generated/HTMLDListElement.js").interface;
exports.HTMLEmbedElement = require("./generated/HTMLEmbedElement.js").interface;
exports.HTMLFieldSetElement = require("./generated/HTMLFieldSetElement.js").interface;
exports.HTMLFontElement = require("./generated/HTMLFontElement.js").interface;
exports.HTMLFormElement = require("./generated/HTMLFormElement.js").interface;
exports.HTMLFrameElement = require("./generated/HTMLFrameElement.js").interface;
exports.HTMLFrameSetElement = require("./generated/HTMLFrameSetElement.js").interface;
exports.HTMLHeadingElement = require("./generated/HTMLHeadingElement.js").interface;
exports.HTMLHeadElement = require("./generated/HTMLHeadElement.js").interface;
exports.HTMLHRElement = require("./generated/HTMLHRElement.js").interface;
exports.HTMLHtmlElement = require("./generated/HTMLHtmlElement.js").interface;
exports.HTMLIFrameElement = require("./generated/HTMLIFrameElement.js").interface;
exports.HTMLImageElement = require("./generated/HTMLImageElement.js").interface;
exports.HTMLInputElement = require("./generated/HTMLInputElement.js").interface;
exports.HTMLLabelElement = require("./generated/HTMLLabelElement.js").interface;
exports.HTMLLegendElement = require("./generated/HTMLLegendElement.js").interface;
exports.HTMLLIElement = require("./generated/HTMLLIElement.js").interface;
exports.HTMLLinkElement = require("./generated/HTMLLinkElement.js").interface;
exports.HTMLMapElement = require("./generated/HTMLMapElement.js").interface;
exports.HTMLMarqueeElement = require("./generated/HTMLMarqueeElement.js").interface;
exports.HTMLMediaElement = require("./generated/HTMLMediaElement.js").interface;
exports.HTMLMenuElement = require("./generated/HTMLMenuElement.js").interface;
exports.HTMLMetaElement = require("./generated/HTMLMetaElement.js").interface;
exports.HTMLMeterElement = require("./generated/HTMLMeterElement.js").interface;
exports.HTMLModElement = require("./generated/HTMLModElement.js").interface;
exports.HTMLObjectElement = require("./generated/HTMLObjectElement.js").interface;
exports.HTMLOListElement = require("./generated/HTMLOListElement.js").interface;
exports.HTMLOptGroupElement = require("./generated/HTMLOptGroupElement.js").interface;
exports.HTMLOptionElement = require("./generated/HTMLOptionElement.js").interface;
exports.HTMLOutputElement = require("./generated/HTMLOutputElement.js").interface;
exports.HTMLParagraphElement = require("./generated/HTMLParagraphElement.js").interface;
exports.HTMLParamElement = require("./generated/HTMLParamElement.js").interface;
exports.HTMLPictureElement = require("./generated/HTMLPictureElement.js").interface;
exports.HTMLPreElement = require("./generated/HTMLPreElement.js").interface;
exports.HTMLProgressElement = require("./generated/HTMLProgressElement.js").interface;
exports.HTMLQuoteElement = require("./generated/HTMLQuoteElement.js").interface;
exports.HTMLScriptElement = require("./generated/HTMLScriptElement.js").interface;
exports.HTMLSelectElement = require("./generated/HTMLSelectElement.js").interface;
exports.HTMLSlotElement = require("./generated/HTMLSlotElement.js").interface;
exports.HTMLSourceElement = require("./generated/HTMLSourceElement.js").interface;
exports.HTMLSpanElement = require("./generated/HTMLSpanElement.js").interface;
exports.HTMLStyleElement = require("./generated/HTMLStyleElement.js").interface;
exports.HTMLTableCaptionElement = require("./generated/HTMLTableCaptionElement.js").interface;
exports.HTMLTableCellElement = require("./generated/HTMLTableCellElement.js").interface;
exports.HTMLTableColElement = require("./generated/HTMLTableColElement.js").interface;
exports.HTMLTableElement = require("./generated/HTMLTableElement.js").interface;
exports.HTMLTimeElement = require("./generated/HTMLTimeElement.js").interface;
exports.HTMLTitleElement = require("./generated/HTMLTitleElement.js").interface;
exports.HTMLTableRowElement = require("./generated/HTMLTableRowElement.js").interface;
exports.HTMLTableSectionElement = require("./generated/HTMLTableSectionElement.js").interface;
exports.HTMLTemplateElement = require("./generated/HTMLTemplateElement.js").interface;
exports.HTMLTextAreaElement = require("./generated/HTMLTextAreaElement.js").interface;
exports.HTMLTrackElement = require("./generated/HTMLTrackElement.js").interface;
exports.HTMLUListElement = require("./generated/HTMLUListElement.js").interface;
exports.HTMLUnknownElement = require("./generated/HTMLUnknownElement.js").interface;
exports.HTMLVideoElement = require("./generated/HTMLVideoElement.js").interface;

exports.SVGElement = require("./generated/SVGElement.js").interface;
exports.SVGGraphicsElement = require("./generated/SVGGraphicsElement.js").interface;
exports.SVGSVGElement = require("./generated/SVGSVGElement.js").interface;
exports.SVGAnimatedString = require("./generated/SVGAnimatedString").interface;
exports.SVGNumber = require("./generated/SVGNumber").interface;
exports.SVGStringList = require("./generated/SVGStringList").interface;

exports.Event = require("./generated/Event").interface;
exports.CloseEvent = require("./generated/CloseEvent").interface;
exports.CustomEvent = require("./generated/CustomEvent").interface;
exports.MessageEvent = require("./generated/MessageEvent").interface;
exports.ErrorEvent = require("./generated/ErrorEvent").interface;
exports.HashChangeEvent = require("./generated/HashChangeEvent").interface;
exports.InputEvent = require("./generated/InputEvent").interface;
exports.FocusEvent = require("./generated/FocusEvent").interface;
exports.PopStateEvent = require("./generated/PopStateEvent").interface;
exports.UIEvent = require("./generated/UIEvent").interface;
exports.MouseEvent = require("./generated/MouseEvent").interface;
exports.KeyboardEvent = require("./generated/KeyboardEvent").interface;
exports.TouchEvent = require("./generated/TouchEvent").interface;
exports.ProgressEvent = require("./generated/ProgressEvent").interface;
exports.StorageEvent = require("./generated/StorageEvent").interface;
exports.CompositionEvent = require("./generated/CompositionEvent").interface;
exports.WheelEvent = require("./generated/WheelEvent").interface;
exports.EventTarget = require("./generated/EventTarget").interface;

exports.BarProp = require("./generated/BarProp").interface;
exports.Location = require("./generated/Location").interface;
exports.History = require("./generated/History").interface;
exports.Screen = require("./generated/Screen").interface;
exports.Performance = require("./generated/Performance").interface;

exports.Blob = require("./generated/Blob").interface;
exports.File = require("./generated/File").interface;
exports.FileList = require("./generated/FileList").interface;
exports.ValidityState = require("./generated/ValidityState").interface;

exports.DOMParser = require("./generated/DOMParser").interface;
exports.XMLSerializer = require("w3c-xmlserializer/lib/XMLSerializer").interface;

exports.FormData = require("./generated/FormData").interface;
exports.XMLHttpRequestEventTarget = require("./generated/XMLHttpRequestEventTarget").interface;
exports.XMLHttpRequestUpload = require("./generated/XMLHttpRequestUpload").interface;

exports.NodeIterator = require("./generated/NodeIterator").interface;
exports.TreeWalker = require("./generated/TreeWalker").interface;

exports.Storage = require("./generated/Storage").interface;

exports.ShadowRoot = require("./generated/ShadowRoot").interface;

// TODO: Look how to avoid having to make expose the impl
exports.CustomElementRegistry = require("./custom-elements/CustomElementRegistry-impl").implementation;

// These need to be cleaned up...
require("../level2/style").addToCore(exports);
require("../level3/xpath")(exports);

// This one is OK but needs migration to webidl2js eventually.
require("./node-filter")(exports);

exports.URL = require("whatwg-url").URL;
exports.URLSearchParams = require("whatwg-url").URLSearchParams;
