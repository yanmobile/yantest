/**
 * Created by douglas goodman on 2/2/15.
 */

(function(){
  'use strict';

  iscOptionsPopupAnimation.$inject = ['$log', 'iscAnimationService', 'TweenMax', 'EASE_DUR'];

  function iscOptionsPopupAnimation( $log, iscAnimationService, TweenMax, EASE_DUR ){

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
      //$log.debug( 'iscOptionsPopupAnimation.beforeAddClass' );

      if( className === 'popup-anime' ){

        var offsetX = element[0].offsetLeft;
        var offsetY = element[0].offsetTop;

        var width = iscAnimationService.isPhone() ? iscAnimationService.getNavWidth() -20 : iscAnimationService.getNavWidth();
        var height = iscAnimationService.getSecondaryNavHeight( element.height() );

        // set the w and h now, since the other calcs are dependent on that
        TweenMax.set( element, {autoAlpha:1, width: width, height: height});


        // when its inside the page
        var xPos = iscAnimationService.isPhone() ? 0 : iscAnimationService.getElementXPos( width, offsetX );
        var yPos = -height - 50; // -50 ensures its offstage
        var yPosEnd = iscAnimationService.getElementYPos( height, offsetY );

        //$log.debug( '...iscAnimationService.getAppWidth()',iscAnimationService.getAppWidth() );
        //$log.debug( '...width',width );
        //$log.debug( '...offsetX',offsetX );

        TweenMax.set( element, {x:xPos, y: yPos});
        TweenMax.to( element, EASE_DUR, { ease: Power2.easeOut, y: yPosEnd, onComplete: done });
      }
      else {
        done();
      }
    }

    function beforeRemoveClass( element, className, done ){
      //$log.debug( 'iscOptionsPopupAnimation.beforeRemoveClass' );
      if( className === 'popup-anime' ){

        var offsetY = element[0].offsetTop;
        var height = iscAnimationService.getSecondaryNavHeight( element.height() );
        var yPos = -height - offsetY - 20;

        TweenMax.to( element, EASE_DUR, { ease: Power2.easeOut, y: yPos, onComplete: onRemoveComplete, onCompleteParams:[element, done] });
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

  angular.module( 'iscHsCommunityAngular' )
    .animation( '.popup-anime', iscOptionsPopupAnimation );

})();


