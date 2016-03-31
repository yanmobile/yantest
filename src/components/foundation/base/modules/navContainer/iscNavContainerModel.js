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

  function iscNavContainerModel(devlog, $state, iscCustomConfigService, iscSessionModel) {
    devlog.channel('iscNavContainerModel').debug('iscNavContainerModel LOADED');

    // ----------------------------
    // vars
    // ----------------------------
    var topNavArr = {};
    var secondaryNav;
    var secondaryNavTasks;
    var versionInfo;


    // ----------------------------
    // class factory
    // ----------------------------

    var model = {

      getTopNav: getTopNav,

      getVersionInfo: getVersionInfo,
      setVersionInfo: setVersionInfo,

      navigateToUserLandingPage: navigateToUserLandingPage
    };

    return model;

    // ----------------------------
    // functions
    // ----------------------------

    function navigateToUserLandingPage() {
      var currentUserRole = iscSessionModel.getCurrentUserRole();
      var landingPage     = iscCustomConfigService.getConfigSection('landingPages')[currentUserRole];
      if (!_.isNil(landingPage)) {
        $state.go(landingPage);
      } else {
        devlog.channel('iscNavContainerModel').error('No landing page found for', _.wrapText(currentUserRole), 'role');
      }
    }

    function getTopNav() {
      var currentUserRole = iscSessionModel.getCurrentUserRole();
      if (!topNavArr[currentUserRole]) {
        var topTabs  = iscCustomConfigService.getConfigSection('topTabs');
        var userTabs = _.extend({}, topTabs['*']); // include anonymous tabs
        if (currentUserRole !== '*') {
          _.extend(userTabs, topTabs[currentUserRole]);
        }

        topNavArr[currentUserRole] = _.toArray(userTabs);
      }
      
      return topNavArr[currentUserRole];
    }

    function getVersionInfo() {
      return versionInfo;
    }

    function setVersionInfo(val) {
      versionInfo = val;
    }
  }//END CLASS


})();

