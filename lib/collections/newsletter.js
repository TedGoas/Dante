module.exports = (coll) => {
  const issues = [...coll.getFilteredByGlob('src/newsletter/*/index.njk')];

  return issues
    .filter((item) => !item.data.draft)
    .sort((a, b) => Number(b.data.issue) - Number(a.data.issue));
};
