/**
 * Created by douglas goodman on 3/4/15.
 */

(function(){
  'use strict';

  iscEmergencyWarningAnimation.$inject = ['$log', "$window", 'TweenMax', 'EASE_DUR'];

  function iscEmergencyWarningAnimation( $log, $window, TweenMax, EASE_DUR ){

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
      //$log.debug( 'iscEmergencyWarningAnimation.beforeAddClass' );
      if( className === 'show-warning' ){
        TweenMax.to( element, EASE_DUR, {autoAlpha: 1});
      }
      else {
        done();
      }
    }

    function beforeRemoveClass( element, className, done ){
      //$log.debug( 'iscEmergencyWarningAnimation.beforeRemoveClass' );
      if( className === 'show-warning' ){
        TweenMax.to( element, EASE_DUR, {autoAlpha: 0, onComplete:onRemoveComplete, onCompleteParams:[element, done]});
      }
      else {
        done();
      }
    }

    function onRemoveComplete( element, done ){
      var css = {
        display: 'none'
      };

      TweenMax.set( element, {css:css});
      done();
    }

  }// END CLASS

  // --------------------
  // inject
  // --------------------

  angular.module( 'iscMessages' )
    .animation( '.show-warning', iscEmergencyWarningAnimation );

})();


