/**
 * Created by douglasgoodman on 11/19/14.
 */

( function() {
  'use strict';

  angular
    .module( 'isc.core' )
    .factory( 'iscUiHelper', iscUiHelper );

  function iscUiHelper( devlog ) {//jshint ignore:line
    var channel = devlog.channel( 'iscUiHelper' );
    channel.logFn( 'iscUiHelper' );

    // ----------------------------
    // class factory
    // ----------------------------
    var service = {
      setTabActiveState: setTabActiveState
    };

    return service;

    function setTabActiveState( state, allTabs ) {
      channel.logFn( 'setTabActiveState' );
      channel.debug( '...allTabs', allTabs );
      _.forEach( allTabs, function( tab ) {
        if ( _.includes( state, tab.state ) ) {
          tab.active = true;
        } else {
          tab.active = false;
        }
      } );
    }

  }// END CLASS

} )();
