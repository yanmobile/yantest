(function () {
  'use strict';

  describe('iscAuthorizationModel test', function () {

    var authorizationModel,
        sessionModel,
        customConfigServiceProvider;

    // setup devlog
    beforeEach(module('isc.core', function (devlogProvider) {
      devlogProvider.loadConfig(customConfig);
    }));

    beforeEach(module('isc.configuration', function (iscCustomConfigServiceProvider) {
      iscCustomConfigServiceProvider.loadConfig(customConfig);
      customConfigServiceProvider = iscCustomConfigServiceProvider;
    }));

    beforeEach(module('isc.authorization'));

    beforeEach(inject(function (_iscAuthorizationModel_, _iscSessionModel_) {
      authorizationModel = _iscAuthorizationModel_;
      sessionModel       = _iscSessionModel_;

      var loginData = angular.copy(mockLoginResponse);
      sessionModel.create(loginData);
    }));

    describe('sanity check', function () {
      it('should factory and its methods should be defined', function () {
        expect(authorizationModel).toBeDefined();
        expect(authorizationModel.isAuthorized).toBeDefined();
      });
    });

    describe('checking permissions via isAuthorized', function () {

      it('should return false if the stateToCheck and/or permittedStates is null/undefined', function () {
        var stateToCheck = null;

        //iscCustomConfigServiceProvider.addRolePermissions(permissions);
        var isAuthorized = authorizationModel.isAuthorized(stateToCheck);
        expect(isAuthorized).toBe(false);
      });

      it('should allow all routes', function () {
        customConfigServiceProvider.addRolePermissions({ 'index.messages.outbox': ['*'] });
        var stateToCheck = 'index.messages.outbox';
        var isAuthorized = authorizationModel.isAuthorized(stateToCheck);
        expect(isAuthorized).toBe(true);
      });

      it('should return false if the route is not permitted', function () {
        customConfigServiceProvider.addRolePermissions({ 'index': ['*'] });
        customConfigServiceProvider.addRolePermissions({ 'index.home': ['*'] });
        var stateToCheck = 'index.foo';

        var isAuthorized = authorizationModel.isAuthorized(stateToCheck);
        expect(isAuthorized).toBe(false);
      });

      it('should return true if the route is permitted', function () {
        var isAuthorized, stateToCheck;

        customConfigServiceProvider.addRolePermissions({ 'index': ['*'] });
        customConfigServiceProvider.addRolePermissions({ 'index.home': ['*'] });

        stateToCheck = 'index';

        isAuthorized = authorizationModel.isAuthorized(stateToCheck);
        expect(isAuthorized).toBe(true);

        stateToCheck = 'index.home';
        isAuthorized = authorizationModel.isAuthorized(stateToCheck);
        expect(isAuthorized).toBe(true);
      });

      it('should permit parent route if child route is permitted', function () {
        customConfigServiceProvider.addRolePermissions({ 'index.home.leaf': ['*'] });
        var stateToCheck = 'index.home';

        var isAuthorized = authorizationModel.isAuthorized(stateToCheck);
        expect(isAuthorized).toBe(true);

      });

      it('should return true if the route is part of wild card pattern', function () {
        customConfigServiceProvider.addRolePermissions({ 'index.*': ['*'] });

        var stateToCheck = 'index.home';
        var isAuthorized = authorizationModel.isAuthorized(stateToCheck);
        expect(isAuthorized).toBe(true);

        stateToCheck = 'index.home.foo.bar';
        isAuthorized = authorizationModel.isAuthorized(stateToCheck);
        expect(isAuthorized).toBe(true);
      });

      it('should return false if state is in black list', function () {
        customConfigServiceProvider.addRolePermissions({ 'index.*': ['*'] });
        customConfigServiceProvider.addRolePermissions({ '!index.home.*': ['*'] });

        var stateToCheck = 'index.home';
        var isAuthorized = authorizationModel.isAuthorized(stateToCheck);
        expect(isAuthorized).toBe(false);

        var stateToCheck = 'index.home.child';
        var isAuthorized = authorizationModel.isAuthorized(stateToCheck);
        expect(isAuthorized).toBe(false);

        var stateToCheck = 'index.foo';
        var isAuthorized = authorizationModel.isAuthorized(stateToCheck);
        expect(isAuthorized).toBe(true);
      });

      it('should return false if state is in black list wild card pattern', function () {
        customConfigServiceProvider.addRolePermissions({ 'index.*': ['*'] });
        customConfigServiceProvider.addRolePermissions({ '!index.home.*': ['*'] });

        var stateToCheck = 'index.home.foo';
        var isAuthorized = authorizationModel.isAuthorized(stateToCheck);
        expect(isAuthorized).toBe(false);
      });
    });

  });
})();
