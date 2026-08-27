const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');

const templatePath = path.join(__dirname, '../../src/_includes/components/prototype-embed.njk');
const templateSource = fs.readFileSync(templatePath, 'utf8');
const env = new nunjucks.Environment(null, { autoescape: true });

const VALID_SLUGS = new Set(['analytics-gpt', 'launchpad', 'ai-chatbot', 'scorecards']);

/** Case-study folder under /assets/img/ for each prototype slug. */
const CASE_BY_SLUG = {
  'analytics-gpt': 'dialpad-team',
  launchpad: 'dialpad-team',
  'ai-chatbot': 'dialpad-team',
  scorecards: 'dialpad'
};

const POSTER_BY_SLUG = {
  'analytics-gpt': '/assets/img/dialpad-team/dialpad-team-analyticsgpt.svg',
  launchpad: '/assets/img/dialpad-team/dialpad-team-launchpad.svg',
  'ai-chatbot': '/assets/img/dialpad-team/dialpad-team-chatbot.svg',
  scorecards: '/assets/img/dialpad/dialpad-ic-scorecards.svg'
};

const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif|svg)$/i;
/** Matches --work-gallery-media-max-inline-size (90rem @ 16px). */
const FRAME_MAX_WIDTH_PX = 1440;
/** Matches --work-gallery-prototype-background-padding-block (4rem @ 16px). */
const FRAME_PADDING_BLOCK_PX = 64;

module.exports = function prototypeEmbed(slug, title, width, height, optionalBackground) {
  const normalizedSlug = String(slug || '').trim();
  const parsedWidth = Number(width);
  const parsedHeight = Number(height);

  if (!normalizedSlug || !VALID_SLUGS.has(normalizedSlug)) {
    throw new Error(
      `prototypeEmbed shortcode requires a valid slug (${[...VALID_SLUGS].join(', ')}).`
    );
  }

  if (!title || !parsedWidth || !parsedHeight) {
    throw new Error('prototypeEmbed shortcode requires slug, title, width, and height arguments.');
  }

  let background = '';
  if (optionalBackground !== undefined && optionalBackground !== null && String(optionalBackground).trim()) {
    const trimmed = String(optionalBackground).trim();
    if (IMAGE_EXT.test(trimmed)) {
      background = trimmed;
    }
  }

  let frameWidth = parsedWidth;
  let frameHeight = parsedHeight;

  if (background) {
    frameWidth = FRAME_MAX_WIDTH_PX;
    frameHeight = parsedHeight + FRAME_PADDING_BLOCK_PX * 2;
  }

  const caseFolder = CASE_BY_SLUG[normalizedSlug];

  return env.renderString(templateSource, {
    slug: normalizedSlug,
    src: `/assets/img/${caseFolder}/prototypes/${normalizedSlug}/`,
    title: String(title).trim(),
    width: parsedWidth,
    height: parsedHeight,
    frameWidth,
    frameHeight,
    poster: POSTER_BY_SLUG[normalizedSlug],
    background
  });
};
