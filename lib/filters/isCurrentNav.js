/**
 * True when pageUrl is the nav href or a child under that section.
 * Trailing slashes are ignored; home (`/`) is exact-match only.
 */
module.exports = (pageUrl, href) => {
  if (typeof pageUrl !== 'string' || typeof href !== 'string' || !href) {
    return false;
  }

  const normalize = (url) => {
    const trimmed = url.replace(/\/+$/, '');
    return trimmed === '' ? '/' : trimmed;
  };

  const page = normalize(pageUrl);
  const link = normalize(href);

  if (page === link) {
    return true;
  }

  if (link === '/') {
    return false;
  }

  return page.startsWith(`${link}/`);
};
