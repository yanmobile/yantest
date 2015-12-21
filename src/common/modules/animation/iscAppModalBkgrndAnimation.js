/**
 * Created by douglas goodman on 2/2/15.
 */

(function(){
  'use strict';

  angular.module( 'isc.animation' )
    .animation( '.modal-bg-anime', iscAppModalBkgrndAnimation );

  /* @ngInject */
  function iscAppModalBkgrndAnimation( devlog, $window, iscAnimationService, TweenMax, EASE_DUR ){

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
      devlog.channel('iscAppModalBkgrndAnimation').debug( 'iscAppModalBkgrndAnimation.beforeAddClass' );
      if (className === 'modal-bg-anime') {
        TweenMax.set(element, {
          display  : 'block',
          autoAlpha: 0,
          width    : iscAnimationService.getFullWidth() + 50,
          height   : iscAnimationService.getFullHeight() + 50,
          x        : -25,
          y        : -25
        });//jshint ignore:line
        TweenMax.to(element, EASE_DUR, { ease: Power2.easeOut, autoAlpha: 0.75, onComplete: done });//jshint ignore:line
      }
      else {
        done();
      }
    }

    function beforeRemoveClass( element, className, done ){
      devlog.channel('iscAppModalBkgrndAnimation').debug( 'iscAppModalBkgrndAnimation.beforeRemoveClass' );
      if( className === 'modal-bg-anime' ){
        TweenMax.to( element, EASE_DUR, { ease: Power2.easeOut, autoAlpha: 0, onComplete: onRemoveComplete, onCompleteParams:[element, done] });//jshint ignore:line
      }
      else {
        done();
      }
    }

    function onRemoveComplete( elem, done ){
      TweenMax.set( elem, {display:'none', autoAlpha:0});
      done();
    }

  }// END CLASS


})();
