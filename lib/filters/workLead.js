/**
 * First substantive paragraph from rendered work/case study HTML:
 * skips `.work-period` and short stubs.
 */
module.exports = (html, maxLen = 220) => {
  if (!html || typeof html !== 'string') return '';
  const re = /<p\b([^>]*)>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = re.exec(html))) {
    const attrs = match[1] || '';
    const body = match[2] || '';
    if (/work-period/.test(attrs)) continue;
    const text = body
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (text.length >= 48) {
      if (text.length <= maxLen) return text;
      const cut = text.slice(0, maxLen);
      const lastSpace = cut.lastIndexOf(' ');
      return (lastSpace > 60 ? cut.slice(0, lastSpace) : cut) + '…';
    }
  }
  return '';
};
