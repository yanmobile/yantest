(function(){
  'use strict';

  angular.module('iscWellness', [])
      .config( function( $stateProvider ){

        // ----------------------------
        // state management
        // ----------------------------
        $stateProvider
            .state('index.wellness', {
              url: 'wellness',
              templateUrl: 'wellness/iscWellness.html',
              controller: 'iscWellnessController as wellCtrl',

              resolve: {
                loadConfig: function(  $log, iscCustomConfigService ){
                  //$log.debug( 'iscWellness.loadConfig');
                  iscCustomConfigService.loadConfig();
                },

                loadSecondaryNav: function( $log, loadConfig, iscCustomConfigService, iscNavContainerModel ){
                  iscNavContainerModel.setSecondaryNav( [] );
                  iscNavContainerModel.setSecondaryNavTasks( [] );
                  return true;
                },

                wellness: function( loadConfig, iscWellnessDataApi ){
                  return iscWellnessDataApi.get();
                },

                model:function( $log, iscWellnessModel, wellness) {
                  //$log.debug('iscWellness.resolve modell' + wellness );
                  iscWellnessModel.setWellnessTiles(wellness);
                }
              }
            });

      })
  ;
})();

