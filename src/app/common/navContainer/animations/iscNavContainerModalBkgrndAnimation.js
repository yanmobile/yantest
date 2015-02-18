/**
 * Created by douglas goodman on 2/2/15.
 */

(function(){
  'use strict';

  iscNavContainerModalBkgrndAnimation.$inject = ['$log', 'TweenMax', 'EASE_DUR'];

  function iscNavContainerModalBkgrndAnimation( $log,  TweenMax, EASE_DUR ){

  // --------------------
  // vars
  // --------------------

  // --------------------
  // init
  // --------------------
    TweenMax.set( $(".modal-bkgrnd-anime-dropdown-menu-bkgrnd"), { autoAlpha: 0 });

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
      //$log.debug( 'iscNavContainerModalBkgrndAnimation.beforeAddClass' );
      if( className === 'modal-bkgrnd-anime' ){
        TweenMax.set( element, {autoAlpha:0});
        TweenMax.to( element, EASE_DUR, { ease: Power2.easeOut, autoAlpha:.75, onComplete: done });
      }
      else {
        done();
      }
    }

    function beforeRemoveClass( element, className, done ){
      //$log.debug( 'iscNavContainerModalBkgrndAnimation.beforeRemoveClass' );
      if( className === 'modal-bkgrnd-anime' ){
        TweenMax.to( element, EASE_DUR, { ease: Power2.easeOut, autoAlpha: 0, onComplete: onRemoveComplete, onCompleteParams:[element, done] });
      }
      else {
        done();
      }
    }

    function onRemoveComplete( elem, done ){
      TweenMax.set( elem, {autoAlpha:0});
      done();
    }

  }// END CLASS

  // --------------------
  // inject
  // --------------------

  angular.module( 'iscNavContainer' )
    .animation( '.modal-bkgrnd-anime', iscNavContainerModalBkgrndAnimation );

})();
