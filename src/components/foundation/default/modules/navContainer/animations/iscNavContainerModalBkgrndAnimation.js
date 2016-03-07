/**
 * Created by douglas goodman on 2/2/15.
 */

(function(){
  'use strict';

  // --------------------
  // inject
  // --------------------

  angular.module( 'iscNavContainer' )
    .animation( '.modal-bkgrnd-anime', iscNavContainerModalBkgrndAnimation );
  
  /* @ngInject */
  function iscNavContainerModalBkgrndAnimation( devlog, $window, iscAnimationService, TweenMax, EASE_DUR ){

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
      devlog.channel('iscNavContainerModalBkgrndAnimation').debug( 'iscNavContainerModalBkgrndAnimation.beforeAddClass' );
      if (className === 'modal-bkgrnd-anime') {
        TweenMax.set(element, {
          autoAlpha: 0,
          display  : 'block',
          width    : iscAnimationService.getFullWidth() + 50,
          height   : iscAnimationService.getFullHeight() + 50,
          x        : -25,
          y        : -25
        });
        TweenMax.to(element, EASE_DUR, { ease: Power2.easeOut, autoAlpha: .75, onComplete: done });//jshint ignore:line
      }
      else {
        done();
      }
    }

    function beforeRemoveClass( element, className, done ){
      devlog.channel('iscNavContainerModalBkgrndAnimation').debug( 'iscNavContainerModalBkgrndAnimation.beforeRemoveClass' );
      if( className === 'modal-bkgrnd-anime' ){
        TweenMax.to( element, EASE_DUR, { ease: Power2.easeOut, autoAlpha: 0, onComplete: onRemoveComplete, onCompleteParams:[element, done] });//jshint ignore:line
      }
      else {
        done();
      }
    }

    function onRemoveComplete( elem, done ){
      TweenMax.set( elem, {autoAlpha:0, display: 'none'});
      done();
    }

  }// END CLASS

})();
