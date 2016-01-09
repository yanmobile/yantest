/**
 * Created by douglasgoodman on 11/19/14.
 */

(function () {
  'use strict';

  // ----------------------------
  // inject
  // ----------------------------

  angular.module('isc.configuration')
    .factory('iscCustomConfigHelper', iscCustomConfigHelper);

  /* @ngInject */
  function iscCustomConfigHelper(devlog) {
    devlog.channel('iscCustomConfigHelper').debug('iscCustomConfigHelper LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    var allStates = {};

    // ----------------------------
    // class factory
    // ----------------------------

    var factory = {
      //addStates   : addStates,
      //resetStates : resetStates,
      //getStateObj : getStateObj,
      //getAllStates: getAllStates,
      //
      //stateIsExcluded: stateIsExcluded,

      getSectionTranslationKeyFromName: getSectionTranslationKeyFromName,
      getTranslationKeyFromName       : getTranslationKeyFromName
    };

    return factory;

    // ----------------------------
    // functions
    // ----------------------------

    // get the translation key from the state name
    function getTranslationKeyFromName(stateName) {
      devlog.channel('iscCustomConfigHelper').debug('iscCustomConfigHelper.getTranslationKeyFromName: ' + stateName);
      var state = allStates[stateName];
      return state ? state.translationKey : 'ISC_NOT_FOUND';
    }

    // get the top level section's translation key from the state name
    function getSectionTranslationKeyFromName(stateName) {
      devlog.channel('iscCustomConfigHelper').debug('iscCustomConfigHelper.getSectionTranslationKeyFromName: ' + stateName);
      var arr     = stateName.split('.');
      var sectArr = arr.splice(0, 2); // the first two values are the section
      var sectionName = sectArr.join('.');

      devlog.channel('iscCustomConfigHelper').debug('...sectArr: ' + sectArr);
      devlog.channel('iscCustomConfigHelper').debug('...sectionName: ' + sectionName);

      var state = allStates[sectionName];

      return state ? state.translationKey : '';
    }

  }// END CLASS

})();
