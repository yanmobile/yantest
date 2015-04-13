/**
 * Created by douglas goodman on 3/10/15.
 */

(function(){
  'use strict';

  iscFadeInOutMessageAnimation.$inject = ['$log', "$window", 'TweenMax', 'EASE_DUR'];

  function iscFadeInOutMessageAnimation( $log, $window, TweenMax, EASE_DUR ){

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
      //$log.debug( 'iscFadeInOutMessageAnimation.beforeAddClass' );

      if( className === 'fade-in-out-messages' ){
        TweenMax.set( '.isc-show-message-wrapper', {autoAlpha: 0, display: 'none'});
        TweenMax.set( '.isc-edit-message-wrapper', {autoAlpha: 0, display: 'block'});

        TweenMax.to( element.find('.isc-edit-message-wrapper'), EASE_DUR, {autoAlpha: 1, onComplete: done})
      }
      else {
        done();
      }
    }

    function beforeRemoveClass( element, className, done ){
      //$log.debug( 'iscFadeInOutMessageAnimation.beforeRemoveClass' );
      if( className === 'fade-in-out-messages' ){

        TweenMax.set( '.isc-show-message-wrapper', {autoAlpha: 0, display: 'block'});
        TweenMax.set( '.isc-edit-message-wrapper', {autoAlpha: 0, display: 'none'});

        TweenMax.to( element.find('.isc-show-message-wrapper'), EASE_DUR, {autoAlpha: 1, onComplete: done})
      }
      else {
        done();
      }
    }

    function onRemoveComplete( element, done ){
      // reset element here
      TweenMax.set( element, {autoAlpha: 0});
      done();
    }

  }// END CLASS

  // --------------------
  // inject
  // --------------------

  angular.module( 'iscMessages' )
    .animation( '.fade-in-out-messages', iscFadeInOutMessageAnimation );

})();


