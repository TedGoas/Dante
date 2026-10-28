const markdownIt = require('markdown-it');
const markdownItblockquoteAttribution = require('./lib/markdown/markdown-it-blockquote-attribution');
const expandClickToPlayVideo = require('./lib/preprocessors/expandClickToPlayVideo');
const expandPrototypeEmbed = require('./lib/preprocessors/expandPrototypeEmbed');
const expandThumbPrototype = require('./lib/preprocessors/expandThumbPrototype');

function expandWorkGalleryShortcodes(data, content) {
  return expandThumbPrototype(
    data,
    expandPrototypeEmbed(data, expandClickToPlayVideo(data, content))
  );
}

module.exports = (config) => {
  const mdLib = markdownIt({
    html: true
  }).use(markdownItblockquoteAttribution);
  const renderMarkdown = mdLib.render.bind(mdLib);

  mdLib.render = (content) => renderMarkdown(expandWorkGalleryShortcodes(null, content));
  config.setLibrary('md', mdLib);

  config.setDataDeepMerge(true);

  // Prototype / work image bundles are passthrough-only. Use config.ignores (not
  // .eleventyignore) so --serve still watches and live-reloads these files.
  // .eleventyignore would also disable the file watcher for the same paths.
  config.ignores.add('src/work/img/**');
  config.ignores.add('src/labs/hobby-comparison/**');
  config.ignores.add('src/labs/ipod/**');

  // Newsletter issue images sit next to each issue and publish alongside
  // it. Draft issues are excluded from production entirely — page (via
  // permalink in newsletter.11tydata.js) and images (no passthrough here,
  // so no orphan draft assets in dist/).
  {
    const fs = require('node:fs');
    const path = require('node:path');
    const newsletterDir = path.join(__dirname, 'src/newsletter');
    const excludeDrafts =
      process.env.NODE_ENV === 'production' && process.env.NEWSLETTER_EMAIL !== '1';
    if (fs.existsSync(newsletterDir)) {
      for (const entry of fs.readdirSync(newsletterDir, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const issueFile = path.join(newsletterDir, entry.name, 'index.njk');
        if (!fs.existsSync(issueFile)) continue;
        const frontMatter = fs.readFileSync(issueFile, 'utf8').match(/^---\n([\s\S]*?)\n---/);
        const isDraft = Boolean(frontMatter && /^\s*draft:\s*true\s*$/m.test(frontMatter[1]));
        if (isDraft && excludeDrafts) {
          config.ignores.add(`src/newsletter/${entry.name}/**`);
          continue;
        }
        config.addPassthroughCopy({
          [`src/newsletter/${entry.name}/*.{jpg,jpeg,png,gif,webp,svg}`]: `newsletter/${entry.name}`
        });
      }
    }
  }

  config.addPassthroughCopy('src/assets/img/');
  config.addPassthroughCopy('src/assets/css/');
  config.addPassthroughCopy('src/assets/js/');
  config.addPassthroughCopy('src/assets/fonts/');
  config.addPassthroughCopy('themes/');
  config.addPassthroughCopy({ 'src/posts/img/': 'assets/img/' });
  config.addPassthroughCopy({ 'src/work/img/': 'assets/img/' });
  config.addPassthroughCopy({ 'src/labs/hobby-comparison': 'labs/hobby-comparison' });
  config.addPassthroughCopy({ 'src/labs/ipod': 'labs/ipod' });
  config.addPassthroughCopy('src/assets/files/');
  config.addPassthroughCopy('humans.txt');
  config.addPassthroughCopy({ 'src/favicon.ico': 'favicon.ico' });

  config.addWatchTarget('src/assets/js/');
  config.addWatchTarget('src/assets/css/');
  config.addWatchTarget('themes/');
  config.addWatchTarget('src/work/img/');
  config.addWatchTarget('src/posts/img/');
  config.addWatchTarget('src/labs/hobby-comparison/');
  config.addWatchTarget('src/labs/ipod/');

  config.addLayoutAlias('default', 'layouts/default.njk');
  config.addLayoutAlias('post', 'layouts/post.njk');
  config.addLayoutAlias('work', 'layouts/work.njk');
  config.addLayoutAlias('newsletter', 'layouts/newsletter.njk');
  config.addLayoutAlias('newsletter-email', 'layouts/newsletter-email.njk');

  config.addWatchTarget('src/newsletter/');

  config.addFilter('readableDate', require('./lib/filters/readableDate'));
  config.addFilter('rfc822Date', require('./lib/filters/rfc822Date'));
  config.addFilter('titleNeedsPeriod', require('./lib/filters/titleNeedsPeriod'));
  config.addFilter('splitTitleLastWord', require('./lib/filters/splitTitleLastWord'));
  config.addFilter('workLead', require('./lib/filters/workLead'));
  config.addFilter('minifyJs', require('./lib/filters/minifyJs'));
  config.addFilter('isCurrentNav', require('./lib/filters/isCurrentNav'));

  config.addShortcode('annotate', require('./lib/shortcodes/textAnnotate'));
  config.addShortcode('clickToPlayVideo', require('./lib/shortcodes/clickToPlayVideo'));
  config.addShortcode('prototypeEmbed', require('./lib/shortcodes/prototypeEmbed'));
  config.addShortcode('thumbPrototype', require('./lib/shortcodes/thumbPrototype'));

  config.addTransform('workGalleryDivider', require('./lib/transforms/workGalleryDivider'));
  config.addTransform('workGalleryAtmosphere', require('./lib/transforms/workGalleryAtmosphere'));
  config.addTransform('minifyHtml', require('./lib/transforms/minifyHtml'));

  config.addCollection('posts', require('./lib/collections/posts'));
  config.addCollection('newsletterIssues', require('./lib/collections/newsletter'));
  config.addCollection('work', require('./lib/collections/work'));
  config.addCollection('pagedPosts', require('./lib/collections/pagedPosts'));

  return {
    dir: {
      input: 'src',
      output: 'dist'
    },
    templateFormats: ['md', 'njk', 'html'],
    dataTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk'
  };
};
