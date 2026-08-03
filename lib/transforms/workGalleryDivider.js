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

/**
 * Markdown often wraps post-hero HTML in a stray <p> after prototypeEmbed.
 * Unwrap follow-up + thumbs and drop empty paragraphs.
 */
function cleanMarkdownArtifacts(inner) {
  return inner
    .replace(
      /<p>\s*(<p class="work-gallery__followup">[\s\S]*?<\/p>)\s*(<div class="work-gallery__thumbs[\s\S]*?<\/div>)\s*<\/p>/g,
      '$1\n$2'
    )
    .replace(/<p>\s*(<p class="work-gallery__followup">[\s\S]*?<\/p>)\s*<\/p>/g, '$1')
    .replace(/<p>\s*(<div class="work-gallery__thumbs[\s\S]*?<\/div>)\s*<\/p>/g, '$1')
    .replace(/<p>\s*<\/p>/g, '');
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
