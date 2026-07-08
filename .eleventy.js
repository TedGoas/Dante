const markdownIt = require('markdown-it');
const markdownItblockquoteAttribution = require('./lib/markdown/markdown-it-blockquote-attribution');
const expandClickToPlayVideo = require('./lib/preprocessors/expandClickToPlayVideo');
const expandPrototypeEmbed = require('./lib/preprocessors/expandPrototypeEmbed');

function expandWorkGalleryShortcodes(data, content) {
  return expandPrototypeEmbed(data, expandClickToPlayVideo(data, content));
}

module.exports = (config) => {
  const mdLib = markdownIt({
    html: true
  }).use(markdownItblockquoteAttribution);
  const renderMarkdown = mdLib.render.bind(mdLib);

  mdLib.render = (content) => renderMarkdown(expandWorkGalleryShortcodes(null, content));
  config.setLibrary('md', mdLib);

  config.setDataDeepMerge(true);

  config.addPassthroughCopy('src/assets/img/');
  config.addPassthroughCopy('src/assets/work/');
  config.addPassthroughCopy('src/assets/css/');
  config.addPassthroughCopy('src/assets/js/');
  config.addPassthroughCopy('src/assets/fonts/');
  config.addPassthroughCopy('themes/');
  config.addPassthroughCopy({ 'src/posts/img/': 'assets/img/' });
  config.addPassthroughCopy({ 'src/work/img/': 'assets/img/' });
  config.addPassthroughCopy('src/assets/files/');
  config.addPassthroughCopy('humans.txt');

  config.addWatchTarget('src/assets/js/');
  config.addWatchTarget('src/assets/css/');

  config.addLayoutAlias('default', 'layouts/default.njk');
  config.addLayoutAlias('post', 'layouts/post.njk');
  config.addLayoutAlias('work', 'layouts/work.njk');

  config.addFilter('readableDate', require('./lib/filters/readableDate'));
  config.addFilter('titleNeedsPeriod', require('./lib/filters/titleNeedsPeriod'));
  config.addFilter('splitTitleLastWord', require('./lib/filters/splitTitleLastWord'));
  config.addFilter('workLead', require('./lib/filters/workLead'));
  config.addFilter('minifyJs', require('./lib/filters/minifyJs'));

  config.addShortcode('clickToPlayVideo', require('./lib/shortcodes/clickToPlayVideo'));
  config.addShortcode('prototypeEmbed', require('./lib/shortcodes/prototypeEmbed'));

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
