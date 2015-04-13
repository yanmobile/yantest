/**
 * Created by douglasgoodman on 11/18/14.
 */

(function(){
  'use strict';

  iscCalendarDataApi.$inject = [ '$log', '$q', '$http', 'iscCustomConfigService','iscCalendarModel' ];

  function iscCalendarDataApi( $log, $q, $http, iscCustomConfigService ,iscCalendarModel){

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------

    var api = {
      events: mockEvents
    };

    return api;

    // ----------------------------
    // functions
    // ----------------------------

    function events(){
      //$log.debug( 'iscCalenderDataApi.events' );

      var deferred = $q.defer();

      var calendarEvents = iscCalendarModel.getCalendarEvents();
      //$log.debug( '...calendarEvents',calendarEvents );

      if( !calendarEvents ){
        //$log.debug( '...getting');
        var url = iscCustomConfigService.getBaseUrl() + 'calendar/events';

        var data = {
          "Format": "events",
          "MaxEvents": 20
        };

        var req = {
          method: 'POST',
          url: url,
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials:true,
          data: data
        };

        $http( req )
          .success( function( data, status, headers, config  ){
            $log.debug( '...events', JSON.stringify(data) );
            deferred.resolve( data );
          })
          .error( function( data, status, headers, config  ){
            //$log.debug( '...err', data );
            deferred.reject( data );
          });

      }
      else {
        //$log.debug( '...returning existing');
        deferred.resolve( calendarEvents );
      }

      return deferred.promise;
    }

    // ----------------------------
    // mocks
    // ----------------------------

    function mockEvents(){
      //$log.debug( 'iscCalenderDataApi.mockEvents');

      var deferred = $q.defer();

      $http.get( 'assets/mockData/calendar/calendar.json' )

        .success( function( result ){
          deferred.resolve( result );
        })

        .error( function( error ){
          //$log.debug( 'iscCalenderDataApi.ERROR');
          deferred.reject( error );
        });

      return deferred.promise;
    }

  }// END CLASS

  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'iscCalendar' )
    .factory( 'iscCalendarDataApi', iscCalendarDataApi );

})();
