(function(){
  'use strict';

  angular.module('iscMyAccount', [])
    .config( ['$stateProvider', '$urlRouterProvider', function( $stateProvider, $urlRouterProvider ){

      // ----------------------------
      // state management
      // ----------------------------
      $urlRouterProvider.when('/myAccount', '/myAccount/summary');

      $stateProvider
        .state('index.myAccount', {
          url: 'myAccount',
          templateUrl: 'myAccount/iscMyAccount.html',
          controller: 'iscMyAccountController as myAcctCtrl',

          resolve: {
            loadConfig: function(  $log, iscCustomConfigService ){
              //$log.debug( 'iscMyAccount.loadConfig');
              return iscCustomConfigService.loadConfig();
            },

            loadSecondaryNav: function( $log, loadConfig, iscCustomConfigService, iscNavContainerModel ){
              var secondary = _.toArray( iscCustomConfigService.getMyAccountSecondaryNav() );
              iscNavContainerModel.setSecondaryNav( secondary );
              iscNavContainerModel.setSecondaryNavTasks( [] );
              return true;
            }
          }
        })

        .state('index.myAccount.summary', {
          url: '/summary',
          templateUrl: 'myAccount/iscMyAccountSummary.html',
          controller: 'iscMyAccountController as myAcctCtrl',

          resolve: {
            accountSummary: function( $log, iscMyAccountDataApi ){
              //$log.debug( 'iscMyAccount.accountSummary');
              return iscMyAccountDataApi.getSummary();
            },

            model: function( $log, accountSummary, iscMyAccountModel ){
              //$log.debug( 'iscMyAccount.model');

                iscMyAccountModel.setAccountSummary( accountSummary );


              return accountSummary;
            }
          }


        })

        .state('index.myAccount.history', {
          url: '/history',
          templateUrl: 'myAccount/iscMyAccountHistory.html',
          controller: 'iscMyAccountController as myAcctCtrl',

          resolve: {
            history: function( $log, iscMyAccountDataApi ){
              //$log.debug( 'iscMyAccount.history');
              return iscMyAccountDataApi.getHistory();
            },

            model: function( $log, history, iscMyAccountModel ){
              //$log.debug( 'iscMyAccount.model');
              var currentHistory = iscMyAccountModel.getHistory();
              if( currentHistory !== history ){
                iscMyAccountModel.setHistory( history );
              }

              return history;
            }
          }
        })

        .state('index.myAccount.password', {
          url: '/password',
          templateUrl: 'myAccount/iscMyAccountPassword.html',
          controller: 'iscMyAccountController as myAcctCtrl'
        })

        .state('index.myAccount.email', {
          url: '/email',
          templateUrl: 'myAccount/iscMyAccountEmail.html',
          controller: 'iscMyAccountController as myAcctCtrl'
        })

        .state('index.myAccount.proxies', {
          url: '/proxies',
          templateUrl: 'myAccount/iscMyAccountProxies.html',
          controller: 'iscMyAccountController as myAcctCtrl',
          resolve: {
            proxies: function( $log, iscMyAccountDataApi ){
              //$log.debug( 'iscMyAccount.proxies');
              return iscMyAccountDataApi.getProxies();
            },

            model: function( $log, proxies, iscMyAccountModel ){
              //$log.debug( 'iscMyAccount.model');

              iscMyAccountModel.setAccountProxies( proxies );


              return proxies;
            }
          }
        });

    }])
  ;
})();

