module.exports = {
  layout: 'default',
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
    }
  }
};
