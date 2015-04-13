(function(){
  'use strict';

  angular.module('iscInfoPages', [])
    .config( ['$stateProvider', '$urlRouterProvider', function( $stateProvider, $urlRouterProvider ){

      // ----------------------------
      // state management
      // ----------------------------

      $stateProvider

        .state('index.info', {
          url: 'info',
          templateUrl: 'infoPages/iscInfoPages.html',
          controller: 'iscInfoPagesController as infoCtrl',

          resolve: {
            loadConfig: function(  $log, iscCustomConfigService ){
              //$log.debug( 'iscInfoPages.loadConfig');
              iscCustomConfigService.loadConfig();
            },

            loadSecondaryNav: function( $log, loadConfig, iscCustomConfigService, iscNavContainerModel ){
              iscNavContainerModel.setSecondaryNav( [] );
              iscNavContainerModel.setSecondaryNavTasks( [] );
              return true;
            },

            loadData: function( $log, loadConfig, iscGeneralInfoApi ){
              return iscGeneralInfoApi.get();
            },

            model: function( $log, loadData, iscInfoPagesModel ){
              return iscInfoPagesModel.setData( loadData );
            }
          }
        })

        .state('index.info.legal', {
          url: '/legal',
          templateUrl: 'infoPages/iscLegal.html',
          controller: 'iscInfoPagesController as infoCtrl'
        })

        .state('index.info.terms', {
          url: '/terms',
          templateUrl: 'infoPages/iscTerms.html',
          controller: 'iscInfoPagesController as infoCtrl'
        })

        .state('index.info.hsInfo', {
          url: '/hsInfo',
          templateUrl: 'infoPages/iscHsInfo.html',
          controller: 'iscInfoPagesController as infoCtrl'
        })

        .state('index.info.forgot', {
          url: '/forgot',
          templateUrl: 'infoPages/iscForgotUserNameOrPassword.html',
          controller: 'iscInfoPagesController as infoCtrl'
        })

        .state('index.info.activate', {
          url: '/activate',
          templateUrl: 'infoPages/iscActivateAccount.html',
          controller: 'iscInfoPagesController as infoCtrl'
        })

        .state('index.info.termsAndConditions', {
          url: '/termsAndConditions',
          templateUrl: 'infoPages/iscTermsAndConditions.html',
          controller: 'iscInfoPagesController as infoCtrl'
        })

        .state('index.info.enroll', {
          url: '/enroll',
          templateUrl: 'infoPages/iscEnrollForm.html',
          controller: 'iscInfoPagesController as infoCtrl'
        })

    }])
  ;
})();

