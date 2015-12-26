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
      isCurrentState               : isCurrentState,
      getCurrentStateTranslationKey: getCurrentStateTranslationKey,
      isInbox                      : isInbox,
      isOutbox                     : isOutbox
    };

    return service;

    // ----------------------------
    // functions
    // ----------------------------

    function isCurrentState(stateName) {
      var retVal = $state.is(stateName) || stateName === parentSref;

      //if( stateName === 'index.messages.inbox'){
      //  devlog.channel('iscStateManager').debug( 'iscStateManager.isCurrentState: ', stateName );
      //  devlog.channel('iscStateManager').debug( '......parentSref: ', parentSref);
      //  devlog.channel('iscStateManager').debug( '.........current: ', $state.$current.name );
      //  devlog.channel('iscStateManager').debug( '..........retVal: ', retVal);
      //}

      return retVal;
    }

    function setParentSref(val) {
      parentSref = val;
    }

    // is a state either inbox or archivedInbox?
    function isInbox(stateName) {
      devlog.channel('iscStateManager').debug('iscStateManager.isInbox: ', stateName);
      return stateName.toLowerCase().indexOf('inbox') > -1;
    }

    // is a state either outbox or archivedOutbox?
    function isOutbox(stateName) {
      devlog.channel('iscStateManager').debug('iscStateManager.isOutbox: ', stateName);
      return stateName.toLowerCase().indexOf('outbox') > -1;
    }

    function getCurrentStateTranslationKey() {
      devlog.channel("iscStateManager").debug('iscStateManager.getCurrentStateTranslationKey: ' + stateName);
      if (parentSref) {
        return iscCustomConfigHelper.getTranslationKeyFromName(parentSref);
      } else {
        var stateName = $state.$current.name;

        return iscCustomConfigHelper.getTranslationKeyFromName(stateName);
      }
    }

  }//END CLASS


})();

