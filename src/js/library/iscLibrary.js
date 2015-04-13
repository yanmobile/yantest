(function(){
  'use strict';

  angular.module('iscLibrary', [])
    .config( ['$stateProvider', '$urlRouterProvider', function( $stateProvider, $urlRouterProvider ){

      $urlRouterProvider.when( '/library', '/library/heathDictionary');

      // ----------------------------
      // state management
      // ----------------------------
      $stateProvider
        .state('index.library', {
          url: 'library',
          templateUrl: 'library/iscLibrary.html',
          controller: 'iscLibraryController as libCtrl',

          resolve: {
            loadConfig: function(  $log, iscCustomConfigService ) {
              //$log.debug( 'iscLibrary.loadConfig');
              return iscCustomConfigService.loadConfig();
            },

            loadSecondaryNav: function( $log, loadConfig, iscCustomConfigService, iscNavContainerModel ){
              var secondary = _.toArray( iscCustomConfigService.getLibrarySecondaryNav() );
              iscNavContainerModel.setSecondaryNav( secondary );
              iscNavContainerModel.setSecondaryNavTasks( [] );
              return true;
            }
          }
        })

        .state('index.library.forms', {
          url: '/forms',
          templateUrl: 'library/iscLibraryForms.html',
          controller: 'iscLibraryController as libCtrl',

          resolve: {
            loadForms: function( loadConfig, iscLibraryFormsApi ){
              return iscLibraryFormsApi.get();
            }
          }
        })

        .state('index.library.healthDictionary', {
          url: '/heathDictionary',
          templateUrl: 'library/iscLibraryHealthDictionary.html',
          controller: 'iscLibraryController as libCtrl'
        })

        .state('index.library.news', {
          url: '/news',
          templateUrl: 'library/iscLibraryNews.html',
          controller: 'iscLibraryController as libCtrl',

          resolve: {
            loadNews: function (loadConfig, iscLibraryNewsApi) {
              return iscLibraryNewsApi.get();
            }
          }
        }) ;

    }])

    .run( function( $log, $rootScope, iscCustomConfigHelper, iscLibraryModel ){
      // stateChange success
      $rootScope.$on('$stateChangeSuccess',
        function( event, toState, toParams, fromState, fromParams ){
          //$log.debug( 'iscLibrary.$stateChangeSuccess');
          var stateName  = toState.name;
          if( stateName.indexOf( 'library' ) === -1 ) return;

          // used to set the name of the current state
          // on the secondary nav for small screens
          iscLibraryModel.currentState.key = iscCustomConfigHelper.getTranslationKeyFromName( stateName );
        });
    })
  ;
})();

