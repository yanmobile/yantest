/**
 * Created by Ryan Jarvis on 5/20/2015.
 */
( function() {
  'use strict';

  devlog.$inject = [
    '$log',
    'iscCustomConfigService'
  ];

  function devlog( $log, iscCustomConfigService ) {
    var devlog = {};

    // make devlog function as an extension of angular $log
    // bruteforce approach
    devlog.log = function() { $log.log.apply(this, arguments); };
    devlog.info = function() { $log.info.apply(this, arguments); };
    devlog.warn = function() { $log.warn.apply(this, arguments); };
    devlog.error = function() { $log.error.apply(this, arguments); };
    devlog.debug = function() { $log.debug.apply(this, arguments); };

    // null interface for channels that fail 
    var nullobj = {}
    nullobj.log = function() {};
    nullobj.info = function() {};
    nullobj.warn = function() {};
    nullobj.error = function() {};
    nullobj.debug = function() {};

    //channel acts as a filter for log messages by
    //either passing them directly to $log interface if whitelisted
    //or piping them to null interface if not
    //
    //we support any number of channels specified
    //as a list of variable arguments
    devlog.channel = function() {
      //not recommended to slice on arguments directly
      //prevents optimizations in JS engines
      var args = [];
      for(var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }

      var config = iscCustomConfigService.getConfig();
      if(!config) {
        $log.debug("WARNING No config in application, suppressing call to devlog");
        console.trace();
        return nullobj;
      }
      var whitelist = config.devlogWhitelist;

      //no whitelist present
      //means suppress
      if( !whitelist ) {
        return nullobj;
      }

      //no channel specified
      //or wildcard in whitelist
      //means send it directly through
      if (
        !args.length
        || (whitelist.indexOf("*") >= 0)
      ) {
        return devlog;
      }

      //if any channel specified appears in whitelist, send it through
      for(var i = 0; i < args.length; i++) {
        if( whitelist.indexOf( args[i] ) >= 0 ) {
          return devlog;
        }
      }

      return nullobj;
      
    };

    return devlog;

  }

  var module = angular.module( 'isc.common' );
  module.factory('devlog', devlog);

})();

