module.exports = async function() {
  try {
    const response = await fetch('https://rss.beehiiv.com/feeds/vZHlctjmDk.xml');
    const xml = await response.text();
    
    // Simple XML parsing to extract the data we need
    const issues = [];
    
    // Extract items using regex (simple but effective for RSS)
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    
    while ((match = itemRegex.exec(xml)) !== null) {
      const item = match[1];
      
      const titleMatch = item.match(/<title>(.*?)<\/title>/);
      const linkMatch = item.match(/<link>(.*?)<\/link>/);
      const dateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
      
      if (titleMatch && linkMatch && dateMatch) {
        const date = new Date(dateMatch[1]);
        issues.push({
          title: titleMatch[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
          url: linkMatch[1],
          date: date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
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
