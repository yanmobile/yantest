(function () {
  'use strict';
  //console.log( 'iscCustomConfigService Tests' );

  var mockConfig = angular.copy(customConfig);

  describe('iscCustomConfigService', function () {
    var sessionModel,
        helper,
        customConfigService,
        provider;

    var mockStates = [
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


    // this loads all the external templates used in directives etc
    // eg, everything in **/*.html
    beforeEach(module('isc.templates'));


    // setup devlog
    beforeEach(module('isc.core', function (devlogProvider) {
      devlogProvider.loadConfig(customConfig);
    }));

    // log statements
    beforeEach(module('isc.configuration', function ($provide, iscCustomConfigServiceProvider) {
      $provide.value('$log', console);
      provider = iscCustomConfigServiceProvider;
      iscCustomConfigServiceProvider.loadConfig(mockConfig);
    }));


    beforeEach(inject(function ($rootScope, $httpBackend, iscCustomConfigService, iscCustomConfigHelper, iscSessionModel) {
      sessionModel = iscSessionModel;
      helper       = iscCustomConfigHelper;

      customConfigService = iscCustomConfigService;
    }));


    describe('iscCustomConfigServiceProvider addUserPermittedTabs', function () {

      it('should should have permissions added via .addUserPermittedTabs()', function () {
        var permittedStates;
        provider.addUserPermittedTabs({
          'myRoute.*': [
            'user',
            '%HSCC_CMC_CarePlanCreator'
          ]
        });

        customConfigService.clearConfig();
        permittedStates     = customConfigService.getConfig().userPermittedTabs;

        provider.loadConfig(mockConfig);
        permittedStates     = customConfigService.getConfig().userPermittedTabs;

        var statesEvaluated = 0;
        ['user',
          '%HSCC_CMC_CarePlanCreator'
        ].forEach(function (role) {
            expect(_.contains(permittedStates[role], 'myRoute.*')).toBe(true);
            statesEvaluated++;
          });
        expect(statesEvaluated).toBe(2);
      });
    });

    // -------------------------
    describe('getConfig/setConfig tests ', function () {

      it('should have a function getConfig', function () {
        expect(angular.isFunction(customConfigService.getConfig)).toBe(true);
      });

      it('should have a function setConfig', function () {
        expect(angular.isFunction(customConfigService.setConfig)).toBe(true);
      });

      it('should return the config when calling getConfig', function () {
        var result = customConfigService.getConfig();
        expect(result).toBe(mockConfig);
      });
    });

    // -------------------------
    describe('get specific config tests ', function () {

      it('should have a function getTopTabsConfig', function () {
        expect(angular.isFunction(customConfigService.getTopTabsConfig)).toBe(true);
      });

      it('should get the tab config when calling getTopTabsConfig', function () {
        var result = customConfigService.getTopTabsConfig();
        expect(result).toBe(mockConfig.topTabs);
      });

      // --------------
      it('should have a function getHomePageConfig', function () {
        expect(angular.isFunction(customConfigService.getHomePageConfig)).toBe(true);
      });

      it('should get the home config when calling getHomePageConfig', function () {
        var result = customConfigService.getHomePageConfig();
        expect(result).toBe(mockConfig.homePage);
      });

      // --------------
      it('should have a function getLogoutButtonConfig', function () {
        expect(angular.isFunction(customConfigService.getLogoutButtonConfig)).toBe(true);
      });

      it('should get a config when calling getLogoutButtonConfig', function () {
        var result = customConfigService.getLogoutButtonConfig();
        expect(result).toBe(mockConfig.logoutButton);
      });

      // --------------
      it('should have a function getLoginButtonConfig', function () {
        expect(angular.isFunction(customConfigService.getLoginButtonConfig)).toBe(true);
      });

      it('should get a config when calling getLoginButtonConfig', function () {
        var result = customConfigService.getLoginButtonConfig();
        expect(result).toBe(mockConfig.loginButton);
      });

    });

    // -------------------------
    describe('updateStateByRole tests ', function () {

      it('should have a function updateStateByRole', function () {
        expect(angular.isFunction(customConfigService.updateStateByRole)).toBe(true);
      });

      it('should updateStateByRole, bogus role', function () {
        mockConfig.noLoginRequired   = ['index.home.*'];
        mockConfig.userPermittedTabs = {
          user: ['*']
        };

        helper.resetStates();
        helper.addStates(angular.copy(mockStates));

        customConfigService.updateStateByRole('FOOBAR');
        var allStates                = helper.getAllStates();

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

        helper.resetStates();
        helper.addStates(angular.copy(mockStates));

        customConfigService.updateStateByRole();
        var allStates                = helper.getAllStates();

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

        helper.resetStates();
        helper.addStates(angular.copy(mockStates));

        customConfigService.updateStateByRole('user');
        var allStates                = helper.getAllStates();

        _.forEach(allStates, function (state) {
          expect(state.exclude).toBe(false);
        });
      });

      it('should updateStateByRole, some permitted by wildcard, some not, some excluded', function () {
        mockConfig.noLoginRequired   = ['index.home.*'];
        mockConfig.userPermittedTabs = {
          user: ['index.library', 'index.messages', 'index.messages.sub1']
        };

        helper.resetStates();
        helper.addStates(angular.copy(mockStates));

        customConfigService.updateStateByRole('user');
        var allStates                = helper.getAllStates();

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

        helper.resetStates();
        helper.addStates(angular.copy(mockStates));

        customConfigService.updateStateByRole('user');
        var allStates                = helper.getAllStates();

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

        helper.resetStates();
        helper.addStates(angular.copy(mockStates));

        customConfigService.updateStateByRole('user');
        var allStates                = helper.getAllStates();

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

        helper.resetStates();
        helper.addStates(angular.copy(mockStates));

        customConfigService.updateStateByRole('user');
        var allStates                = helper.getAllStates();

        expect(allStates['foobar']).not.toBeDefined(); // bogus state

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
    });

  });

})();

