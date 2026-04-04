module.exports = {
  layout: 'work',
  title: 'Untitled',
  eleventyComputed: {
    permalink: (data) => `work/${data.page.fileSlug}/index.html`,
    featured_image: (data) => {
      if (data.featured_image) {
        if (data.featured_image.search(/^https?:\/\//) !== -1) {
          return data.featured_image;
        }
        return `/assets/img/${data.featured_image}`;
      } else {
        return false;
      }
    },
    yearParts: (data) => {
      const y = data.year;
      if (!y || typeof y !== 'string') return null;
      const m = y.trim().match(/^(\d{4})\s*-\s*(present|\d{4})$/i);
      if (!m) return null;
      const endRaw = m[2];
      const isPresent = endRaw.toLowerCase() === 'present';
      return {
        start: m[1],
        end: isPresent ? null : endRaw,
        isPresent
      };
    }
  }
};
