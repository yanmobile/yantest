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
        AUTH_EVENTS,
        loginDataProxy;


    var mockConfig        = angular.copy(customConfig);
    var mockStates        = [
      { state: 'index.home', exclude: true },
      { state: 'index.home.sub1', exclude: false },
      { state: 'index.home.sub2', exclude: true },
      { state: 'index.home.sub3', exclude: false },
      { state: 'index.messages', exclude: true },
      { state: 'index.messages.sub1', exclude: false },
      { state: 'index.messages.sub2', exclude: true },
      { state: 'index.messages.sub3', exclude: false },
      { state: 'index.library', exclude: true },
      { state: 'index.account', exclude: false }
    ];
    var userPermittedTabs = {
      "user" : ["index.wellness.*", "index.messages.*", "index.library.*", "index.calendar.*", "index.myAccount.*"],
      "proxy": ["index.myAccount.*", "index.messages", "index.messages.inbox", "index.messages.outbox", "index.messages.refillPrescription"]
    };

    var noLoginRequired = [
      "index",
      "index.login",
      "index.home"
    ];

    var mockLoginResponse = {
      "ChangePassword": 0,
      "SessionTimeout": 3600,
      "UserData"      : {
        "FirstName": "Adam",
        "FullName" : "Adam Everyman",
        "LastName" : "Everyman",
        "ProxyOnly": 0,
        "userRole" : "Admin"
      },
      "reload"        : 0
    };

    var mockLoginResponseProxy = {
      "ChangePassword": 0,
      "SessionTimeout": 3600,
      "UserData"      : {
        "FirstName": "Adam",
        "FullName" : "Adam Everyman",
        "LastName" : "Everyman",
        "ProxyOnly": 1
      },
      "reload"        : 0
    };

    // setup devlog
    beforeEach(module('isc.core', function (devlogProvider) {
      devlogProvider.loadConfig(customConfig);
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
      loginDataProxy = angular.copy(mockLoginResponseProxy);

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
        spyOn(rootScope, '$broadcast');
        sessionModel.create(loginData, true);
        expect(sessionModel.getCredentials()).toEqual({});
        expect(sessionModel.getCurrentUser()).toEqual(loginData.UserData);
        expect(rootScope.$broadcast).toHaveBeenCalledWith(AUTH_EVENTS.loginSuccess);

      });

      it('should create the config when calling create, page refresh', function () {
        spyOn(rootScope, '$broadcast');
        sessionModel.create(loginData, false);
        expect(sessionModel.getCredentials()).toEqual({});
        expect(sessionModel.getCurrentUser()).toEqual(loginData.UserData);
        expect(rootScope.$broadcast).toHaveBeenCalledWith(AUTH_EVENTS.sessionResumedSuccess);
      });

      it('should destroy the config when calling destroy', function () {

        var creds = sessionModel.getCredentials();
        var user  = sessionModel.getCurrentUser();
        expect(creds).toEqual({});
        expect(user).toEqual(loginData.UserData);

        sessionModel.destroy();
        var creds = sessionModel.getCredentials();
        var user  = sessionModel.getCurrentUser();

        expect(creds).toBe(null);
        expect(user).toBe(null);
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
        expect(expected).toBe(200);
      });
    });

    // -------------------------
    describe('isAuthenticated tests ', function () {

      it('should have a function isAuthenticated', function () {
        expect(angular.isFunction(sessionModel.isAuthenticated)).toBe(true);
      });

      it('should know when someone is authenticated', function () {
        sessionModel.create(loginData);
        var expected = sessionModel.isAuthenticated();
        expect(expected).toBe(true);

        sessionModel.destroy();
        var expected = sessionModel.isAuthenticated();
        expect(expected).toBe(false);
      });
    });

    // -------------------------
    describe('isAuthorized tests ', function () {

      it('should have a function isAuthorized', function () {
        expect(angular.isFunction(sessionModel.isAuthorized)).toBe(true);
      });

      it('should have a function getPermittedStates', function () {
        expect(angular.isFunction(sessionModel.getPermittedStates)).toBe(true);
      });

      it('should have a function setPermittedStates', function () {
        expect(angular.isFunction(sessionModel.setPermittedStates)).toBe(true);
      });

      it('should know if someone is authorized, all permitted', function () {
        sessionModel.create(loginData);
        sessionModel.setPermittedStates(['*']);

        var expected = sessionModel.isAuthorized('index.messages.outbox');
        expect(expected).toBe(true);

        var expected = sessionModel.isAuthorized('index');
        expect(expected).toBe(true);

        var expected = sessionModel.isAuthorized('foo');
        expect(expected).toBe(true);
      });

      it('should know if someone is authorized, some permitted', function () {
        sessionModel.create(loginData);
        sessionModel.setPermittedStates(['index.messages.outbox', 'foo']);

        var expected = sessionModel.isAuthorized('index.messages.outbox');
        expect(expected).toBe(true);

        var expected = sessionModel.isAuthorized('index');
        expect(expected).toBe(false);

        var expected = sessionModel.isAuthorized('foo');
        expect(expected).toBe(true);
      });

      it('should know if someone is authorized, some permitted by wildcard', function () {
        sessionModel.create(loginData);
        sessionModel.setPermittedStates(['index.messages.*']);

        var expected = sessionModel.isAuthorized('index.messages');
        expect(expected).toBe(true);

        var expected = sessionModel.isAuthorized('index.messages.outbox');
        expect(expected).toBe(true);

        var expected = sessionModel.isAuthorized('index.messages.inbox');
        expect(expected).toBe(true);

        var expected = sessionModel.isAuthorized('index');
        expect(expected).toBe(false);

        var expected = sessionModel.isAuthorized('foo');
        expect(expected).toBe(false);
      });
    });

    // -------------------------
    describe('whitelist, setNoLoginRequiredList tests ', function () {
      it('should have a function isWhiteListed', function () {
        expect(angular.isFunction(sessionModel.isWhiteListed)).toBe(true);
      });

      it('should have a function setNoLoginRequiredList', function () {
        expect(angular.isFunction(sessionModel.setNoLoginRequiredList)).toBe(true);
      });


      it('should know when a page is whitelisted', function () {
        sessionModel.setNoLoginRequiredList(['ix.foo', 'ix.fee', 'ix.baz.*', 'ix.buz.*']);

        var expected = sessionModel.isWhiteListed('ix.foo');
        expect(expected).toBe(true);

        var expected = sessionModel.isWhiteListed('ix.fee');
        expect(expected).toBe(true);

        var expected = sessionModel.isWhiteListed('ix.baz');
        expect(expected).toBe(true);

        var expected = sessionModel.isWhiteListed('ix.baz.sub.sub');
        expect(expected).toBe(true);

        var expected = sessionModel.isWhiteListed('ix.baz.sub');
        expect(expected).toBe(true);

        var expected = sessionModel.isWhiteListed('ix.buz');
        expect(expected).toBe(true);

        var expected = sessionModel.isWhiteListed('ix.buz.sub.sub');
        expect(expected).toBe(true);

        // ---------
        var expected = sessionModel.isWhiteListed('ix.bar.baz.buz');
        expect(expected).toBe(false);

        var expected = sessionModel.isWhiteListed('ix.bar');
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
        expect(expected).toBe(mockLoginResponse.UserData.FullName);
      });
    });


    // -------------------------
    describe('updateStateByRole tests ', function () {

      it('should have a function updateStateByRole', function () {
        expect(angular.isFunction(sessionModel.updateStateByRole)).toBe(true);
      });

      it('should updateStateByRole, bogus role', function () {
        mockConfig.noLoginRequired   = ['index.home.*'];
        mockConfig.userPermittedTabs = {
          user: ['*']
        };

        iscCustomConfigHelper.resetStates();
        iscCustomConfigHelper.addStates(angular.copy(mockStates));

        sessionModel.updateStateByRole('FOOBAR', mockConfig);
        var allStates                = iscCustomConfigHelper.getAllStates();

        _.forEach(allStates, function (state) {
          if (_.contains(state.state, 'index.home')) {
            expect(state.exclude).toBe(false); // if its whitelisted, dont exclude
          }
          else {
            expect(state.exclude).toBe(true);
          }
        });
      });

      it('should updateStateByRole, no role', function () {
        mockConfig.noLoginRequired   = ['index.home.*'];
        mockConfig.userPermittedTabs = {
          user: ['*']
        };

        iscCustomConfigHelper.resetStates();
        iscCustomConfigHelper.addStates(angular.copy(mockStates));

        sessionModel.updateStateByRole(null, mockConfig);
        var allStates                = iscCustomConfigHelper.getAllStates();

        _.forEach(allStates, function (state) {
          if (_.contains(state.state, 'index.home')) {
            expect(state.exclude).toBe(false); // if its whitelisted, dont exclude
          }
          else {
            expect(state.exclude).toBe(true);
          }

        });
      });

      it('should updateStateByRole, all permitted by wildcard', function () {
        mockConfig.noLoginRequired   = ['index.home.*'];
        mockConfig.userPermittedTabs = {
          user: ['*']
        };

        iscCustomConfigHelper.resetStates();
        iscCustomConfigHelper.addStates(angular.copy(mockStates));

        sessionModel.updateStateByRole('user', mockConfig);
        var allStates                = iscCustomConfigHelper.getAllStates();

        _.forEach(allStates, function (state) {
          expect(state.exclude).toBe(false);
        });
      });

      it('should updateStateByRole, some permitted by wildcard, some not, some excluded', function () {
        mockConfig.noLoginRequired   = ['index.home.*'];
        mockConfig.userPermittedTabs = {
          user: ['index.library', 'index.messages', 'index.messages.sub1']
        };

        iscCustomConfigHelper.resetStates();
        iscCustomConfigHelper.addStates(angular.copy(mockStates));

        sessionModel.updateStateByRole('user', mockConfig);
        var allStates                = iscCustomConfigHelper.getAllStates();

        var permittedStates = mockConfig.userPermittedTabs.user;

        _.forEach(allStates, function (state) {
          if (_.contains(permittedStates, state.state)) {
            expect(state.exclude).toBe(false); // if its in the permitted states, dont exclude
          }
          else if (_.contains(state.state, 'index.home')) {
            expect(state.exclude).toBe(false); // or if its whitelisted, dont exclude
          }
          else {
            expect(state.exclude).toBe(true); // otherwise disappear it
          }
        });

        expect(allStates['index.messages.sub2'].exclude).toBe(true); //just to be sure
      });

      it('should updateStateByRole, some permitted by wildcard, some excluded', function () {
        mockConfig.noLoginRequired   = ['index.home.*'];
        mockConfig.userPermittedTabs = {
          user: ['index.messages.*']
        };

        iscCustomConfigHelper.resetStates();
        iscCustomConfigHelper.addStates(angular.copy(mockStates));

        sessionModel.updateStateByRole('user', mockConfig);
        var allStates                = iscCustomConfigHelper.getAllStates();

        _.forEach(allStates, function (state) {

          if (_.contains(state.state, 'index.home')) {
            expect(state.exclude).toBe(false); // its whitelisted, dont exclude
          }
          else if (_.contains(state.state, 'index.messages')) {
            expect(state.exclude).toBe(false); // or if its wild carded, dont exclude
          }
          else {
            expect(state.exclude).toBe(true); // otherwise disappear it
          }
        });

        expect(allStates['index.library'].exclude).toBe(true); //just to be sure
      });

      it('should updateStateByRole, no wildcard, some excluded', function () {
        mockConfig.noLoginRequired = []; // log in for everything
        mockConfig.userPermittedTabs = {
          user: ['index.library', 'index.account']
        };

        iscCustomConfigHelper.resetStates();
        iscCustomConfigHelper.addStates(angular.copy(mockStates));

        sessionModel.updateStateByRole('user', mockConfig);
        var allStates                = iscCustomConfigHelper.getAllStates();

        _.forEach(allStates, function (state) {
          if (state.state === 'index.library') {
            expect(state.exclude).toBe(false); // explicitly permitted
          }
          else if (state.state === 'index.account') {
            expect(state.exclude).toBe(false); // explicitly permitted
          }
          else {
            expect(state.exclude).toBe(true); // otherwise disappear it
          }
        });
      });

      it('should updateStateByRole, no wildcard, some bogus states', function () {
        mockConfig.noLoginRequired = []; // log in for everything
        mockConfig.userPermittedTabs = {
          user: ['index.library', 'index.account', 'foobar']
        };

        iscCustomConfigHelper.resetStates();
        iscCustomConfigHelper.addStates(angular.copy(mockStates));

        sessionModel.updateStateByRole('user', mockConfig);
        var allStates                = iscCustomConfigHelper.getAllStates();

        expect(allStates['foobar']).not.toBeDefined(); // bogus state

        _.forEach(allStates, function (state) {
          console.log(state);
          if (state.state === 'index.library') {
            expect(state.exclude).toBe(false); // explicitly permitted
          }
          else if (state.state === 'index.account') {
            expect(state.exclude).toBe(false); // explicitly permitted
          }
          else {
            expect(state.exclude).toBe(true); // otherwise disappear it
          }
        });
      });
    });

  });
})();

