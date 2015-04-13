/**
 * Created by douglasgoodman on 11/18/14.
 */

 (function(){
  'use strict';

  iscWellnessModel.$inject = [ '$log'];

  function iscWellnessModel( $log ){
      //$log.debug( 'iscWellnessModel LOADED');

    // ----------------------------
    // class factory
    // ----------------------------

    var wellnessTiles = [];
    var model = {
      getWellnessTiles: getWellnessTiles,
      setWellnessTiles: setWellnessTiles
    };

    return model;


    // ----------------------------
    // functions
    // ----------------------------

    // -------------
    function getWellnessTiles(){
        //$log.debug( 'iscWellnessModel.getWellnessTiles');
      return wellnessTiles;
    }

    function setWellnessTiles( val ){
      //$log.debug( 'iscWellnessModel.setWellnessTiles');
      //$log.debug(val);
     wellnessTiles  = val;
    }
  };


  // ----------------------------
  // functions
  // ----------------------------

  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'iscWellness' )
  .factory( 'iscWellnessModel', iscWellnessModel );

})();
