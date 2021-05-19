module.exports = (config) => {
  config.setDataDeepMerge(true);

  config.addPassthroughCopy('src/assets/img/');
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

  config.addTransform('postcss', require('./lib/transforms/postcss'));
  config.addTransform('minifyHtml', require('./lib/transforms/minifyHtml'));

  config.addCollection('posts', require('./lib/collections/posts'));
  config.addCollection('work', require('./lib/collections/work'));
  config.addCollection('pagedPosts', require('./lib/collections/pagedPosts'));

  return {
    dir: {
      input: 'src',
      output: 'dist'
    },
    // pathPrefix: "/subfolder/",
    templateFormats: ['md', 'njk', 'html'],
    dataTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk'
  };
};
