/**
 * Created by hzou on 12/13/15.
 */

(function () {

  'use strict';

  angular
    .module('home', ['ui.router'])
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
          templateUrl: 'home/home.html',
          controller : 'homeController'
        });
    });
})();
