const dividerMarkup = require('../snippets/dividerMarkup');

/**
 * Wraps each work-gallery figure meta block (divider + caption + description)
 * in .work-gallery__intro and prepends the editorial divider.
 */
module.exports = function workGalleryDivider(content, outputPath) {
  if (!outputPath || !outputPath.includes('/work/')) {
    return content;
  }
  if (!content.includes('work-gallery__item')) {
    return content;
  }

  const divider = dividerMarkup();

  return content.replace(
    /(<figure class="work-gallery__item[^"]*">)\s*(<figcaption class="work-gallery__caption">[\s\S]*?<\/figcaption>\s*<p class="work-gallery__description">[\s\S]*?<\/p>\s*)(<(?:img|div class="work-gallery__media"))/g,
    `$1\n    <div class="work-gallery__intro">\n    ${divider}\n    $2</div>\n    $3`
  );
};
