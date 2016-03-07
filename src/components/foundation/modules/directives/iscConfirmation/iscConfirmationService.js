/**
 * Created by hzou on 9/16/15.
 */

(function () {
  'use strict';
  // ----------------------------
  // injection
  // ----------------------------

  angular.module('isc.directives')
    .provider('iscConfirmationService', iscConfirmationService);


  // to configure app-wide options in app.config block
  // IscConfirmationServiceProvider.setOptions({title: 'from app.js'});
  function iscConfirmationService() {//jshint ignore:line

    var defaultOptions = getDefaultOptions();

    var provider = {
      setOptions: setOptions,
      $get      : iscConfirmationServiceFactory
    };
    return provider;

    // -----------------------
    // funcs
    function setOptions(options) {
      return _.extend(defaultOptions, options);
    }

    function iscConfirmationServiceFactory($q) {

      var deferred;

      var model = {
        isOpen : false,
        show   : show,
        hide   : hide,
        resolve: resolve,
        reject : reject
      };

      return model;

      function show(message) {
        deferred = $q.defer();

        model.options = angular.copy(defaultOptions);
        if (_.isObject(message)) {
          _.extend(model.options, message);
        } else if (_.isString(message)) {
          model.options.message = message;
        }
        if (model.isOpen) {
          model.isOpen = false;
        }
        model.isOpen = true;
        return deferred.promise;
      }

      function hide() {
        model.isOpen = false;
      }

      function resolve(data) {
        model.isOpen = false;
        deferred.resolve(data || true);
      }

      function reject(data) {
        model.isOpen = false;
        deferred.reject(data || true);
      }
    }

    function getDefaultOptions() {
      return {
        title        : 'ISC_CONFIRM_DEFAULT_TITLE',
        message      : 'ISC_CONFIRM_DEFAULT_MESSAGE',
        btnOkText    : 'ISC_CONFIRM_BTN_CONFIRM',
        btnCancelText: 'ISC_CONFIRM_BTN_CANCEL'
      };
    }
  }//END CLASS

})();
