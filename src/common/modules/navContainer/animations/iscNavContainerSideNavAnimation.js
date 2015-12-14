/**
 * Created by douglas goodman on 2/2/15.
 */

(function(){
  'use strict';

  /* @ngInject */
  function iscNavContainerSideNavAnimation( devlog, $rootScope, $window, iscAnimationService, TweenMax, EASE_DUR ){

  // --------------------
  // vars
  // --------------------

    //var X_OFFSET = 50;
    //var Y_OFFSET = 100;

    var width, height;
    var xPos, xPosEnd;
    var yPos;

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
      devlog.channel('iscNavContainerSideNavAnimation').debug( 'iscNavContainerSideNavAnimation.beforeAddClass' );

      if( className === 'side-nav' ){

        width = iscAnimationService.getNavWidth();
        height = iscAnimationService.getSideNavHeight( element.height() );

        var offsetX = element[0].offsetLeft;
        var offsetY = element[0].offsetTop;

        // set the w and h now, since the other calcs are dependent on that
        //TweenMax.set( element, {autoAlpha:1, width: width, height: height, display:'block'});
        TweenMax.set( element, {autoAlpha:1, width: width, display:'block'});

        xPos = -width - 20; // -20 ensures its off stage
        xPosEnd = iscAnimationService.isPhone() ? -offsetX : iscAnimationService.getElementXPos( width, offsetX );
        yPos = iscAnimationService.isPhone()  ? -offsetY + 20 : iscAnimationService.getElementYPos( height, offsetY );

        devlog.channel('iscNavContainerSideNavAnimation').debug( '...height',height );
        devlog.channel('iscNavContainerSideNavAnimation').debug( '...yPos',yPos );

        // now set the x and y pos, based on the new sizes
        TweenMax.set( element, {x:xPos, y: yPos});
        TweenMax.to( element, EASE_DUR, { ease: Power2.easeOut, x: xPosEnd, onComplete: done });//jshint ignore:line
      }
      else {
        done();
      }
    }

    function beforeRemoveClass( element, className, done ){
      devlog.channel('iscNavContainerSideNavAnimation').debug( 'iscNavContainerSideNavAnimation.beforeRemoveClass' );
      if( className === 'side-nav' ){
        xPos = - element.width() - 50 -element[0].offsetLeft;
        TweenMax.to( element, EASE_DUR, { ease: Power2.easeOut, x: xPos, onComplete: onRemoveComplete, onCompleteParams:[element, done] });//jshint ignore:line
      }
      else {
        done();
      }
    }

    function onRemoveComplete( elem, done ){
      TweenMax.set( elem, {autoAlpha:0, top: -1000, left: -1000, display:'block'});
      done();
    }


  }// END CLASS

  // --------------------
  // inject
  // --------------------

  angular.module( 'iscNavContainer' )
    .animation( '.side-nav', iscNavContainerSideNavAnimation );

})();


