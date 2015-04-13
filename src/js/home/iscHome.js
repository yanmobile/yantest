(function(){
  'use strict';

  angular.module('iscHome',[])

      .config( function( $stateProvider){//, $urlRouterProvider ){

        // ----------------------------
        // state management
        // ----------------------------
        $stateProvider
            .state('index.home', {
              url: 'home',
              templateUrl: 'home/iscHome.html',
              controller: 'iscHomeController as homeCtrl',

              resolve: {
                loadConfig: function(  $log, iscCustomConfigService ){
                  //$log.debug( 'iscHome.loadConfig');
                  return iscCustomConfigService.loadConfig();
                },

                loadSecondaryNav: function( $log, loadConfig, iscCustomConfigService, iscNavContainerModel ){
                  iscNavContainerModel.setSecondaryNav( [] );
                  iscNavContainerModel.setSecondaryNavTasks( [] );
                  return true;
                },

                // pass in loadConfig, as it blocks these from resolving until the configuration is in place
                patientData: function( $log, loadConfig, iscPatientDataApi ) {
                  //$log.debug( 'iscHome.home.patientData' );
                  return iscPatientDataApi.get();
                },

                panelData : function($log, loadConfig,iscHomeDataApi){



                  return iscHomeDataApi.getPanelData();
                },


                model: function( $log, patientData, panelData, iscHomeModel ) {
                      //$log.debug( 'iscHome.home.model: ' + JSON.stringify( patientData ) );

                  iscHomeModel.setPatientData( patientData );
                  iscHomeModel.setPanelData(panelData);


                  return iscHomeModel;
                }
              }
            });
      });
})();

