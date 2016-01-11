(function () {
  'use strict';
  //console.log( 'iscSessionModel Tests' );

  describe('iscSessionModel', function () {
    var scope,
        rootScope,
        sessionModel,
        timeout,
        httpBackend,
        $window,
        loginData,
        iscCustomConfigHelper,
        iscCustomConfigServiceProvider,
        AUTH_EVENTS;

    var mockConfig = angular.copy(customConfig);

    // setup devlog
    beforeEach(module('isc.core', function (devlogProvider) {
      devlogProvider.loadConfig(mockConfig);
    }));

    beforeEach(module('isc.configuration', function (_iscCustomConfigServiceProvider_) {
      iscCustomConfigServiceProvider = _iscCustomConfigServiceProvider_;
    }));

    // show $log statements
    beforeEach(module('isc.authentication', function ($provide) {
      $provide.value('$log', console);
    }));

    beforeEach(inject(function ($rootScope, $httpBackend, $timeout, _$window_, _AUTH_EVENTS_, iscSessionModel, _iscCustomConfigHelper_) {

      iscCustomConfigHelper = _iscCustomConfigHelper_;
      rootScope             = $rootScope;
      scope                 = $rootScope.$new();
      sessionModel          = iscSessionModel;
      httpBackend           = $httpBackend;
      $window               = _$window_;
      timeout               = $timeout;
      AUTH_EVENTS           = _AUTH_EVENTS_;

      $window.sessionStorage = { // mocking sessionStorage
        getItem: function (key) {
          return this[key];
        },

        setItem: function (key, val) {
          this[key] = val;
        }
      };

      loginData      = angular.copy(mockLoginResponse);

      sessionModel.create(loginData);

      $window.sessionStorage.setItem('currentUser', '');
      $window.sessionStorage.setItem('statePermissions', '');

    }));

    // -------------------------
    describe('create / destroy tests ', function () {

      it('should have a function create', function () {
        expect(angular.isFunction(sessionModel.create)).toBe(true);
      });

      it('should have a function destroy', function () {
        expect(angular.isFunction(sessionModel.destroy)).toBe(true);
      });

      it('should have a function getCredentials', function () {
        expect(angular.isFunction(sessionModel.getCredentials)).toBe(true);
      });

      it('should have a function getCurrentUser', function () {
        expect(angular.isFunction(sessionModel.getCurrentUser)).toBe(true);
      });

      it('should create the config when calling create, new session', function () {
        spyOn(rootScope, '$emit');
        sessionModel.create(loginData, true);
        expect(sessionModel.getCredentials()).toEqual({});
        expect(sessionModel.getCurrentUser()).toEqual(loginData.UserData);
        expect(rootScope.$emit).toHaveBeenCalledWith(AUTH_EVENTS.loginSuccess);

      });

      it('should create the config when calling create, page refresh', function () {
        spyOn(rootScope, '$emit');
        sessionModel.create(loginData, false);
        expect(sessionModel.getCredentials()).toEqual({});
        expect(sessionModel.getCurrentUser()).toEqual(loginData.UserData);
        expect(rootScope.$emit).toHaveBeenCalledWith(AUTH_EVENTS.sessionResumedSuccess);
      });

      it('should destroy the config when calling destroy', function () {
        var anonymousUser = { userRole: '*', FullName: 'anonymous' };
        var creds         = sessionModel.getCredentials();
        var user          = sessionModel.getCurrentUser();
        expect(creds).toEqual({});
        expect(user).toEqual(loginData.UserData);

        sessionModel.destroy();
        var creds         = sessionModel.getCredentials();
        var user          = sessionModel.getCurrentUser();

        expect(creds).toBe(null);
        expect(user).toEqual(anonymousUser);
      });
    });

    // -------------------------
    describe('sessionTimeout tests ', function () {

      it('should have a function initSessionTimeout', function () {
        expect(angular.isFunction(sessionModel.initSessionTimeout)).toBe(true);
      });

      it('should have a function stopSessionTimeout', function () {
        expect(angular.isFunction(sessionModel.stopSessionTimeout)).toBe(true);
      });

      it('should have a function resetSessionTimeout', function () {
        expect(angular.isFunction(sessionModel.resetSessionTimeout)).toBe(true);
      });
    });

    // -------------------------
    describe('getRemainingTime tests ', function () {
      it('should have a function getRemainingTime', function () {
        expect(angular.isFunction(sessionModel.getRemainingTime)).toBe(true);
      });

      it('should get the remaining time', function () {
        sessionModel.create(loginData); // RemainingTime = 3600

        sessionModel.initSessionTimeout(3400);

        var expected = sessionModel.getRemainingTime();
        // This is now the time remaining that ticks down from the initial max value to 0,
        // not the time used ticking up to the max.
        expect( expected ).toBe( 3400 );
      });
    });

    // -------------------------
    describe('isAuthenticated tests ', function () {

      it('should have a function isAuthenticated', function () {
        expect(angular.isFunction(sessionModel.isAuthenticated)).toBe(true);
      });

      it('should know when someone is authenticated', function () {
        loginData.UserData.userRole = 'provider';
        
        sessionModel.create(loginData);
        var expected = sessionModel.isAuthenticated();
        console.log(expected);
        expect(expected).toBe(true);

        sessionModel.destroy();
        var expected = sessionModel.isAuthenticated();
        expect(expected).toBe(false);
      });
    });

    // -------------------------
    describe('getFullName tests ', function () {
      it('should have a function getFullName', function () {
        expect(angular.isFunction(sessionModel.getFullName)).toBe(true);
      });

      it('should get the full name', function () {
        sessionModel.create(loginData);

        var expected = sessionModel.getFullName();
        expect(expected).toBe(loginData.UserData.FullName);
      });
    });

  });
})();

