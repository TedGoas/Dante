const markdownIt = require('markdown-it');
const markdownItblockquoteAttribution = require('./lib/markdown/markdown-it-blockquote-attribution');

module.exports = (config) => {
  const mdLib = markdownIt({
    html: true
  }).use(markdownItblockquoteAttribution);
  config.setLibrary('md', mdLib);

  config.setDataDeepMerge(true);

  config.addPassthroughCopy('src/assets/img/');
  config.addPassthroughCopy('src/assets/work/');
  config.addPassthroughCopy('src/assets/css/');
  config.addPassthroughCopy('themes/');
  config.addPassthroughCopy({ 'src/posts/img/': 'assets/img/' });
  config.addPassthroughCopy({ 'src/work/img/': 'assets/img/' });
  config.addPassthroughCopy('src/assets/files/');

  config.addWatchTarget("src/assets/js/");
  config.addWatchTarget("src/assets/css/");

  config.addLayoutAlias('default', 'layouts/default.njk');
  config.addLayoutAlias('post', 'layouts/post.njk');
  config.addLayoutAlias('work', 'layouts/work.njk');

  config.addFilter('readableDate', require('./lib/filters/readableDate'));
  config.addFilter('minifyJs', require('./lib/filters/minifyJs'));

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
