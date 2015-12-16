/**
 * Created by hzou on 12/13/15.
 */

(function () {

  'use strict';

  angular
    .module('hsHome', ['ui.router'])
    /* @ngInject */
    .config(function ($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.when('', '/home');
      $urlRouterProvider.when('/', '/home');

      // ----------------------------
      // state management
      // ----------------------------
      $stateProvider
        .state('index.home', {
          url        : 'home',
          templateUrl: 'home/hsHome.html',
          controller : 'hsHomeController'
        });
    });
})();
