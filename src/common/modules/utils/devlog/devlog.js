/**
 * Created by Ryan Jarvis on 5/20/2015.
 */
(function () {
  'use strict';

  angular
    .module('isc.core')
    .provider('devlog', function () {
      var config;
      return {
        loadConfig: function loadConfig(configObj) {
          config = configObj;
        },
        $get      : devlogService
      };

      /* @ngInject */
      function devlogService($log) {
        var devlog = {};

        // make devlog function as an extension of angular $log
        ['log', 'info', 'warn', 'error', 'debug'].forEach(function (method) {
          devlog[method] = function () {
            var args = devlog.prefixArgs(arguments);
            $log[method].apply($log, args);
            devlog.clearChannelPrefix();
          };
        });
        devlog.trace = function () { console.trace(); };

        // null interface for channels that fail
        var nullobj  = {};
        nullobj.log  = _.noop;
        nullobj.info = _.noop;
        nullobj.warn = _.noop;
        nullobj.error = _.noop;
        nullobj.debug = _.noop;
        nullobj.trace = _.noop;

        //channel acts as a filter for log messages by
        //either passing them directly to $log interface if whitelisted
        //or piping them to null interface if not
        //
        //we support any number of channels specified
        //as a list of variable arguments
        devlog.channel = function () {
          //not recommended to slice on arguments directly
          //prevents optimizations in JS engines
          var args = [];
          for ( var argIndex = 0; argIndex < arguments.length; argIndex++ ) {
            args.push(arguments[argIndex]);
          }

          if (!config) {
            $log.debug('WARNING No config in application, suppressing call to devlog');
            console.trace();
            return nullobj;
          }
          var whitelist = config.devlogWhitelist;

          //no whitelist present
          //means suppress
          if (!whitelist) {
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
          for ( var i = 0; i < args.length; i++ ) {
            if (whitelist.indexOf(args[i]) >= 0) {
              approved.push(args[i]);
            } else if (whitelist.indexOf('*') >= 0 && whitelist.indexOf('!' + args[i]) < 0) {
              approved.push(args[i]);
            }
          }
          if (approved.length > 0) {
            devlog.setChannelPrefix(approved);
            return devlog;
          }

          return nullobj;

        };

        //internal use
        devlog.channelPrefix = '';

        //internal use
        //generates a substring indicating the channels the messages belong to
        //  surrounded by pipes (i.e. '|CHANNEL|')
        //used to prefix the logger's output so a user can see the channel in the console
        devlog.setChannelPrefix   = function (chans) {
          devlog.channelPrefix = '|' + chans.join('|') + '| ';
          devlog.channelPrefix = devlog.channelPrefix.toUpperCase();
        };
        devlog.clearChannelPrefix = function () {
          devlog.channelPrefix = '';
        };
        devlog.prefixArgs          = function (msgParams) {
          //msg_params is of type Arguments from function
          var args = Array.prototype.slice.call(msgParams);
          if (args[0] && (typeof args[0] === 'string' || args[0] instanceof String)) {
            args[0] = devlog.channelPrefix + args[0];
          } else {
            args.unshift(devlog.channelPrefix);
          }
          return args;
        };

        return devlog;

      }
    });
})();

