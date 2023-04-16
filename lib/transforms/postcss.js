// PostCSS CSS processing

const postcss = require('postcss');

// Post CSS Config
const postcssPlugins = [
  require("postcss-import"),
  require("postcss-nested"),
  require("autoprefixer"),
];
const postcssOptions = {
  from: 'src/assets/css/styles.css',
};

// Source: https://www.sitepoint.com/getting-started-with-eleventy/
module.exports = async (content, outputPath) => {
  if (!String(outputPath).endsWith('styles.css')) {
    return content;
  }

  return (
    await postcss(postcssPlugins).process(content, postcssOptions)
  ).css;
};
