/**
 * Created by douglas goodman on 2/2/15.
 */

(function(){
  'use strict';

  iscScrollStickAnimation.$inject = ['$log', '$window', 'TweenMax', 'EASE_DUR'];

  function iscScrollStickAnimation( $log, $window,  TweenMax, EASE_DUR ){

  // --------------------
  // vars
  // --------------------

  // --------------------
  // init
  // --------------------

  // --------------------
  // class factory
  // --------------------

  var animations = {
    beforeAddClass: beforeAddClass,
    beforeRemoveClass: beforeRemoveClass
  };

  return animations;

  // --------------------
  // functions
  // --------------------

    function beforeAddClass( element, className, done ){
      //$log.debug( 'iscScrollStickAnimation.beforeAddClass' );

      if( className === 'scroll-stick' ){

        var params = getParams();

        var css = {
          position: 'fixed',
          top: params.top,
          border: '1px solid rgba(0,0,0,.35)',
          backgroundColor: "rgba(255,255,255,1)",
          boxShadow: '7px 7px 20px 0px rgba(0,0,0,0.25)',
          padding: '10px',
          width: params.width,
          left: params.margin
        };

        var options = {
          css: css,
          ease: Power2.easeOut,
          onComplete: done
        };

        TweenMax.to( element, EASE_DUR, options );
      }
      else {
        done();
      }
    }

    function beforeRemoveClass( element, className, done ){
      //$log.debug( 'iscScrollStickAnimation.beforeRemoveClass' );

      if( className === 'scroll-stick' ){

        var css = {
          position: 'relative',
          top:'0px',
          left: 0,
          width:'100%',
          paddingLeft: '0px',
          paddingBottom: '5px',
          backgroundColor: "rgba(255,255,255,0)",
          border: '1px solid rgba(0,0,0,0)',
          boxShadow: '0px 0px 0px 0px rgba(0,0,0,0)'
        };

        var options = {
          css: css,
          ease: Power2.easeOut,
          onComplete: onRemoveComplete,
          onCompleteParams:[element, done]

        };

        TweenMax.to( element, EASE_DUR, options );
      }
      else {
        done();
      }
    }

    function onRemoveComplete( elem, done ){
      //TweenMax.set( elem, {autoAlpha:0});
      done();
    }

    function getParams( elem ){
      var winW = $window.innerWidth;
      var tabletOrlarger = winW >= 960;
      var margin = tabletOrlarger? 50 : 20;
      var top = tabletOrlarger ? 5 : 20;
      var scrollbarWidth = 20; // we can assume that if this gets triggered, there's a scrollbar

      return {
        width: winW - (margin * 2) - scrollbarWidth,
        margin: margin,
        top: top
      }
    }

  }// END CLASS

  // --------------------
  // inject
  // --------------------

  angular.module( 'isc.common' )
    .animation( '.scroll-stick', iscScrollStickAnimation );

})();
