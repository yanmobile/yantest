/**
 * Created by Henry Zou on 4/17/2016.
 */
(function () {
  'use strict';

  var blacklist;
  var whitelist;
  var $logMethods;
  var config;

  angular
    .module('isc.core')
    .provider('devlog', devlog);

  /**
   * @ngdoc provider
   * @memberOf devlog
   */
  function devlog() {

    return {
      loadConfig: function loadConfig(configObj) {
        config    = configObj;
        blacklist = config.devlogBlacklist;
        whitelist = config.devlogWhitelist;
      },
      $get      : devlogService
    };
  }

  /**
   * @ngdoc provider
   * @memberOf devlog
   * @param $log
   * @returns {*}
   */
  function devlogService($log) {
    $logMethods = _.keysIn($log);
    var Log     = getLogClass();
    return _.extend({
      channel: channel,
      logFn  : logFn
    }, $log);

    /**
     * @ngdoc provider
     * @memberOf devlog
     * @description it takes a 'channel' string and returns _.noop or real logger
     * @param channelName
     * @returns {*}
     */
    function channel(channelName) {
      // needs to be an instance because we want to preserve the channelName across multiple log calls
      return new Log(channelName);
    }

    function getLogClass() {

      function Log(channelName) {
        var isAllowed = getIsAllowed(channelName, whitelist, blacklist);
        if (isAllowed) {
          $log.log('*** devlog channel allowed: ', channelName, ":", isAllowed ? "YES" : "NO", " ***");
        }
        this.channelName   = channelName;
        this.channelPrefix = (channelName ? "|" + channelName + "|" : '');
        if (isAllowed) {
          _.extend(this, this.real);
        } else {
          _.extend(this, this.fake);
        }
      }

      Log.prototype.real = getRealLogger();
      Log.prototype.fake = getNoOpLogger();

      return Log;

      /*========================================
       =         private functions             =
       ========================================*/

      /**
       * @memberOf devlog
       * @description
       *  checks whether the channel is allowed or not
       * @param channelName
       * @param whitelist
       * @param blacklist
       * @returns {boolean}
       */
      function getIsAllowed(channelName, whitelist, blacklist) {
        var allowed = false;
        if (_.includes(blacklist, channelName)) {
          allowed = false;
        } else if (_.isNil(whitelist)) {
          allowed = false;
        } else if (_.isNil(channelName)) {
          allowed = true;
        } else if (_.isEqual(whitelist, ["*"]) || _.includes(whitelist, channelName)) {
          allowed = true;
        }
        return allowed;
      }

      /**
       * @memberOf devlog
       * @description
       *  Real log method it will log to console when invoked
       * @param channel
       * @returns {{dir: *, log: *, debug: *, info: *, warn: *, error: *, logFn: Function}}
       */
      function getRealLogger() {
        var logger = getLogger(logMethod);

        logger.logFn = logFn;

        return logger;

      }

      /**
       * @memberOf devlog
       * @description
       *  Empty Logger performing an no-op when invoked
       * @returns {{}}
       */
      function getNoOpLogger() {
        var logger   = getLogger();
        logger.logFn = _.noop;
        return logger;
      }

      /**
       * @memberOf devlog
       * @description iterates through all of $log's own properties and creates a new log object:
       *  it will either return a _.noop object or real $log
       * @param logFunc
       * @returns {{}}
       */
      function getLogger(logFunc) {
        var logger = {};

        _.forEach($logMethods, function (method) {
          logger[method] = logFunc ? logFunc(method) : _.noop;
        });

        logger.error = logMethod('error');
        return logger;
      }
    }

    function logFn(method) {
      var args = _.toArray(arguments);
      args.shift(); //remove the first parameter (method)

      var messages = ["=====", method, "(" + args.join(', ') + ")", "====="];
      if (this.channelName) {
        messages.splice(1, 1, this.channelName + "." + method);
      }
      $log.log.apply($log, messages);
    }

    /**
     * produces real logger
     * @param method
     * @returns {Function}
     */
    function logMethod(method) {
      return function () {
        var args = _.toArray(arguments);
        if (this.channelPrefix) {  //adds this.channelPrefix to be logged
          args.unshift(this.channelPrefix);
        }
        $log[method].apply($log, args);
      };
    }

  }

})();
