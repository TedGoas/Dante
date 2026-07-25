const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');

const templatePath = path.join(__dirname, '../../src/_includes/components/click-to-play-video.njk');
const templateSource = fs.readFileSync(templatePath, 'utf8');
const env = new nunjucks.Environment(null, { autoescape: true });

const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif)$/i;
/** Matches --work-gallery-media-max-inline-size (90rem @ 16px). */
const FRAME_MAX_WIDTH_PX = 1440;
const FRAME_PADDING_BLOCK_PX = 32;

function resolveOptionalArgs(optional6, optional7, optional8) {
  let posterObjectViewBox = '';
  let background = '';
  const numericExtras = [];

  for (const value of [optional6, optional7, optional8]) {
    if (value === undefined || value === null || value === '') {
      continue;
    }

    const trimmed = String(value).trim();

    if (IMAGE_EXT.test(trimmed)) {
      background = trimmed;
      continue;
    }

    if (/^xywh\(/i.test(trimmed)) {
      posterObjectViewBox = trimmed;
      continue;
    }

    const parsed = Number(trimmed);
    if (Number.isFinite(parsed) && parsed > 0) {
      numericExtras.push(parsed);
    }
  }

  return { posterObjectViewBox, background, numericExtras };
}

module.exports = function clickToPlayVideo(
  poster,
  video,
  alt,
  width,
  height,
  optional6,
  optional7,
  optional8
) {
  const parsedWidth = Number(width);
  const parsedHeight = Number(height);

  if (!poster || !video || !alt || !parsedWidth || !parsedHeight) {
    throw new Error(
      'clickToPlayVideo shortcode requires poster, video, alt, width, and height arguments.'
    );
  }

  const { posterObjectViewBox, background } = resolveOptionalArgs(optional6, optional7, optional8);

  let frameWidth = parsedWidth;
  let frameHeight = parsedHeight;

  if (background) {
    frameWidth = FRAME_MAX_WIDTH_PX;
    frameHeight = parsedHeight + FRAME_PADDING_BLOCK_PX * 2;
  }

  return env.renderString(templateSource, {
    poster: String(poster).trim(),
    video: String(video).trim(),
    alt: String(alt).trim(),
    width: parsedWidth,
    height: parsedHeight,
    frameWidth,
    frameHeight,
    posterObjectViewBox,
    background
  });
};
