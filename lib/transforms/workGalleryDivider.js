const dividerMarkup = require('../snippets/dividerMarkup');

/**
 * Find each work-gallery__item figure with correct nesting so nested
 * work-gallery__thumb figures do not end the match early.
 */
function replaceWorkGalleryItems(content, replacer) {
  const openRe = /<figure class="work-gallery__item[^"]*">/g;
  let result = '';
  let lastIndex = 0;
  let match;

  while ((match = openRe.exec(content)) !== null) {
    const start = match.index;
    const openTag = match[0];
    let depth = 1;
    let i = start + openTag.length;
    let end = -1;

    while (i < content.length && depth > 0) {
      const nextOpen = content.indexOf('<figure', i);
      const nextClose = content.indexOf('</figure>', i);

      if (nextClose === -1) {
        break;
      }

      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth += 1;
        i = nextOpen + 7;
        continue;
      }

      depth -= 1;
      i = nextClose + '</figure>'.length;

      if (depth === 0) {
        end = i;
      }
    }

    if (end === -1) {
      continue;
    }

    const full = content.slice(start, end);
    const inner = content.slice(start + openTag.length, end - '</figure>'.length);
    result += content.slice(lastIndex, start) + replacer(full, inner, openTag);
    lastIndex = end;
    openRe.lastIndex = end;
  }

  return result + content.slice(lastIndex);
}

function isDivOpenTag(html, index) {
  if (!html.startsWith('<div', index)) {
    return false;
  }
  const after = html[index + 4];
  return after === ' ' || after === '>' || after === '\n' || after === '\r' || after === '\t';
}

/**
 * Return { start, end, html } for a balanced work-gallery__thumbs div,
 * or null if not found / unbalanced.
 */
function extractThumbsBlock(html, fromIndex) {
  const openRe = /<div class="work-gallery__thumbs[^"]*"[^>]*>/;
  const openMatch = openRe.exec(html.slice(fromIndex));
  if (!openMatch) {
    return null;
  }

  const start = fromIndex + openMatch.index;
  let depth = 1;
  let i = start + openMatch[0].length;

  while (i < html.length && depth > 0) {
    const nextOpen = html.indexOf('<div', i);
    const nextClose = html.indexOf('</div>', i);

    if (nextClose === -1) {
      return null;
    }

    if (nextOpen !== -1 && nextOpen < nextClose && isDivOpenTag(html, nextOpen)) {
      depth += 1;
      i = nextOpen + 4;
      continue;
    }

    if (nextOpen !== -1 && nextOpen < nextClose) {
      i = nextOpen + 4;
      continue;
    }

    depth -= 1;
    i = nextClose + '</div>'.length;
  }

  if (depth !== 0) {
    return null;
  }

  return { start, end: i, html: html.slice(start, i) };
}

function skipWhitespace(html, index) {
  let i = index;
  while (i < html.length && /\s/.test(html[i])) {
    i += 1;
  }
  return i;
}

/**
 * Markdown often wraps post-hero HTML in a stray <p> after prototypeEmbed.
 * Unwrap follow-up + thumbs (with nested divs) and drop empty paragraphs.
 */
function cleanMarkdownArtifacts(inner) {
  let html = inner.replace(/<p>\s*<\/p>/g, '');
  let searchFrom = 0;

  while (searchFrom < html.length) {
    const pOpen = html.indexOf('<p>', searchFrom);
    if (pOpen === -1) {
      break;
    }

    let cursor = skipWhitespace(html, pOpen + 3);
    const rest = html.slice(cursor);
    const isFollowup = rest.startsWith('<p class="work-gallery__followup">');
    const isThumbs = rest.startsWith('<div class="work-gallery__thumbs');

    if (!isFollowup && !isThumbs) {
      searchFrom = pOpen + 3;
      continue;
    }

    const pieces = [];

    if (isFollowup) {
      const endFollowup = html.indexOf('</p>', cursor);
      if (endFollowup === -1) {
        break;
      }
      pieces.push(html.slice(cursor, endFollowup + 4));
      cursor = skipWhitespace(html, endFollowup + 4);
    }

    if (html.slice(cursor).startsWith('<div class="work-gallery__thumbs')) {
      const thumbs = extractThumbsBlock(html, cursor);
      if (!thumbs) {
        searchFrom = pOpen + 3;
        continue;
      }
      pieces.push(thumbs.html);
      cursor = skipWhitespace(html, thumbs.end);
    }

    if (!html.startsWith('</p>', cursor) || pieces.length === 0) {
      searchFrom = pOpen + 3;
      continue;
    }

    const replacement = pieces.join('\n');
    html = html.slice(0, pOpen) + replacement + html.slice(cursor + 4);
    searchFrom = pOpen + replacement.length;
  }

  return html;
}

/**
 * Wraps each work-gallery figure meta block (divider + caption + description)
 * in .work-gallery__intro and prepends the editorial divider.
 * Processes one figure at a time so media (including click-to-play) never
 * gets folded into the intro block.
 */
module.exports = function workGalleryDivider(content, outputPath) {
  if (!outputPath || !outputPath.includes('/work/')) {
    return content;
  }
  if (!content.includes('work-gallery__item')) {
    return content;
  }

  const divider = dividerMarkup();
  const metaPattern =
    /^((?:\s*<figcaption class="work-gallery__caption">[\s\S]*?<\/figcaption>\s*<p class="work-gallery__description">[\s\S]*?<\/p>\s*(?:<p class="work-gallery__designers">[\s\S]*?<\/p>\s*)?)+)([\s\S]+)$/;

  return replaceWorkGalleryItems(content, (figureMatch, inner, openTag) => {
    const cleaned = cleanMarkdownArtifacts(inner);
    const metaMatch = cleaned.match(metaPattern);

    if (!metaMatch) {
      if (cleaned === inner) {
        return figureMatch;
      }
      return `${openTag}${cleaned}</figure>`;
    }

    const [, meta, media] = metaMatch;

    return `${openTag}<div class="work-gallery__intro">\n    ${divider}\n    ${meta.trimEnd()}\n    </div>\n    ${media.trimStart()}</figure>`;
  });
};
