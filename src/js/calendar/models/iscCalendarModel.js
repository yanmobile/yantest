/**
 * Created by douglasgoodman on 11/18/14.
 */

(function(){
  'use strict';

  iscCalendarModel.$inject = [ '$log'];

  function iscCalendarModel( $log ){
//    $log.debug( 'iscCalendarModel LOADED');

    // ----------------------------
    // vars
    // ----------------------------
    var calendarEvents;
    var calendarEventSources;

    // ----------------------------
    // class factory
    // ----------------------------
    var model = {
      getCalendarEvents: getCalendarEvents,
      setCalendarEvents: setCalendarEvents,
      getCalendarEventSources: getCalendarEventSources,
      setCalendarEventSources: setCalendarEventSources
    };

    return model;

    // ----------------------------
    // functions
    // ----------------------------

    function getCalendarEvents() {
      return calendarEvents;
    }

    /*
    sample date object consumed by calendar
     {
       type:'party',
       title: 'Lunch',
       start: new Date(y, m, d++, 12, 0),
       end: new Date(y, m, d++, 14, 0),
       allDay: false
     };
     */
    function setCalendarEvents( val ) {
      //$log.debug( 'iscCalendarModel.setCalendarEvents', JSON.stringify( val ) );

      calendarEvents = [];
      if( val.Events ){
        _.forEach(val.Events, function (item) {
          calendarEvents.push(
            {
              title: item.Title,
              start: item.Date,
              type: item.Notice,
              allDay: true
            });
        });
      }

      setCalendarEventSources( [calendarEvents] );
    }

    // ------------------
    function getCalendarEventSources(){
      return calendarEventSources;
    }

    function setCalendarEventSources( val ){
      calendarEventSources = val;
    }


  }// END CLASS

  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'iscCalendar' )
    .factory( 'iscCalendarModel', iscCalendarModel );

})();
