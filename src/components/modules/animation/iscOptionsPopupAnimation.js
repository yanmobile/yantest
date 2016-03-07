/**
 * Created by douglas goodman on 2/2/15.
 */

(function(){
  'use strict';

  angular.module( 'isc.animation' )
    .animation( '.popup-anime', iscOptionsPopupAnimation );

  /* @ngInject */
  function iscOptionsPopupAnimation( devlog, iscAnimationService, TweenMax, EASE_DUR ){

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
      devlog.channel('iscOptionsPopupAnimation').debug( 'iscOptionsPopupAnimation.beforeAddClass' );
      //
      if( className === 'popup-anime' ){

        var offsetX = element[0].offsetLeft;
        var offsetY = element[0].offsetTop;

        var width = iscAnimationService.isPhone() ? iscAnimationService.getNavWidth() -20 : iscAnimationService.getNavWidth();
        var height = iscAnimationService.getSecondaryNavHeight( element.height() );

        // set the w and h now, since the other calcs are dependent on that
        TweenMax.set( element, {autoAlpha:1, width: width, height: height, x: 0, y: 0});

        var xPos = iscAnimationService.isPhone() ? 0 : iscAnimationService.getElementXPos( width, offsetX );
        var yPos = -height - 50; // -50 ensures its offstage
        var yPosEnd = iscAnimationService.getElementYPos( height, offsetY );

        devlog.channel('iscOptionsPopupAnimation').debug( '...iscAnimationService.getAppWidth()',iscAnimationService.getAppWidth() );
        devlog.channel('iscOptionsPopupAnimation').debug( '...width',width );
        devlog.channel('iscOptionsPopupAnimation').debug( '...offsetX',offsetX );
        devlog.channel('iscOptionsPopupAnimation').debug( '...xPos',xPos );
        devlog.channel('iscOptionsPopupAnimation').debug( '...yPos',yPos );
        devlog.channel('iscOptionsPopupAnimation').debug( '...yPosEnd',yPosEnd );

        TweenMax.set( element, { x:xPos, y: yPos, autoAlpha: 1 });
        TweenMax.to( element, EASE_DUR, { ease: Power2.easeOut, y: yPosEnd, onComplete: done });//jshint ignore:line
      }
      else {
        done();
      }
    }

    function beforeRemoveClass( element, className, done ){
      devlog.channel('iscOptionsPopupAnimation').debug( 'iscOptionsPopupAnimation.beforeRemoveClass' );
      if( className === 'popup-anime' ){

        var offsetY = element[0].offsetTop;
        var height = iscAnimationService.getSecondaryNavHeight( element.height() );
        var yPos = -height - offsetY - 20;

        TweenMax.to( element, EASE_DUR, { ease: Power2.easeOut, y: yPos, onComplete: onRemoveComplete, onCompleteParams:[element, done] });//jshint ignore:line
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

})();


