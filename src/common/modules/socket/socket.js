/**
 * Created by hzou on 12/28/15.
 */

//SRC LINK: http://www.html5rocks.com/en/tutorials/frameworks/angular-websockets/

(function () {
  'use strict';

  angular
    .module('isc.socket')
    .factory('socket', socket);

  function socket(devlog, $rootScope) {
    devlog.channel('socket').debug('socket LOADED');
    var socket;
    return {
      connect: connect,
      on     : on,
      emit   : emit
    };

    function connect(uri) {
      socket = io.connect(uri, { 'forceNew': true });
    }

    function on(eventName, callback) {
      devlog.channel('socket').debug('on called');
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    }

    function emit(eventName, data, callback) {
      devlog.channel('socket').debug('emit called');
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  }
})();
