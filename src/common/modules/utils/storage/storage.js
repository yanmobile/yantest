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
      devlog.channel('storage').log('get...');
      devlog.channel('storage').log("storageKey", storageKey, "entityPath", entityPath);
      var val;
      if (entityPath == null) { //if no entityPath is supplied (only 1 parameter)
        val = getFromStorage(storageKey);
      } else {
        val = getFromStorage(storageKey);
        val = _.get(val, entityPath);  //get nested object
      }

      return val;
    }

    function set(storageKey, entityPath, value) {
      devlog.channel('storage').log('set...');
      devlog.channel('storage').log("storageKey", storageKey, "entityPath", entityPath, "value", value);

      if (value == null) {
        value = entityPath;
        saveToStorage(storageKey, value);
      } else {
        var savedObj = getFromStorage(storageKey, entityPath) || {};
        _.set(savedObj, entityPath, value);
        saveToStorage(storageKey, savedObj);
      }
    }

    function remove(storageKey) {
      devlog.channel('storage').log('remove...');
      devlog.channel('storage').log("storageKey", storageKey);
      removeFromStorage(storageKey);
    }

    /*========================================
     =                 private   =             =
     =======================================*/
    function getFromStorage(storageKey) {
      var rawVal = $window.localStorage.getItem(storageKey);
      var value;
      try {
        value = rawVal != null ? JSON.parse(rawVal) : null;
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