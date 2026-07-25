/**
 * Moves trailing attribution ` … - [Author](url)` inside a single-paragraph
 * blockquote into `<footer>` so it matches pullquote/footer CSS.
 * Supports hyphen, en dash, and em dash before the Markdown link.
 */

function escapeAttr(raw) {
  return String(raw)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;");
}

function peelTrailingCitation(children, escapeHtml) {
  if (!children || children.length < 4) return null;

  const last = children[children.length - 1];
  const citeTextTok = children[children.length - 2];
  const linkOpenTok = children[children.length - 3];
  const bodyTok = children[children.length - 4];

  if (last.type !== "link_close") return null;
  if (citeTextTok.type !== "text") return null;
  if (linkOpenTok.type !== "link_open" || linkOpenTok.tag !== "a") return null;
  if (bodyTok.type !== "text") return null;

  const splitRe = /\s([-–—])\s$/u;
  const m = splitRe.exec(bodyTok.content);
  if (!m) return null;

  bodyTok.content = bodyTok.content.slice(0, m.index);

  const authorPlain = citeTextTok.content.trim();
  const attr = Array.isArray(linkOpenTok.attrs)
    ? linkOpenTok.attrs.find((a) => a[0] === "href")
    : null;
  const rawHref = (attr && attr[1]) || "";
  const href = escapeAttr(rawHref);

  return `<a href="${href}">${escapeHtml(authorPlain)}</a>`;
}

module.exports = function markdownItblockquoteAttribution(md) {
  const escapeHtml = md.utils.escapeHtml;

  const originalClose =
    md.renderer.rules.blockquote_close ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.core.ruler.after("inline", "blockquote_attribution_footer", (state) => {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type !== "blockquote_open") continue;

      let depth = 0;
      let closeIdx = -1;
      for (let j = i; j < tokens.length; j++) {
        if (tokens[j].type === "blockquote_open") depth++;
        else if (tokens[j].type === "blockquote_close") {
          depth--;
          if (depth === 0) {
            closeIdx = j;
            break;
          }
        }
      }
      if (closeIdx < 0) continue;

      const inner = tokens.slice(i + 1, closeIdx);
      const onlyOneParagraph =
        inner.length === 3 &&
        inner[0].type === "paragraph_open" &&
        inner[1].type === "inline" &&
        inner[2].type === "paragraph_close";

      if (!onlyOneParagraph) {
        i = closeIdx;
        continue;
      }

      const inline = inner[1];
      const children = inline.children;
      const innerFooter = peelTrailingCitation(children, escapeHtml);
      if (!innerFooter) {
        i = closeIdx;
        continue;
      }

      children.splice(children.length - 3, 3);

      tokens[closeIdx].meta = tokens[closeIdx].meta || {};
      tokens[closeIdx].meta.attribution_footer_html =
        `<footer>${innerFooter}</footer>\n`;

      i = closeIdx;
    }
  });

  md.renderer.rules.blockquote_close = (tokens, idx, options, env, self) => {
    let html = "";
    const extra = tokens[idx].meta?.attribution_footer_html;
    if (extra) html += extra;
    html += originalClose(tokens, idx, options, env, self);
    return html;
  };
};
