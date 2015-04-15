/**
 * Created by douglas goodman on 3/10/15.
 */

(function(){
  'use strict';

  iscFadeOutInAnimation.$inject = ['$log', "$window", 'TweenMax', 'EASE_DUR'];

  function iscFadeOutInAnimation( $log, $window, TweenMax, EASE_DUR ){

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
      //$log.debug( 'iscFadeOutInAnimation.beforeAddClass' );

      if( className === 'fade-out-in' ){
        TweenMax.set( element, {autoAlpha: 1, display: 'block'});
        TweenMax.to( element, EASE_DUR, {autoAlpha: 0, onComplete: onRemoveComplete, onCompleteParams:[element, done]})
      }
      else {
        done();
      }
    }

    function beforeRemoveClass( element, className, done ){
      //$log.debug( 'iscFadeOutInAnimation.beforeRemoveClass' );
      if( className === 'fade-out-in' ){
        TweenMax.to( element, EASE_DUR, {autoAlpha: 1, onComplete: done})
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

  angular.module( 'isc.common' )
    .animation( '.fade-out-in', iscFadeOutInAnimation );

})();


