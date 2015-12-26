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
    'isc.progressLoader',
    'isc.authentication',
    'isc.states'])
    .config(function ($stateProvider, iscCustomConfigServiceProvider) {

      iscCustomConfigServiceProvider.addRoutePermissions({
        'index': ['*']
      });
      
      // ----------------------------
      // state management
      // ----------------------------
      $stateProvider
        .state('index', {
          abstract: true,
          url     : '/',

          views: {
            '@': {
              templateUrl: 'navContainer/iscNavContainer.html',
              controller : 'iscNavigationController as navCtrl'
            }
          }
        });

    });
})();
