const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');

const templatePath = path.join(__dirname, '../../src/_includes/components/text-annotate.njk');
const templateSource = fs.readFileSync(templatePath, 'utf8');
const env = new nunjucks.Environment(null, { autoescape: true });

const VARIANTS = ['highlight', 'underline-double'];

module.exports = function textAnnotate(text, variant) {
  const trimmedText = text === undefined || text === null ? '' : String(text).trim();
  const resolvedVariant = variant ? String(variant).trim() : 'highlight';

  if (!trimmedText) {
    throw new Error('annotate shortcode requires text as its first argument.');
  }

  if (!VARIANTS.includes(resolvedVariant)) {
    throw new Error(
      `annotate shortcode variant must be one of: ${VARIANTS.join(', ')} (received "${resolvedVariant}").`
    );
  }

  return env.renderString(templateSource, {
    text: trimmedText,
    variant: resolvedVariant
  });
};
