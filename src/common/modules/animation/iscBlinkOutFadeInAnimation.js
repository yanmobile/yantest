/**
 * Created by douglas goodman on 3/10/15.
 */

(function(){
  'use strict';

  angular.module( 'isc.animation' )
    .animation( '.blink-out-fade-in', iscBlinkOutFadeInAnimation );


  /* @ngInject */
  /**
   * @ngdoc animation
   * @memberof core-ui-animation
   * @name iscBlinkOutFadeInAnimation
   * @param devlog
   * @param $window
   * @param TweenMax
   * @param EASE_DUR
   * @returns {{beforeAddClass: beforeAddClass, beforeRemoveClass: beforeRemoveClass}}
     */
  function iscBlinkOutFadeInAnimation( devlog, $window, TweenMax, EASE_DUR ){

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

    /**
     * @memberof iscBlinkOutFadeInAnimation
     * @param element
     * @param className
     * @param done
       */
    function beforeAddClass( element, className, done ){
      devlog.channel('iscBlinkOutFadeInAnimation').debug( 'iscBlinkOutFadeInAnimation.beforeAddClass' );
      if( className === 'blink-out-fade-in' ){
        TweenMax.set( element, {autoAlpha: 0, display: 'none'});
        done();
      }
      else {
        done();
      }
    }

    /**
     * @memberof iscBlinkOutFadeInAnimation
     * @param element
     * @param className
     * @param done
       */
    function beforeRemoveClass( element, className, done ){
      devlog.channel('iscBlinkOutFadeInAnimation').debug( 'iscBlinkOutFadeInAnimation.beforeRemoveClass' );
      if( className === 'blink-out-fade-in' ){
        TweenMax.set( element, {autoAlpha: 0, display: 'block'});
        TweenMax.to( element, EASE_DUR, {autoAlpha: 1, onComplete: done});
      }
      else {
        done();
      }
    }

  }// END CLASS

})();


