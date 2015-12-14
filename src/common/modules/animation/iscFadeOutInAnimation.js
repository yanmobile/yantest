/**
 * Created by douglas goodman on 3/10/15.
 */

(function(){
  'use strict';

  /* @ngInject */
  function iscFadeOutInAnimation( devlog, $window, TweenMax, EASE_DUR ){

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
      devlog.channel('').debug( 'iscFadeOutInAnimation.beforeAddClass' );

      if( className === 'fade-out-in' ){
        TweenMax.set( element, {autoAlpha: 1, display: 'block'});
        TweenMax.to( element, EASE_DUR, {autoAlpha: 0, onComplete: onRemoveComplete, onCompleteParams:[element, done]});
      }
      else {
        done();
      }
    }

    function beforeRemoveClass( element, className, done ){
      devlog.channel('').debug( 'iscFadeOutInAnimation.beforeRemoveClass' );
      if( className === 'fade-out-in' ){
        TweenMax.to( element, EASE_DUR, {autoAlpha: 1, onComplete: done});
      }
      else {
        done();
      }
    }

    function onRemoveComplete( element, done ){
      // reset element here
      TweenMax.set( element, {autoAlpha: 1, display: 'none'});
      done();
    }

  }// END CLASS

  // --------------------
  // inject
  // --------------------

  angular.module( 'isc.animation' )
    .animation( '.fade-out-in', iscFadeOutInAnimation );

})();


