/**
 * Created by douglasgoodman on 11/18/14.
 *
 * this is for a group of items with a $$selected property
 * the iscRadio directive handles this functionality internally
 * but if you need to call it in an outside function, this can be used
 */

(function () {
  'use strict';

  // ----------------------------
  // injection
  // ----------------------------
  angular.module('isc.directives')
    .factory('iscRadioGroupHelper', iscRadioGroupHelper);

  /* @ngInject */
  function iscRadioGroupHelper(devlog) {//jshint ignore:line
    devlog.channel('iscRadioGroupHelper').debug('iscRadioGroupHelper LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------
    var service = {
      radioSelect: radioSelect
    };

    return service;

    // ----------------------------
    // functions
    // ----------------------------

    function radioSelect(selectedItem, radioGroup) {
      devlog.channel('iscRadioGroupHelper').debug('iscRadioGroupHelper.radioSelect');
      devlog.channel('iscRadioGroupHelper').debug('...selectedItem', selectedItem);
      devlog.channel('iscRadioGroupHelper').debug('...radioGroup', radioGroup);

      var currentState = !!selectedItem.$$selected;
      radioGroup.forEach(function (item) {
        item.$$selected = false;
      });

      selectedItem.$$selected = !currentState;
    }

  }// END CLASS


})();
