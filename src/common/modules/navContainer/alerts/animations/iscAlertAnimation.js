/**
 * Created by douglas goodman on 2/2/15.
 */

(function(){
  'use strict';

  /* @ngInject */
  function iscAlertAnimation( devlog, $window, TweenMax, iscAnimationService, EASE_DUR ){
    devlog.channel('iscAlertAnimation').debug( 'iscAlertAnimation.loaded' );
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
      devlog.channel('iscAlertAnimation').debug( 'iscAlertAnimation.beforeAddClass' );

      if( className === 'alert-anime' ){

        var marginOffset = 10;
        var width = iscAnimationService.getNavWidth() - (marginOffset * 2);
        var offsetX = element[0].offsetLeft;

        var xPos = iscAnimationService.isPhone() ? -offsetX + marginOffset : iscAnimationService.getElementXPos( width, offsetX );
        var yPos = iscAnimationService.isPhone()? 55 : 75;

        TweenMax.set( element, {autoAlpha:0, x:xPos, y: yPos, width: width, display:'block'});
        TweenMax.to( element, EASE_DUR, { ease: Power2.easeOut, autoAlpha: 1, onComplete: done });//jshint ignore:line
      }
      else {
        done();
      }
    }

    function beforeRemoveClass( element, className, done ){
      devlog.channel('iscAlertAnimation').debug( 'iscAlertAnimation.beforeRemoveClass' );

      if( className === 'alert-anime' ){
        //var xPos = - element.width() - 50;

        TweenMax.to( element, EASE_DUR, { ease: Power2.easeOut, autoAlpha: 0, onComplete: onRemoveComplete, onCompleteParams:[element, done] });//jshint ignore:line
      }
      else {
        done();
      }
    }

    function onRemoveComplete( element, done ){
      var xPos = -element.width() - 20;
      TweenMax.set( element, {autoAlpha:0, x:xPos, display: 'none' });
      done();
    }


  }// END CLASS

  // --------------------
  // inject
  // --------------------

  angular.module( 'iscNavContainer' )
    .animation( '.alert-anime', iscAlertAnimation );

})();


