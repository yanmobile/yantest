/**
 * Created by hzou on 1/2/16.
 */

/**
 * Usage:     $http.get('/api/patient/34561385', { showLoader: true });


 */
(function () {
  'use strict';

  angular
    .module('isc.spinner')
    .factory('iscSpinnerModel', iscSpinnerModel);


  function iscSpinnerModel(devlog) {
    devlog.channel('iscSpinnerModel').debug('inside iscSpinnerModel');
    var pendingReqs = {};
    var factory     = {
      addPendingReq     : addPendingReq,
      subtractPendingReq: subtractPendingReq,
      getPendingReqs    : getPendingReqs
    };
    return factory;

    function addPendingReq(url) {
      devlog.channel('iscSpinnerModel').debug('adding url', url);
      pendingReqs[url] = true;
    }

    function subtractPendingReq(url) {
      devlog.channel('iscSpinnerModel').debug('removing url', url);
      delete pendingReqs[url];
    }

    function getPendingReqs() {
      return _.keys(pendingReqs).length;
    }
  }

})();

