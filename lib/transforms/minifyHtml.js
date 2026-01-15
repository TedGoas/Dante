const htmlmin = require('html-minifier');

module.exports = (content, outputPath) => {
  if (process.env.NODE_ENV === 'production' && outputPath.endsWith('.html')) {
    // Don't minify XML/RSS feeds
    if (content.trim().startsWith('<?xml')) {
      return content;
    }
    
    return htmlmin.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true
    });
  }

  return content;
};
