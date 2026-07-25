const { minify_sync } = require('terser');

module.exports = (code) => {
  if (process.env.NODE_ENV !== 'production') {
    return code;
  }

  try {
    const minified = minify_sync(code);

    if (minified.error) {
      console.error('Terser error: ', minified.error);
      return code;
    }

    return minified.code;
  } catch (error) {
    console.error('Terser error: ', error);
    return code;
  }
};
