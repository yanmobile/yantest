/**
 * Created by douglas goodman on 2/2/15.
 */

(function(){
  'use strict';

  iscAlertAnimation.$inject = ['$log', "$window", 'TweenMax', 'EASE_DUR'];

  function iscAlertAnimation( $log, $window, TweenMax, EASE_DUR ){
    //$log.debug( 'iscAlertAnimation.loaded' );
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
      //$log.debug( 'iscAlertAnimation.beforeAddClass' );

      if( className === 'alert-anime' ){
        var appW = $window.innerWidth;
        var appH = $window.innerHeight;
        var isPhone = ( appW <= 480 );
        var isTab = ( appW <= 960 );

        var marginOffset = isPhone? 15 : 25;

        var width = getWidth( appW, isPhone, isTab );
        var xPos = ($window.innerWidth - width - marginOffset) / 2;
        var yPos = isPhone? 55 : 75;

        TweenMax.set( element, {autoAlpha:0, x:xPos, y: yPos, width: width});
        TweenMax.to( element, EASE_DUR, { ease: Power2.easeOut, autoAlpha: 1, onComplete: done });
      }
      else {
        done();
      }
    }

    function beforeRemoveClass( element, className, done ){
      //$log.debug( 'iscAlertAnimation.beforeRemoveClass' );

      if( className === 'alert-anime' ){
        var xPos = - element.width() - 50;

        TweenMax.to( element, EASE_DUR, { ease: Power2.easeOut, autoAlpha: 0, onComplete: onRemoveComplete, onCompleteParams:[element, done] });
      }
      else {
        done();
      }
    }

    function onRemoveComplete( element, done ){
      var appW = $window.screen.availWidth;
      var appH = $window.screen.availHeight;
      var xPos = -element.width() - 20;
      TweenMax.set( element, {autoAlpha:0, x:xPos });
      done();
    }

    function getWidth( appW, isPhone, isTab ){
      if( isPhone ){
        return appW;
      }
      else if( isTab ){
        return appW * .5;
      }
      else{
        return appW * .35;
      }
    }

  }// END CLASS

  // --------------------
  // inject
  // --------------------

  angular.module( 'iscNavContainer' )
    .animation( '.alert-anime', iscAlertAnimation );

})();


