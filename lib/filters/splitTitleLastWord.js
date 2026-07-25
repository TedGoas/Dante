/**
 * Split a title into prose before the last word and the last word (for title-tail dot).
 */
module.exports = (title) => {
  const trimmed = (title || '').trim();
  if (!trimmed) {
    return { before: '', last: '' };
  }
  const i = trimmed.lastIndexOf(' ');
  if (i === -1) {
    return { before: '', last: trimmed };
  }
  return { before: trimmed.slice(0, i + 1), last: trimmed.slice(i + 1) };
};
