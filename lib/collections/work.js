module.exports = (coll) => {
  const posts = [...coll.getFilteredByGlob('src/work/*.md')];

  return posts.reverse();
};
