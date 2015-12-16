/**
 * Created by douglas goodman on 2/2/15.
 */

(function(){
  'use strict';

  /* @ngInject */
  function iscNavContainerSecondaryNavAnimation( devlog, iscAnimationService, TweenMax, EASE_DUR ,iscCustomConfigService){

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
      devlog.channel('iscNavContainerSecondaryNavAnimation').debug( 'iscNavContainerSecondaryNavAnimation.beforeAddClass' );

      if( className === 'secondary-nav' ){

        var width = iscAnimationService.getNavWidth();
        var height = iscAnimationService.getSecondaryNavHeight( element.height() );

        var offsetX = element[0].offsetLeft;
        var offsetY = element[0].offsetTop;

        // when its inside the page
        var xPos = iscAnimationService.isPhone() ? -offsetX : iscAnimationService.getElementXPos( width, offsetX );
        var yPos = -height - 50; // -50 ensures its offstage
        var yPosEnd = iscAnimationService.isPhone() ? -offsetY + 20 : iscAnimationService.getElementYPos( height, offsetY );

        devlog.channel('iscNavContainerSecondaryNavAnimation').debug( '\n...element',element );
        devlog.channel('iscNavContainerSecondaryNavAnimation').debug( '.....width',width );
        devlog.channel('iscNavContainerSecondaryNavAnimation').debug( '....height',height );
        devlog.channel('iscNavContainerSecondaryNavAnimation').debug( '...offsetX', offsetX );
        devlog.channel('iscNavContainerSecondaryNavAnimation').debug( '...offsetY', offsetY );
        devlog.channel('iscNavContainerSecondaryNavAnimation').debug( '......xPos',xPos );
        devlog.channel('iscNavContainerSecondaryNavAnimation').debug( '......yPos',yPos );
        devlog.channel('iscNavContainerSecondaryNavAnimation').debug( '...yPosEnd',yPosEnd );

        TweenMax.set( element, {x:xPos, y: yPos, display: 'block', autoAlpha:1, width: width, height: height});
        TweenMax.to( element, EASE_DUR, { ease: Power2.easeOut, y: yPosEnd, onComplete: done });//jshint ignore:line
      }
      else {
        done();
      }
    }

    function beforeRemoveClass( element, className, done ){
      devlog.channel('iscNavContainerSecondaryNavAnimation').debug( 'iscNavContainerSecondaryNavAnimation.beforeRemoveClass' );
      if( className === 'secondary-nav' ){
        var yPos = -element.height() - element[0].offsetTop;
        TweenMax.to( element, EASE_DUR, { ease: Power2.easeOut, y: yPos, onComplete: onRemoveComplete, onCompleteParams:[element, done] });//jshint ignore:line
      }
      else {
        done();
      }
    }

    function onRemoveComplete( elem, done ){
      TweenMax.set( elem, {autoAlpha:0, top: -1000, left: -1000, display: 'block'});
      done();
    }

  }// END CLASS

  // --------------------
  // inject
  // --------------------

  angular.module( 'iscNavContainer' )
      .animation( '.secondary-nav', iscNavContainerSecondaryNavAnimation );

})();


