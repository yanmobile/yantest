/**
 * Created by dgoodman on 2/3/15.
 */

(function () {
  'use strict';

  // ----------------------------
  // injection
  // ----------------------------

  angular.module('iscNavContainer')
    .factory('iscNavContainerModel', iscNavContainerModel);


  /* @ngInject */
  function iscNavContainerModel(devlog, iscCustomConfigHelper) {
//   devlog('iscNavContainerModel').debug( 'iscNavContainerModel LOADED');

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
    function getSecondaryNav() {
      devlog('iscNavContainerModel').debug('getSecondaryNav');
      return secondaryNav;
    }

    function setSecondaryNav(val) {
      devlog('iscNavContainerModel').debug('setSecondaryNav');
      secondaryNav = val;
    }

    function getSecondaryNavTasks() {
      devlog('iscNavContainerModel').debug('getSecondaryNavTasks');
      return secondaryNavTasks;
    }

    function setSecondaryNavTasks(val) {
      devlog('iscNavContainerModel').debug('setSecondaryNavTasks');
      secondaryNavTasks = val;
    }

    function hasSecondaryNavTasks() {
      return !!secondaryNavTasks && secondaryNavTasks.length > 0;
    }

    function getCurrentStateTranslationKey() {
      return iscCustomConfigHelper.getCurrentStateTranslationKey();
    }


  }//END CLASS



})();

