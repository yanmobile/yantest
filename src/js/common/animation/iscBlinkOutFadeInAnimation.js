/**
 * Created by douglas goodman on 3/10/15.
 */

(function(){
  'use strict';

  iscBlinkOutFadeInAnimation.$inject = ['$log', "$window", 'TweenMax', 'EASE_DUR'];

  function iscBlinkOutFadeInAnimation( $log, $window, TweenMax, EASE_DUR ){

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
      //$log.debug( 'iscBlinkOutFadeInAnimation.beforeAddClass' );
      if( className === 'blink-out-fade-in' ){
        TweenMax.set( element, {autoAlpha: 0, display: 'none'});
        done();
      }
      else {
        done();
      }
    }

    function beforeRemoveClass( element, className, done ){
      //$log.debug( 'iscBlinkOutFadeInAnimation.beforeRemoveClass' );
      if( className === 'blink-out-fade-in' ){
        TweenMax.set( element, {autoAlpha: 0, display: 'block'});
        TweenMax.to( element, EASE_DUR, {autoAlpha: 1, onComplete: done})
      }
      else {
        done();
      }
    }

  }// END CLASS

  // --------------------
  // inject
  // --------------------

  angular.module( 'isc.common' )
    .animation( '.blink-out-fade-in', iscBlinkOutFadeInAnimation );

})();


