const dividerMarkup = require('../snippets/dividerMarkup');

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
  const figurePattern = /<figure class="work-gallery__item[^"]*">([\s\S]*?)<\/figure>/g;
  const metaPattern =
    /^(\s*<figcaption class="work-gallery__caption">[\s\S]*?<\/figcaption>\s*<p class="work-gallery__description">[\s\S]*?<\/p>\s*)([\s\S]+)$/;

  return content.replace(figurePattern, (figureMatch, inner) => {
    const metaMatch = inner.match(metaPattern);

    if (!metaMatch) {
      return figureMatch;
    }

    const [, meta, media] = metaMatch;

    return figureMatch.replace(
      inner,
      `<div class="work-gallery__intro">\n    ${divider}\n    ${meta.trimEnd()}\n    </div>\n    ${media.trimStart()}`
    );
  });
};
