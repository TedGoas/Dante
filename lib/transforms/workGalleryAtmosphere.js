const PALETTES = ['warm-light', 'amber-dusk', 'cool-dark'];

const MEDIA_PATTERN =
  /<div class="(work-gallery__media work-gallery__media--(?:hero-secondary|sidebar-quad|integrations-stack|experiment-grid)[^"]*)"([^>]*)>/g;

function stableHash(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickPalette(outputPath, index) {
  const slug = outputPath.replace(/^.*\/work\//, '').replace(/\/index\.html$/, '');
  return PALETTES[stableHash(`${slug}:${index}`) % PALETTES.length];
}

/**
 * Injects CSS atmosphere backdrops on multi-image work gallery frames.
 * Skips media blocks that already declare work-gallery__media--has-backdrop.
 */
module.exports = function workGalleryAtmosphere(content, outputPath) {
  if (!outputPath || !outputPath.includes('/work/')) {
    return content;
  }
  if (!content.includes('work-gallery__media--')) {
    return content;
  }

  let index = 0;

  return content.replace(MEDIA_PATTERN, (match, classes, rest) => {
    if (classes.includes('work-gallery__media--has-backdrop')) {
      index += 1;
      return match;
    }

    const palette = pickPalette(outputPath, index);
    index += 1;

    return `<div class="${classes} work-gallery__media--has-backdrop work-gallery__media--backdrop-atmosphere work-gallery__media--atmosphere-${palette}"${rest}><div class="work-gallery__backdrop" aria-hidden="true"></div>`;
  });
};
