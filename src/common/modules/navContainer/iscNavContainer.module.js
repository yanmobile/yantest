/**
 * Created by douglasgoodman on 11/24/14.
 */

(function () {
  'use strict';

  angular.module('iscNavContainer', ['ui.router',
    'pascalprecht.translate',
    'isc.configuration',
    'isc.core',
    'isc.animation',
    'isc.authentication',
    'isc.states'])
    .config(config);

  function config($stateProvider) {
    // ----------------------------
    // state management
    // ----------------------------
    $stateProvider
      .state('index', {
        abstract: true,
        url     : '/',
        resolve : {
          initFunctions: function (iscStateInit, iscNavContainerModel) {
            return iscStateInit.run().then(function (resolves) {
              iscNavContainerModel.setVersionInfo(resolves.versionInfo);
            });
          }
        },

        views: {
          '@': {
            templateUrl: 'navContainer/iscNavContainer.html',
            controller : 'iscNavigationController as navCtrl'
          }
        }
      });
  }
})();
