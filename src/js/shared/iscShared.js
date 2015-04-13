/**
 * Created by douglasgoodman on 12/22/14.
 */
(function(){
  'use strict';

  angular.module('iscShared', [] )
      .config( ['$stateProvider', '$urlRouterProvider',
        function( $stateProvider, $urlRouterProvider ){


          // ----------------------------
          // state management
          // NOTE - this is only used to make sure the config is in place
          // ----------------------------
          $stateProvider
              .state('shared', {
                abstract: true,
                url: '/',

                resolve: {
                  loadConfig: function(  $log, iscCustomConfigService ){
                    //$log.debug( 'iscNavContainer.loadConfig');
                    return iscCustomConfigService.loadConfig();
                  }
                }
              });
        }]);
})();

