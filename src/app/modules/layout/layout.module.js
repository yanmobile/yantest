/**
 * Created by  on 2/8/2016, 8:57:49 AM.
 */

(function () {
  'use strict';

  angular
    .module('layout', ['ui.router', 'isc.common'])
    .config(function (iscStateProvider) {
      iscStateProvider.state(getStates());
    });

  /*========================================
   =                 states                =
   ========================================*/
  function getStates() {
    return {
      'authenticated'    : {
        abstract   : true,
        url        : '/',
        state      : 'authenticated',
        resolve    : {
          /* @ngInject */
          authenticated: function ($q, iscSessionModel) {
            var deferred = $q.defer();
            if (iscSessionModel.isAuthenticated()) {
              deferred.resolve();
            } else {
              deferred.reject({ from: 'authenticated.resolve', error: 'User is not authenticated' });
            }
            return deferred.promise;
          },
          /* @ngInject */
          initFunctions: function (iscStateInit, iscNavContainerModel) {
            return iscStateInit.run().then(function (resolves) {
              iscNavContainerModel.setVersionInfo(resolves.versionInfo);
            });
          }
        },
        templateUrl: 'layout/authenticated.html',
        controller : 'layoutController as layoutCtrl'
      },
      'unauthenticated': {
        abstract   : true,
        url        : '/',
        state      : 'unauthenticated',
        templateUrl: 'layout/unauthenticated.html',
        controller : 'layoutController as layoutCtrl'
      }
    };
  }
})();
