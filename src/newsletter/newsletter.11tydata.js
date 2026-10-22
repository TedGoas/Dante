const isEmailBuild = process.env.NEWSLETTER_EMAIL === '1';
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  // Email builds swap the web layout for the standalone email layout.
  // Read at process start, so `NEWSLETTER_EMAIL=1` must be set before
  // Eleventy launches (scripts/build-newsletter-email.js does this).
  layout: isEmailBuild ? 'newsletter-email' : 'newsletter',
  eleventyComputed: {
    // Permalink is always derived from the issue number — never set it
    // by hand in an issue's front matter.
    permalink: (data) => {
      if (data.draft && isProduction && !isEmailBuild) {
        return false;
      }
      return `newsletter/${data.issue}/index.html`;
    },
    // Drafts never appear in collections (hub listing, sitemap), but in
    // dev they still render at their permalink for preview.
    eleventyExcludeFromCollections: (data) => Boolean(data.draft)
  }
};
