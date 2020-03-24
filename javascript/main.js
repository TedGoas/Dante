// Config
// Selectors
// store selectors for reference so we only call them once
// const $body = document.querySelector('body')
// const $header = document.getElementById('#header')
// const $nav = document.getElementById('#nav')
// const $footer = document.getElementById('#footer')
// add a class of 'intro' to the first paragraph
// do this on every page apart from the blog page
if (!page('blog')) {
  document.querySelector('.article > p').classList.add('intro');
}