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
    workIndexThumb: (data) => {
      const slug = data.page && data.page.fileSlug ? data.page.fileSlug : '';
      const map = {
        dialpad: '/assets/work/th-dialpad-scorecards.svg',
        'dialpad-team': '/assets/work/th-dialpad-analyticsgpt.svg',
        'stack-overflow': '/assets/work/th-stackoverflow-email.svg',
        canfield: '/assets/work/th-canfield-graph.svg',
        cerberus: '/assets/work/th-cerberus.svg'
      };
      return map[slug] || null;
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
