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

  config.addPassthroughCopy('src/assets/img/');
  config.addPassthroughCopy('src/assets/css/');
  config.addPassthroughCopy('src/assets/js/');
  config.addPassthroughCopy('src/assets/fonts/');
  config.addPassthroughCopy('themes/');
  config.addPassthroughCopy({ 'src/posts/img/': 'assets/img/' });
  config.addPassthroughCopy({ 'src/work/img/': 'assets/img/' });
  config.addPassthroughCopy('src/assets/files/');
  config.addPassthroughCopy('humans.txt');
  config.addPassthroughCopy({ 'src/favicon.ico': 'favicon.ico' });

  config.addWatchTarget('src/assets/js/');
  config.addWatchTarget('src/assets/css/');
  config.addWatchTarget('themes/');
  config.addWatchTarget('src/work/img/');
  config.addWatchTarget('src/posts/img/');

  config.addLayoutAlias('default', 'layouts/default.njk');
  config.addLayoutAlias('post', 'layouts/post.njk');
  config.addLayoutAlias('work', 'layouts/work.njk');

  config.addFilter('readableDate', require('./lib/filters/readableDate'));
  config.addFilter('rfc822Date', require('./lib/filters/rfc822Date'));
  config.addFilter('titleNeedsPeriod', require('./lib/filters/titleNeedsPeriod'));
  config.addFilter('splitTitleLastWord', require('./lib/filters/splitTitleLastWord'));
  config.addFilter('workLead', require('./lib/filters/workLead'));
  config.addFilter('minifyJs', require('./lib/filters/minifyJs'));
  config.addFilter('isCurrentNav', require('./lib/filters/isCurrentNav'));

  config.addShortcode('clickToPlayVideo', require('./lib/shortcodes/clickToPlayVideo'));
  config.addShortcode('prototypeEmbed', require('./lib/shortcodes/prototypeEmbed'));
  config.addShortcode('thumbPrototype', require('./lib/shortcodes/thumbPrototype'));

  config.addTransform('workGalleryDivider', require('./lib/transforms/workGalleryDivider'));
  config.addTransform('workGalleryAtmosphere', require('./lib/transforms/workGalleryAtmosphere'));
  config.addTransform('minifyHtml', require('./lib/transforms/minifyHtml'));

  config.addCollection('posts', require('./lib/collections/posts'));
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
