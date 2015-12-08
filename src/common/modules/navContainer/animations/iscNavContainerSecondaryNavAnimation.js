/**
 * Created by douglas goodman on 2/2/15.
 */

(function(){
  'use strict';

  iscNavContainerSecondaryNavAnimation.$inject = ['$log', 'iscAnimationService', 'TweenMax', 'EASE_DUR','iscCustomConfigService'];

  function iscNavContainerSecondaryNavAnimation( $log, iscAnimationService, TweenMax, EASE_DUR ,iscCustomConfigService){

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

        // when its inside the page
        var xPos = iscAnimationService.isPhone() ? -offsetX : iscAnimationService.getElementXPos( width, offsetX );
        var yPos = -height - 50; // -50 ensures its offstage
        var yPosEnd = iscAnimationService.isPhone() ? -offsetY + 20 : iscAnimationService.getElementYPos( height, offsetY );

        //$log.debug( '\n...element',element );
        //$log.debug( '.....width',width );
        //$log.debug( '....height',height );
        //$log.debug( '...offsetX', offsetX );
        //$log.debug( '...offsetY', offsetY );
        //$log.debug( '......xPos',xPos );
        //$log.debug( '......yPos',yPos );
        //$log.debug( '...yPosEnd',yPosEnd );

        TweenMax.set( element, {x:xPos, y: yPos, display: 'block', autoAlpha:1, width: width, height: height});
        TweenMax.to( element, EASE_DUR, { ease: Power2.easeOut, y: yPosEnd, onComplete: done });//jshint ignore:line
      }
      else {
        done();
      }
    }

    function beforeRemoveClass( element, className, done ){
      //$log.debug( 'iscNavContainerSecondaryNavAnimation.beforeRemoveClass' );
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


