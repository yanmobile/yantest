/**
 * Created by douglas goodman on 3/9/15.
 */

(function () {
  'use strict';

  // ----------------------------
  // injection
  // ----------------------------

  angular.module('isc.states')
    .factory('iscStateManager', iscStateManager);

  /* @ngInject */
  function iscStateManager(devlog, $state, iscCustomConfigHelper) {
    devlog.channel('iscStateManager').debug('iscStateManager.LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // when you select a mail message from, say, the inbox
    // we want the subnav for inbox to still be highlighted
    var parentSref = '';


    // ----------------------------
    // class factory
    // ----------------------------
    var service = {
      setParentSref                : setParentSref,
      getCurrentStateTranslationKey: getCurrentStateTranslationKey,
    };

    return service;

    // ----------------------------
    // functions
    // ----------------------------

    function setParentSref(val) {
      parentSref = val;
    }

    function getCurrentStateTranslationKey() {
      devlog.channel('iscStateManager').debug('iscStateManager.getCurrentStateTranslationKey: ' + stateName);
      if (parentSref) {
        return iscCustomConfigHelper.getTranslationKeyFromName(parentSref);
      } else {
        var stateName = $state.$current.name;

        return iscCustomConfigHelper.getTranslationKeyFromName(stateName);
      }
    }

  }//END CLASS


})();

