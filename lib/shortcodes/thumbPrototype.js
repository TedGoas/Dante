const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');

const templatePath = path.join(__dirname, '../../src/_includes/components/thumb-prototype.njk');
const templateSource = fs.readFileSync(templatePath, 'utf8');
const env = new nunjucks.Environment(null, { autoescape: true });

const VALID_SLUGS = new Set(['quick-reply']);

const CASE_BY_SLUG = {
  'quick-reply': 'dialpad'
};

module.exports = function thumbPrototype(slug, title, width, height) {
  const normalizedSlug = String(slug || '').trim();
  const parsedWidth = Number(width);
  const parsedHeight = Number(height);

  if (!normalizedSlug || !VALID_SLUGS.has(normalizedSlug)) {
    throw new Error(
      `thumbPrototype shortcode requires a valid slug (${[...VALID_SLUGS].join(', ')}).`
    );
  }

  if (!title || !parsedWidth || !parsedHeight) {
    throw new Error('thumbPrototype shortcode requires slug, title, width, and height arguments.');
  }

  const caseFolder = CASE_BY_SLUG[normalizedSlug];

  return env.renderString(templateSource, {
    slug: normalizedSlug,
    src: `/assets/img/${caseFolder}/prototypes/${normalizedSlug}/`,
    title: String(title).trim(),
    width: parsedWidth,
    height: parsedHeight
  });
};
