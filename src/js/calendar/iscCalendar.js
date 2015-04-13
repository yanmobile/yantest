(function(){
  'use strict';

  angular.module('iscCalendar', [] )
    .config( function( $stateProvider ){

      // ----------------------------
      // state management
      // ----------------------------
      $stateProvider
        .state('index.calendar', {
          url: 'calendar',
          templateUrl: 'calendar/iscCalendar.html',
          controller: 'iscCalendarController as calCtrl',

          resolve: {
            loadConfig: function( $log, iscCustomConfigService ){
              //$log.debug( 'iscCalendar.loadConfig');
              return iscCustomConfigService.loadConfig();
            },

            loadSecondaryNav: function( $log, loadConfig, iscCustomConfigService, iscNavContainerModel ){
              iscNavContainerModel.setSecondaryNav( [] );
              iscNavContainerModel.setSecondaryNavTasks( [] );
              return true;
            },

            events: function( $log, loadConfig, iscCalendarDataApi ){
              //$log.debug( 'iscCalendar.events');
              return iscCalendarDataApi.events();
            },

            model: function( $log, events, iscCalendarModel ){
              //$log.debug( 'iscCalendar.model', events);
              var evts = iscCalendarModel.getCalendarEvents();

              // only update the model if necessary
              if( evts !== events ){
                //$log.debug( '...NEW', events);
                iscCalendarModel.setCalendarEvents( events );
              }
              return evts;
            }
          }
        });
    })
  ;
})();

