(function () {
  'use strict';
  //console.log( 'iscCustomConfigService Tests' );
  var permittedStates;
  var mockConfig = angular.copy(customConfig);

  describe('iscCustomConfigService', function () {
    var customConfigService,
        provider;

    // setup devlog
    beforeEach(module('isc.core', function (devlogProvider, $provide) {
      $provide.value('$log', mock$log);
      devlogProvider.loadConfig(customConfig);
    }));

    // log statements
    beforeEach(module('isc.configuration', function (iscCustomConfigServiceProvider) {
      provider = iscCustomConfigServiceProvider;
      iscCustomConfigServiceProvider.loadConfig(mockConfig);
    }));

    beforeEach(inject(function ($rootScope, $httpBackend, iscCustomConfigService) {
      customConfigService = iscCustomConfigService;
    }));

    describe('getConfigSection', function () {
      it('should return entire section', function () {
        var permissions = customConfigService.getConfigSection('rolePermissions');
        expect(permissions).toEqual(mockConfig.rolePermissions);
      });

      it('should return config for specific role', function () {
        var permissions = customConfigService.getConfigSection('rolePermissions', '*');
        expect(permissions).toEqual(mockConfig.rolePermissions['*']);
      });
    });

    describe('iscCustomConfigServiceProvider addRolePermissions', function () {

      it('should addRolePermissions to be called first', function () {
        provider.addRolePermissions({ 'myRoute.*': ['*'] });
        provider.loadConfig(mockConfig);

        permittedStates = customConfigService.getConfigSection('rolePermissions', '*');
        expect(permittedStates).toBeDefined();
        expect(_.includes(permittedStates, 'myRoute.*')).toBe(true);
      });

      it('should loadConfig to be called first', function () {
        provider.loadConfig(mockConfig);
        provider.addRolePermissions({ 'myRoute.*': ['*'] });

        permittedStates = customConfigService.getConfigSection('rolePermissions', '*');
        expect(permittedStates).toBeDefined();
        expect(_.includes(permittedStates, 'myRoute.*')).toBe(true);
      });

      it('should allow adding a single route', function () {
        provider.addRolePermissions({ 'myRoute.*': ['*'] });

        permittedStates = customConfigService.getConfigSection('rolePermissions', '*');
        expect(permittedStates).toBeDefined();
        expect(_.includes(permittedStates, 'myRoute.*')).toBe(true);
      });

      it('should allow padding in an array of routes', function () {
        provider.addRolePermissions([{ 'myRoute.*': ['*'] }, { 'yourRoute.*': ['*'] }]);

        permittedStates = customConfigService.getConfigSection('rolePermissions', '*');
        expect(permittedStates).toBeDefined();
        expect(_.includes(permittedStates, 'myRoute.*')).toBe(true);
        expect(_.includes(permittedStates, 'yourRoute.*')).toBe(true);
      });

      it('should be able to add multiple roles', function () {
        provider.addRolePermissions({
          'myRoute.*': ['user', '%HSCC_CMC_CarePlanCreator']
        });
        permittedStates = customConfigService.getConfigSection('rolePermissions');

        var statesEvaluated = 0;
        ['user',
          '%HSCC_CMC_CarePlanCreator'
        ].forEach(function (role) {
            expect(_.includes(permittedStates[role], 'myRoute.*')).toBe(true);
            statesEvaluated++;
          });
        expect(statesEvaluated).toBe(2);
      });
    });

  });
})();

