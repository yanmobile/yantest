(function(){
  'use strict';

  angular.module('iscLogin', [])

    .config( function( $stateProvider ){

      // ----------------------------
      // state management
      // ----------------------------
      $stateProvider
        .state('index.login', {
          url: 'login',
          templateUrl: 'login/iscLoginForm.html',
          controller: 'iscLoginController as loginCtrl',

          resolve: {
            loadConfig: function(  $log, iscCustomConfigService ){
              //$log.debug( 'iscLogin.loadConfig');
              return iscCustomConfigService.loadConfig();
            },

            loadSecondaryNav: function( $log, loadConfig, iscCustomConfigService, iscNavContainerModel ){
              iscNavContainerModel.setSecondaryNav( [] );
              iscNavContainerModel.setSecondaryNavTasks( [] );
              return true;
            }
          }
        });

    })
  ;
})();

