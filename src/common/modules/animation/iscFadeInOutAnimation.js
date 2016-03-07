/**
 * Created by douglas goodman on 3/10/15.
 */

(function(){
  'use strict';

  angular.module( 'isc.animation' )
    .animation( '.fade-in-out', iscFadeInOutAnimation );

  /* @ngInject */
  /**
   * @ngdoc animation
   * @memberof core-ui-animation
   * @name iscFadeInOutAnimation
   * @param devlog
   * @param $window
   * @param TweenMax
   * @param EASE_DUR
   * @returns {{beforeAddClass: beforeAddClass, beforeRemoveClass: beforeRemoveClass}}
     */
  function iscFadeInOutAnimation( devlog, $window, TweenMax, EASE_DUR ){

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
     * @memberof iscFadeInOutAnimation
     * @param element
     * @param className
     * @param done
       */
    function beforeAddClass( element, className, done ){
      devlog.channel('iscFadeInOutAnimation').debug( 'iscFadeInOutAnimation.beforeAddClass' );

      if( className === 'fade-in-out' ){
        TweenMax.set( element, {autoAlpha: 0, display: 'block'});
        TweenMax.to( element, EASE_DUR, {autoAlpha: 1, onComplete: done} );
      }
      else {
        done();
      }
    }

    /**
     * @memberof iscFadeInOutAnimation
     * @param element
     * @param className
     * @param done
       */
    function beforeRemoveClass( element, className, done ){
      devlog.channel('iscFadeInOutAnimation').debug( 'iscFadeInOutAnimation.beforeRemoveClass' );
      if( className === 'fade-in-out' ){
        TweenMax.to( element, EASE_DUR, {autoAlpha: 0, onComplete: onRemoveComplete, onCompleteParams: [element, done]});//jshint ignore:line
      }
      else {
        done();
      }
    }

    /**
     * @memberof iscFadeInOutAnimation
     * @param element
     * @param done
       */
    function onRemoveComplete( element, done ){
      // reset element here
      TweenMax.set( element, {autoAlpha: 0, display: 'none'});
      done();
    }

  }// END CLASS

})();


