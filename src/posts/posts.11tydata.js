const fs = require('fs');

/**
 * Word count from markdown file (body only, after front matter) for read time.
 */
function readingMinutesFromFile(data) {
  const inputPath = data.page?.inputPath;
  if (!inputPath || !fs.existsSync(inputPath)) {
    return 1;
  }
  try {
    let raw = fs.readFileSync(inputPath, 'utf8');
    raw = raw.replace(/^---[\s\S]*?---\s*/, '');
    const words = raw.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  } catch {
    return 1;
  }
}

module.exports = {
  layout: 'post',
  title: 'Untitled',
  eleventyComputed: {
    permalink: (data) => `blog/${data.page.fileSlug}/index.html`,
    readingMinutes: (data) => readingMinutesFromFile(data),
    featured_image: (data) => {
      if (data.featured_image) {
        if (data.featured_image.search(/^https?:\/\//) !== -1) {
          return data.featured_image;
        }
        return `/assets/img/${data.featured_image}`;
      } else {
        return false;
      }
    }
  }
};
