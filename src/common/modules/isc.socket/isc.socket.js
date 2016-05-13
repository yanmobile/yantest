/**
 * Created by hzou on 12/28/15.
 */

//SRC LINK: http://www.html5rocks.com/en/tutorials/frameworks/angular-websockets/
//$evalAsync vs $apply: http://www.bennadel.com/blog/2605-scope-evalasync-vs-timeout-in-angularjs.htm

(function() {
  'use strict';

  angular
    .module( 'isc.socket' )
    .factory( 'socket', socket );

  function socket( devlog, $rootScope ) {
    var channel = devlog.channel( 'socket' );
    channel.debug( 'socket LOADED' );
    var socket;
    return {
      connect: connect,
      on     : on,
      emit   : emit
    };

    function connect( uri ) {
      socket = io.connect( uri, { 'forceNew': true } );
    }

    function on( eventName, callback ) {
      channel.debug( 'on called' );
      socket.on( eventName, function() {
        var args = arguments;
        $rootScope.$evalAsync(function() {
          callback.apply( socket, args );
        } );
      } );
    }

    function emit( eventName, data, callback ) {
      channel.debug( 'emit called' );
      socket.emit( eventName, data, function() {
        var args = arguments;
        $rootScope.$evalAsync(function() {
          if ( callback ) {
            callback.apply( socket, args );
          }
        } );
      } );
    }
  }
} )();
