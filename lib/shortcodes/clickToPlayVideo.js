const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');

const templatePath = path.join(__dirname, '../../src/_includes/components/click-to-play-video.njk');
const templateSource = fs.readFileSync(templatePath, 'utf8');
const env = new nunjucks.Environment(null, { autoescape: true });

module.exports = function clickToPlayVideo(poster, video, alt, width, height) {
  const parsedWidth = Number(width);
  const parsedHeight = Number(height);

  if (!poster || !video || !alt || !parsedWidth || !parsedHeight) {
    throw new Error(
      'clickToPlayVideo shortcode requires poster, video, alt, width, and height arguments.'
    );
  }

  return env.renderString(templateSource, {
    poster: String(poster).trim(),
    video: String(video).trim(),
    alt: String(alt).trim(),
    width: parsedWidth,
    height: parsedHeight
  });
};
