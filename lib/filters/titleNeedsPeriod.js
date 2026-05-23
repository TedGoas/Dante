/**
 * True when a post title should get a decorative trailing period in the header.
 */
module.exports = (title) => {
  if (!title || typeof title !== 'string') {
    return false;
  }
  return !/[.?!]$/.test(title.trim());
};
