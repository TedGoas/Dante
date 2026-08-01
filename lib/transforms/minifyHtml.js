const htmlmin = require('html-minifier');

module.exports = (content, outputPath) => {
  if (process.env.NODE_ENV === 'production' && outputPath.endsWith('.html')) {
    return htmlmin.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
      // Keep a single space between tags/text. Without this, production
      // builds strip spaces that local (unminified) HTML keeps — e.g. the
      // gap between the home hero avatar and “Ted”.
      conservativeCollapse: true
    });
  }

  return content;
};
