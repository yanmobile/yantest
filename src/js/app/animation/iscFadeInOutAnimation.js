/**
 * Created by douglas goodman on 3/10/15.
 */

(function(){
  'use strict';

  iscFadeInOutAnimation.$inject = ['$log', "$window", 'TweenMax', 'EASE_DUR'];

  function iscFadeInOutAnimation( $log, $window, TweenMax, EASE_DUR ){

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
      //$log.debug( 'iscFadeInOutAnimation.beforeAddClass' );

      if( className === 'fade-in-out' ){
        TweenMax.set( element, {autoAlpha: 0, display: 'block'});
        TweenMax.to( element, EASE_DUR, {autoAlpha: 1, onComplete: done} )
      }
      else {
        done();
      }
    }

    function beforeRemoveClass( element, className, done ){
      //$log.debug( 'iscFadeInOutAnimation.beforeRemoveClass' );
      if( className === 'fade-in-out' ){
        TweenMax.to( element, EASE_DUR, {autoAlpha: 0, onComplete: onRemoveComplete, onCompleteParams: [element, done]})
      }
      else {
        done();
      }
    }

    function onRemoveComplete( element, done ){
      // reset element here
      TweenMax.set( element, {autoAlpha: 0, display: 'none'});
      done();
    }

  }// END CLASS

  // --------------------
  // inject
  // --------------------

  angular.module( 'iscHsCommunityAngular' )
    .animation( '.fade-in-out', iscFadeInOutAnimation );

})();


