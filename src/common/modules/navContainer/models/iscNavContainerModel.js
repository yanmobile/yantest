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

  function iscNavContainerModel(devlog, $state, iscCustomConfigService, iscSessionModel, iscStateManager) {
    // devlog('iscNavContainerModel').debug( 'iscNavContainerModel LOADED');

    // ----------------------------
    // vars
    // ----------------------------
    var topNavArr = {};
    var secondaryNav;
    var secondaryNavTasks;


    // ----------------------------
    // class factory
    // ----------------------------
    var model = {

      getTopNav: getTopNav,

      getSecondaryNav: getSecondaryNav,
      setSecondaryNav: setSecondaryNav,

      getSecondaryNavTasks: getSecondaryNavTasks,
      setSecondaryNavTasks: setSecondaryNavTasks,
      hasSecondaryNavTasks: hasSecondaryNavTasks,

      getCurrentStateTranslationKey: getCurrentStateTranslationKey,

      navigateToUserLandingPage: navigateToUserLandingPage
    };

    return model;

    // ----------------------------
    // functions
    // ----------------------------

    function navigateToUserLandingPage() {
      var currentUserRole = iscSessionModel.getCurrentUserRole();
      var landingPage     = iscCustomConfigService.getConfigSection('landingPages')[currentUserRole];
      $state.go(landingPage);
    }

    function getTopNav() {
      var currentUserRole = iscSessionModel.getCurrentUserRole();
      if(!topNavArr[currentUserRole]){
        var topTabs = iscCustomConfigService.getConfigSection('topTabs');
        var userTabs = _.extend({}, topTabs['*']); //show all tabs that's for anonymous
        if (currentUserRole !== '*') {
          _.extend(userTabs, topTabs[currentUserRole]);
          topNavArr[currentUserRole] = _.toArray(userTabs);
        }
      }
      return topNavArr[currentUserRole];
    }


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
      return iscStateManager.getCurrentStateTranslationKey();
    }


  }//END CLASS


})();

