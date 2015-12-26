(function () {
  'use strict';
  //console.log( 'iscCustomConfigService Tests' );

  var mockConfig = angular.copy(customConfig);

  describe('iscCustomConfigService', function () {
    var helper,
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


    beforeEach(inject(function ($rootScope, $httpBackend, iscCustomConfigService, iscCustomConfigHelper) {
      helper       = iscCustomConfigHelper;

      customConfigService = iscCustomConfigService;
    }));


    describe('iscCustomConfigServiceProvider addRolePermissions', function () {

      it('should should have permissions added via .addRolePermissions()', function () {
        var permittedStates;
        provider.addRolePermissions({
          'myRoute.*': [
            'user',
            '%HSCC_CMC_CarePlanCreator'
          ]
        });

        customConfigService.clearConfig();
        permittedStates     = customConfigService.getConfig().rolePermissions;

        provider.loadConfig(mockConfig);
        permittedStates     = customConfigService.getConfig().rolePermissions;

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

  });

})();

