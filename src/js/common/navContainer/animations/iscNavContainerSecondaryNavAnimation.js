/**
 * Created by douglas goodman on 2/2/15.
 */

(function(){
  'use strict';

  iscNavContainerSecondaryNavAnimation.$inject = ['$log', 'iscAnimationService', 'TweenMax', 'EASE_DUR'];

  function iscNavContainerSecondaryNavAnimation( $log, iscAnimationService, TweenMax, EASE_DUR ){

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
      //$log.debug( 'iscNavContainerSecondaryNavAnimation.beforeAddClass' );

      if( className === 'secondary-nav' ){

        var width = iscAnimationService.getNavWidth();
        var height = iscAnimationService.getSecondaryNavHeight( element.height() );

        var offsetX = element[0].offsetLeft;
        var offsetY = element[0].offsetTop;

        // set the w and h now, since the other calcs are dependent on that
        TweenMax.set( element, {autoAlpha:1, width: width, height: height});

        // when its inside the page
        var xPos = iscAnimationService.isPhone() ? -offsetX : iscAnimationService.getElementXPos( width, offsetX );
        var yPos = -height - 50; // -50 ensures its offstage
        var yPosEnd = iscAnimationService.isPhone() ? -offsetY + 20 : iscAnimationService.getElementYPos( height, offsetY );

        //$log.debug( '...element.height()',element.height() );
        //$log.debug( '...height',height );
        //$log.debug( '...offsetTop',element[0].offsetTop );
        //$log.debug( '...yPosEnd',yPosEnd );

        TweenMax.set( element, {x:xPos, y: yPos, display: 'block'});
        TweenMax.to( element, EASE_DUR, { ease: Power2.easeOut, y: yPosEnd, onComplete: done });
      }
      else {
        done();
      }
    }

    function beforeRemoveClass( element, className, done ){
      //$log.debug( 'iscNavContainerSecondaryNavAnimation.beforeRemoveClass' );
      if( className === 'secondary-nav' ){
        var yPos = -element.height() - element[0].offsetTop;
        TweenMax.to( element, EASE_DUR, { ease: Power2.easeOut, y: yPos, onComplete: onRemoveComplete, onCompleteParams:[element, done] });
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

  // --------------------
  // inject
  // --------------------

  angular.module( 'iscNavContainer' )
    .animation( '.secondary-nav', iscNavContainerSecondaryNavAnimation );

})();


