const { minify } = require('terser');

module.exports = (code) => {
  if (process.env.NODE_ENV === 'production') {
    const minified = minify(code);

    if (minified.error) {
      console.error('Terser error: ', minified.error);

      return code;
    }

    return minified.code;
  }

  return code;
};
