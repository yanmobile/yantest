(function(){

  'use strict';

  iscCalendarController.$inject = [ '$log', 'iscCalendarModel' ];

  function iscCalendarController( $log, iscCalendarModel ){
//    $log.debug( 'iscCalendarController LOADED');

    // ----------------------
    // vars
    // ----------------------

    var self = this;

    self.calendarEventSources = iscCalendarModel.getCalendarEventSources();

    // ----------------------
    // functions
    // ----------------------

  } // END CLASS

  // ----------------------
  // inject
  // ----------------------

  angular.module('iscCalendar')
      .controller('iscCalendarController', iscCalendarController );

})();
