/**
 * Created by douglas goodman on 3/10/15.
 */

(function(){
  'use strict';

  angular.module( 'isc.animation' )
    .animation( '.fade-out-in', iscFadeOutInAnimation );

  /* @ngInject */
  /**
   * @ngdoc animation
   * @memberof core-ui-animation
   * @name iscFadeOutInAnimation
   * @param devlog
   * @param $window
   * @param TweenMax
   * @param EASE_DUR
   * @returns {{beforeAddClass: beforeAddClass, beforeRemoveClass: beforeRemoveClass}}
     */
  function iscFadeOutInAnimation( devlog, $window, TweenMax, EASE_DUR ){

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
     * @memberof iscFadeOutInAnimation
     * @param element
     * @param className
     * @param done
       */
    function beforeAddClass( element, className, done ){
      devlog.channel('').debug( 'iscFadeOutInAnimation.beforeAddClass' );

      if( className === 'fade-out-in' ){
        TweenMax.set( element, {autoAlpha: 1, display: 'block'});
        TweenMax.to( element, EASE_DUR, {autoAlpha: 0, onComplete: onRemoveComplete, onCompleteParams:[element, done]});
      }
      else {
        done();
      }
    }

    /**
     * @memberof iscFadeOutInAnimation
     * @param element
     * @param className
     * @param done
       */
    function beforeRemoveClass( element, className, done ){
      devlog.channel('').debug( 'iscFadeOutInAnimation.beforeRemoveClass' );
      if( className === 'fade-out-in' ){
        TweenMax.to( element, EASE_DUR, {autoAlpha: 1, onComplete: done});
      }
      else {
        done();
      }
    }

    /**
     * @memberof iscFadeOutInAnimation
     * @param element
     * @param done
       */
    function onRemoveComplete( element, done ){
      // reset element here
      TweenMax.set( element, {autoAlpha: 1, display: 'none'});
      done();
    }

  }// END CLASS

})();


