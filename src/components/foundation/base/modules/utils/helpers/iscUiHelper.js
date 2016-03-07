/**
 * Created by douglasgoodman on 11/19/14.
 */

(function () {
  'use strict';

  // ----------------------------
  // inject
  // ----------------------------

  angular.module('isc.core')
    .factory('iscUiHelper', iscUiHelper);

  /* @ngInject */
  function iscUiHelper(devlog) {//jshint ignore:line
    devlog.channel('iscUiHelper').debug('iscUiHelper LOADED');

    // ----------------------------
    // class factory
    // ----------------------------

    var service = {
      displayOrder     : displayOrder,
      setTabActiveState: setTabActiveState
    };

    return service;

    // ----------------------------
    // functions
    // ----------------------------

    // ----------------------------
    // all configurations


    // each tab is assumed to have a displayOrder property
    function displayOrder(tab) {
      return tab.displayOrder;
    }

    function setTabActiveState(state, allTabs) {
      devlog.channel('iscUiHelper').debug('iscShared.setTabActiveState');
      devlog.channel('iscUiHelper').debug('...allTabs', allTabs);

      _.forEach(allTabs, function (tab) {
        if (_.contains(state, tab.state)) {
          tab.$$active = true;
        }
        else {
          tab.$$active = false;
        }
      });
    }


  }// END CLASS

})();
