/**
 * Created by probbins on 3/6/2017, 10:41:15 AM.
 */

( function() {
  'use strict';

  angular
    .module( 'isc.datepicker' )
    .directive( 'iscDatepickerShim', iscDatepickerShim );

  function iscDatepickerShim( devlog, $timeout ) {

    var log = devlog.channel( 'iscDatepickerShim' );
    log.logFn( 'LOADED' );

    var directive = {
      restrict: 'A',
      link    : link
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------
    function link( scope, elem, attrs ) {
      var input = elem[0];

      // angular-moment-picker assumes jQuery is not present and has keyboard events that return false.
      // In non-jQuery events, this does not stop the event from bubbling but when jQuery is present, it does.
      // So we need to unbind the moment picker's keydown event and invoke it but always return true.
      // See http://stackoverflow.com/questions/1357118/event-preventdefault-vs-return-false
      $timeout( function() {
        // Get moment-picker keydown event
        var elementData = $.hasData( input ) && $._data( input ),
            origKeydown = _.get( elementData, 'events.keydown[0].handler', _.noop );

        // Wrap it so it always returns true
        elem.off( 'keydown' );
        elem.on( 'keydown', function( event ) {
          origKeydown( event );
          return true;
        } );
      }, 100 );

    }

  }//END CLASS

} )();
