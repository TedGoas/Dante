const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');

const templatePath = path.join(__dirname, '../../src/_includes/components/text-annotate.njk');
const env = new nunjucks.Environment(null, { autoescape: true });

const VARIANTS = ['highlight', 'underline-double'];
const COLORS = ['amber', 'blue', 'green', 'red'];

module.exports = function textAnnotate(text, variant, color) {
  const trimmedText = text === undefined || text === null ? '' : String(text).trim();
  const resolvedVariant = variant ? String(variant).trim() : 'highlight';
  const resolvedColor = color ? String(color).trim() : 'amber';

  if (!trimmedText) {
    throw new Error('annotate shortcode requires text as its first argument.');
  }

  if (!VARIANTS.includes(resolvedVariant)) {
    throw new Error(
      `annotate shortcode variant must be one of: ${VARIANTS.join(', ')} (received "${resolvedVariant}").`
    );
  }

  if (!COLORS.includes(resolvedColor)) {
    throw new Error(
      `annotate shortcode color must be one of: ${COLORS.join(', ')} (received "${resolvedColor}").`
    );
  }

  // Re-read on each call so --serve picks up partial edits without a restart.
  const source = fs.readFileSync(templatePath, 'utf8');

  return env.renderString(source, {
    text: trimmedText,
    variant: resolvedVariant,
    color: resolvedColor
  });
};
