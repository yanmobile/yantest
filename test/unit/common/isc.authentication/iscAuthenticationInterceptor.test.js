(function () {
  'use strict';
  //console.log( 'iscAuthenticationInterceptor Tests' );

  describe('iscAuthenticationInterceptor', function () {
    var $rootScope;
    var $q;
    var AUTH_EVENTS;
    var iscAuthenticationInterceptor;

    beforeEach(module('isc.core', 'isc.authentication', function (devlogProvider, $provide) {
      devlogProvider.loadConfig(customConfig);
      $provide.value('$log', console);
    }));

    // show $log statements
    beforeEach(inject(function (_$rootScope_, _$q_, _iscAuthenticationInterceptor_, _AUTH_EVENTS_) {
      $rootScope = _$rootScope_; //NOTE when spying on $rootScope.$emit, you cant use $rootScope.$new()
      $q = _$q_;
      AUTH_EVENTS = _AUTH_EVENTS_;
      iscAuthenticationInterceptor = _iscAuthenticationInterceptor_;

    }));

    describe('response tests ', function () {

      it('should have a function response', function () {
        expect(angular.isFunction(iscAuthenticationInterceptor.response)).toBe(true);
      });

      it('should have broadcasted AUTH_EVENTS.sessionTimeoutReset', function () {
        var response = {config: {url: ""}};

        spyOn($rootScope, '$emit');

        iscAuthenticationInterceptor.response(response);

        expect($rootScope.$emit).toHaveBeenCalledWith(AUTH_EVENTS.sessionTimeoutReset, response);
      });

      it('should NOT have broadcasted AUTH_EVENTS.sessionTimeoutReset when config.bypassSessionReset', function () {
        var response = {config: {bypassSessionReset: true, url: ""}};

        spyOn($rootScope, '$emit');

        iscAuthenticationInterceptor.response(response);

        expect($rootScope.$emit).not.toHaveBeenCalled();
      });
    });

    // -------------------------
    describe('responseError tests ', function () {

      it('should have a function responseError', function () {
        expect(angular.isFunction(iscAuthenticationInterceptor.responseError)).toBe(true);
      });

      it('should have broadcasted AUTH_EVENTS.notAuthorized for non-specific error', function () {
        var response = {error: 'Oops'};

        spyOn($rootScope, '$emit');
        spyOn($q, 'reject');

        iscAuthenticationInterceptor.responseError(response);

        expect($rootScope.$emit).toHaveBeenCalledWith(AUTH_EVENTS.notAuthorized, response);
        expect($q.reject).toHaveBeenCalledWith(response);
      });

      it('should have broadcasted AUTH_EVENTS.sessionTimeout for 401', function () {
        var response = {status: 401, error: 'Oops'};

        spyOn($rootScope, '$emit');
        spyOn($q, 'reject');

        iscAuthenticationInterceptor.responseError(response);

        expect($rootScope.$emit).toHaveBeenCalledWith(AUTH_EVENTS.sessionTimeout, response);
        expect($q.reject).toHaveBeenCalledWith(response);
      });

      it('should NOT have broadcasted any event for 500', function () {
        var response = {status: 500, error: 'Oops'};

        spyOn($rootScope, '$emit');
        spyOn($q, 'reject');

        iscAuthenticationInterceptor.responseError(response);

        expect($rootScope.$emit).not.toHaveBeenCalled();
        expect($q.reject).toHaveBeenCalledWith(response);
      });
    });

  });

})();

