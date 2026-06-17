module.exports = async function() {
  try {
    const response = await fetch('https://rss.beehiiv.com/feeds/vZHlctjmDk.xml');
    const xml = await response.text();

    const issues = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      const item = match[1];

      const titleMatch = item.match(/<title>(.*?)<\/title>/);
      const linkMatch = item.match(/<link>(.*?)<\/link>/);
      const dateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
      const descMatch = item.match(/<description>(.*?)<\/description>/);

      if (titleMatch && linkMatch && dateMatch) {
        const date = new Date(dateMatch[1]);
        const decodeEntities = (text) =>
          text
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&#39;/g, "'");

        issues.push({
          title: decodeEntities(titleMatch[1]),
          url: linkMatch[1],
          date: date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          dateISO: date.toISOString(),
          description: descMatch ? decodeEntities(descMatch[1]) : null
        });
      }
    }

    return {
      title: 'The Last Two Weeks',
      description: 'A fortnightly newsletter about product design and leadership',
      issues: issues
    };
  } catch (error) {
    console.error('Error fetching newsletter RSS:', error);
    return {
      title: 'The Last Two Weeks',
      description: 'A fortnightly newsletter about product design and leadership',
      issues: []
    };
  }
};
