/**
 * Created by Henry Zou on 1/8/2016
 */

/**
 * This is a lodash proxy filter for invoking lodash methods
 */

(function () {
  'use strict';
  // ----------------------------
  // injection
  // ----------------------------
  angular.module('isc.filters')
    .filter('lodash', lodash);

  function lodash() {

    return function (value, lodashFunc) {
      var retVal = value;
      if (value) {
        var args = _.toArray(arguments);
        args.splice(1, 1); //remove lodashFunc;
        var func = _[lodashFunc];
        if (_.isFunction(func)) {
          retVal = func.apply(func, args);
        }
      }

      return retVal;
    };

  }//END CLASS

})();
