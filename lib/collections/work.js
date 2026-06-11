/** FIXED_INDEX_ORDER pins Dialpad cards at the top of the work index. */
const FIXED_INDEX_ORDER = {
  dialpad: 1,
  'dialpad-team': 2,
};

function filenameStem(post) {
  const base = String(post.inputPath || '').split('/').pop() || '';
  return base.replace(/\.[^.]+$/, '');
}

function getWorkIndexRank(post) {
  const slug = post.fileSlug;
  if (Object.hasOwn(FIXED_INDEX_ORDER, slug)) {
    return FIXED_INDEX_ORDER[slug];
  }

  const fromFrontMatter = Number(post.data.index_order);
  if (Number.isFinite(fromFrontMatter)) {
    return fromFrontMatter;
  }

  return null;
}

module.exports = (coll) => {
  const posts = [...coll.getFilteredByGlob('src/work/*.md')];

  return posts.sort((a, b) => {
    const aRank = getWorkIndexRank(a);
    const bRank = getWorkIndexRank(b);
    const aPinned = aRank !== null;
    const bPinned = bRank !== null;

    if (aPinned && bPinned) {
      return aRank - bRank;
    }

    if (aPinned) {
      return -1;
    }

    if (bPinned) {
      return 1;
    }

    return filenameStem(b).localeCompare(filenameStem(a));
  });
};
