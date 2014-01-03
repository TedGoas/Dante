$(document).ready(function() {
  var $menu = $('.header nav'),
    $menulink = $('.menu-link');
  $menulink.click(function() {
	  $menulink.toggleClass('active');
	  $menu.toggleClass('active');
  return false;
});});

// http://www.learningjquery.com/2007/10/improved-animated-scrolling-script-for-same-page-links
$(document).ready(function(){
  $('.projects a').click(function() {
 if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
 && location.hostname == this.hostname) {
   var $target = $(this.hash);
   $target = $target.length && $target
   || $('[name=' + this.hash.slice(1) +']');
   if ($target.length) {
  var targetOffset = $target.offset().top;
  $('html,body')
  .animate({scrollTop: targetOffset}, 500);
    return false;
   }
 }
  });
});