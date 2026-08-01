/** SVGO config for Figma-export SVGs — disable convertPathData (crashes on some Dialpad paths). */
module.exports = {
  multipass: true,
  floatPrecision: 2,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          convertPathData: false,
          removeViewBox: false,
        },
      },
    },
  ],
};
