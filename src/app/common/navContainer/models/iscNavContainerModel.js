/**
 * Created by dgoodman on 2/3/15.
 */
/**
 * Created by douglasgoodman on 2/3/15.
 */

(function () {
  'use strict';

  iscNavContainerModel.$inject = ['$log', 'iscCustomConfigHelper'];

  function iscNavContainerModel( $log, iscCustomConfigHelper ){
//    //$log.debug( 'iscNavContainerModel LOADED');

    // ----------------------------
    // vars
    // ----------------------------
    var secondaryNav;

    // ----------------------------
    // class factory
    // ----------------------------
    var model = {
      getSecondaryNav: getSecondaryNav,
      setSecondaryNav: setSecondaryNav,

      getCurrentStateTranslationKey: getCurrentStateTranslationKey
    };

    return model;

    // ----------------------------
    // functions
    // ----------------------------
    function getSecondaryNav(){
      //$log.debug( 'iscNavContainerModel.getSecondaryNav', secondaryNav);
      return secondaryNav;
    }

    function setSecondaryNav( val ){
      //$log.debug( 'iscNavContainerModel.setSecondaryNav', val);
      secondaryNav = val;
    }

    function getCurrentStateTranslationKey(){
      var key =  iscCustomConfigHelper.getCurrentStateTranslationKey();
      return key;
    }


  }//END CLASS


  // ----------------------------
  // injection
  // ----------------------------

  angular.module('iscNavContainer')
    .factory('iscNavContainerModel', iscNavContainerModel);

})();

