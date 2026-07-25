const site = require('./site');

module.exports = {
  primary: [
    { label: 'Work', href: '/work' },
    { label: 'How I Think', href: '/how-i-think/' },
    { label: 'Bio', href: '/bio' },
    { label: 'Blog', href: '/blog' },
    { label: 'Newsletter', href: '/newsletter' }
  ],
  contact: [
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/tedgoas/',
      external: true
    },
    {
      label: site.author.email,
      href: `mailto:${site.author.email}`
    }
  ]
};
