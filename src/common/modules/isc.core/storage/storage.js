/**
 * Created by hzou on 1/19/16.
 */

//TODO: add encryption config
(function () {
  'use strict';

  angular
    .module('isc.core')
    .factory('storage', storage);

  /*========================================
   =               function                =
   ========================================*/
  function storage($window, devlog) {
    var service = {
      get   : get,
      set   : set,
      remove: remove
    };
    return service;

    ////////////////
    function get(storageKey, entityPath) {
      devlog.channel('storage').debug('get...');
      devlog.channel('storage').debug("storageKey", storageKey, "entityPath", entityPath);
      var val;
      if (_.isNil(entityPath)) { //if no entityPath is supplied (only 1 parameter)
        val = getFromStorage(storageKey);
      } else {
        val = getFromStorage(storageKey);
        val = _.get(val, entityPath);  //get nested object
      }

      return val;
    }

    function set(storageKey, entityPath, value) {
      devlog.channel('storage').debug('set...');
      devlog.channel('storage').debug("storageKey", storageKey, "entityPath", entityPath, "value", value);

      if (_.isNil(value)) {
        value = entityPath;
        saveToStorage(storageKey, value);
      } else {
        var savedObj = getFromStorage(storageKey, entityPath) || {};
        _.set(savedObj, entityPath, value);
        saveToStorage(storageKey, savedObj);
      }
    }

    function remove(storageKey) {
      devlog.channel('storage').debug('remove...');
      devlog.channel('storage').debug("storageKey", storageKey);
      removeFromStorage(storageKey);
    }

    /*========================================
     =                 private   =             =
     =======================================*/
    function getFromStorage(storageKey) {
      var rawVal = $window.localStorage.getItem(storageKey);
      var value;
      try {
        value = _.isNil(rawVal) ? null : JSON.parse(rawVal);
      } catch ( ex ) {
        value = null;
      }

      return value;
    }

    function saveToStorage(storageKey, value) {
      var stringified = JSON.stringify(value);
      $window.localStorage.setItem(storageKey, stringified);
    }

    function removeFromStorage(storageKey) {
      $window.localStorage.removeItem(storageKey);
    }
  }

})();