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
    devlog.log = function() { var args = devlog._prefix_args(arguments); $log.log.apply(this, args); devlog._clear_channel_prefix(); };
    devlog.info = function() { var args = devlog._prefix_args(arguments); $log.info.apply(this, args); devlog._clear_channel_prefix(); };
    devlog.warn = function() { var args = devlog._prefix_args(arguments); $log.warn.apply(this, args); devlog._clear_channel_prefix(); };
    devlog.error = function() { var args = devlog._prefix_args(arguments); $log.error.apply(this, args); devlog._clear_channel_prefix(); };
    devlog.debug = function() { var args = devlog._prefix_args(arguments); $log.debug.apply(this, args); devlog._clear_channel_prefix(); };
    devlog.trace = function() { console.trace(); };

    // null interface for channels that fail 
    var nullobj = {}
    nullobj.log = function() {};
    nullobj.info = function() {};
    nullobj.warn = function() {};
    nullobj.error = function() {};
    nullobj.debug = function() {};
    nullobj.trace = function() {};

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
      //means send it directly through without prefixing
      if (!args.length) {
        return devlog;
      }


      //whittle channels down to approved ones
      //if any, send through with prefixing
      //otherwise suppress
      var approved = [];
      for(var i = 0; i < args.length; i++) {
        if ( whitelist.indexOf( args[i] ) >= 0 ) {
          approved.push(args[i]);
        } else if( whitelist.indexOf("*") >= 0 && whitelist.indexOf("!" + args[i]) < 0) {
          approved.push(args[i]);
        }
      }
      if(approved.length > 0) {
        devlog._set_channel_prefix(approved);
        return devlog;
      }

      return nullobj;
      
    };

    devlog._channel_prefix = "";

    devlog._set_channel_prefix = function(chans) {
      devlog._channel_prefix = "|" + chans.join('|') + "| ";
      devlog._channel_prefix = devlog._channel_prefix.toUpperCase();
    };
    devlog._clear_channel_prefix = function() {
      devlog._channel_prefix = "";
    };
    devlog._prefix_args = function(msg_params) {
      //msg_params is of type Arguments from function
      var args = Array.prototype.slice.call(msg_params);
      if (args[0] && (typeof args[0] === 'string' || args[0] instanceof String)) {
        args[0] = devlog._channel_prefix + args[0]; 
      } else {
        args.unshift(devlog._channel_prefix);
      }
      return args;
    };

    return devlog;

  }

  var module = angular.module( 'isc.common' );
  module.factory('devlog', devlog);

})();

