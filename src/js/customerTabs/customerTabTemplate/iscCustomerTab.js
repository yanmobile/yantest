(function(){
  'use strict';

  angular.module('iscCustomerTab', [])
    .config( ['$stateProvider', '$urlRouterProvider', function( $stateProvider, $urlRouterProvider ){

      $urlRouterProvider.when('/customerTab', '/customerTab/tab1');

      // ----------------------------
      // state management
      // ----------------------------
      $stateProvider
        .state('index.customerTab', {
          url: 'customerTab',
          templateUrl: 'customerTabs/customerTabTemplate/iscCustomerTab.html',
          controller: 'iscCustomerTabController as customerTabCtrl',

          resolve: {
            loadConfig: function(  $log, iscCustomConfigService ){
              //$log.debug( 'iscCustomerTab.loadConfig');
              iscCustomConfigService.loadConfig();
            },

            loadSecondaryNav: function( $log, loadConfig, iscCustomConfigService, iscNavContainerModel ){
              iscNavContainerModel.setSecondaryNav( [] );
              iscNavContainerModel.setSecondaryNavTasks( [] );
              return true;
            },

            data: function( iscCustomerTabApi ){
              return iscCustomerTabApi.get();
            },

            model: function( data, iscCustomerTabModel ){
              iscCustomerTabModel.setData( data );
            }
          }
        })

        .state('index.customerTab.tab1', {
          url: '/tab1',
          templateUrl: 'customerTabs/customerTabTemplate/iscCustomerTab1.html',
          controller: 'iscCustomerTabController as customerTabCtrl'
        })

        .state('index.customerTab.tab2', {
          url: '/tab2',
          templateUrl: 'customerTabs/customerTabTemplate/iscCustomerTab2.html',
          controller: 'iscCustomerTabController as customerTabCtrl'
        });

    }]);
})();

