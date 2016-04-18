/**
 * Created by hzou on 1/19/16.
 */

(function () {
  'use strict';

  angular
    .module('isc.core')
    .factory('storage', storage);

  /*========================================
   =               function                =
   ========================================*/
  function storage($window, devlog) {
    var channel = devlog.channel('storage');
    var service = {
      clear: clear,
      get: get,
      remove: remove,
      set: set
    };
    return service;

    ////////////////
    function get(storageKey, entityPath) {
      channel.logFn('get');
      channel.debug("storageKey", storageKey, "entityPath", entityPath);
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
      channel.logFn('set');
      channel.debug("storageKey", storageKey, "entityPath", entityPath, "value", value);

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
      channel.logFn('remove');
      channel.debug("storageKey", storageKey);
      removeFromStorage(storageKey);
    }

    function clear() {
      channel.logFn('clear');
      $window.localStorage.clear();
    }

    /*========================================
     =                 private   =             =
     =======================================*/
    function getFromStorage(storageKey) {
      channel.logFn('getFromStorage');
      var rawVal = $window.localStorage.getItem(storageKey);
      var value;
      try {
        value = _.isNil(rawVal) ? undefined : JSON.parse(rawVal);
      } catch (ex) {
        value = undefined;
      }

      return value;
    }

    function saveToStorage(storageKey, value) {
      channel.logFn('saveToStorage');
      var stringified = JSON.stringify(value);
      $window.localStorage.setItem(storageKey, stringified);
    }

    function removeFromStorage(storageKey) {
      channel.logFn('removeFromStorage');
      $window.localStorage.removeItem(storageKey);
    }
  }

})();