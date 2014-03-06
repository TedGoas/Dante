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

// classy
/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

( function( window ) {

'use strict';

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else {
  // browser global
  window.classie = classie;
}

})( window );

// http://tympanus.net/codrops/2013/06/06/on-scroll-animated-header/
var animatedHeader = (function() {

  var docElem = document.documentElement,
      header = document.querySelector( '.header' ),
      didScroll = false,
      changeHeaderOn = 100;

  function init() {
      window.addEventListener( 'scroll', function( event ) {
          if( !didScroll ) {
              didScroll = true;
              setTimeout( scrollPage, 50 );
          }
      }, false );
  }

  function scrollPage() {
      var sy = scrollY();
      if ( sy >= changeHeaderOn ) {
          classie.add( header, 'header-shrink' );
      }
      else {
          classie.remove( header, 'header-shrink' );
      }
      didScroll = false;
  }

  function scrollY() {
      return window.pageYOffset || docElem.scrollTop;
  }

  init();

})();