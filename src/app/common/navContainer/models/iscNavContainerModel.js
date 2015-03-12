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
    var secondaryNavTasks;

    // ----------------------------
    // class factory
    // ----------------------------
    var model = {
      getSecondaryNav: getSecondaryNav,
      setSecondaryNav: setSecondaryNav,

      getSecondaryNavTasks: getSecondaryNavTasks,
      setSecondaryNavTasks: setSecondaryNavTasks,
      hasSecondaryNavTasks: hasSecondaryNavTasks,

      getCurrentStateTranslationKey: getCurrentStateTranslationKey
    };

    return model;

    // ----------------------------
    // functions
    // ----------------------------
    function getSecondaryNav(){
      //$log.debug( 'iscNavContainerModel.getSecondaryNav');
      return secondaryNav;
    }

    function setSecondaryNav( val ){
      //$log.debug( 'iscNavContainerModel.setSecondaryNav');
      secondaryNav = val;
    }

    function getSecondaryNavTasks(){
      //$log.debug( 'iscNavContainerModel.getSecondaryNavTasks');
      return secondaryNavTasks;
    }

    function setSecondaryNavTasks( val ){
      //$log.debug( 'iscNavContainerModel.setSecondaryNavTasks');
      secondaryNavTasks = val;
    }

    function hasSecondaryNavTasks(){
      return !!secondaryNavTasks && secondaryNavTasks.length > 0;
    }

    function getCurrentStateTranslationKey(){
      return iscCustomConfigHelper.getCurrentStateTranslationKey();
    }


  }//END CLASS


  // ----------------------------
  // injection
  // ----------------------------

  angular.module('iscNavContainer')
    .factory('iscNavContainerModel', iscNavContainerModel);

})();

