(function () {
  'use strict';

  describe('iscAuthorization test', function () {

    var iscAuthorization;

    // setup devlog
    beforeEach(module('isc.core', function (devlogProvider) {
      devlogProvider.loadConfig(customConfig);
    }));

    beforeEach(module('isc.authentication'));

    beforeEach(inject(function (_iscAuthorization_) {
      iscAuthorization = _iscAuthorization_;
    }));

    describe('sanity check', function () {
      it('should factory and its methods should be defined', function () {
        expect(iscAuthorization).toBeDefined();
        expect(iscAuthorization.setAuthorizedRoutes).toBeDefined();
        expect(iscAuthorization.isAuthorized).toBeDefined();
      });
    });

    describe('build Route Map logic', function () {

      it('should return empty object if null/undefined is passed in', function () {

        var routes = iscAuthorization.setAuthorizedRoutes(null);
        expect(routes).toBeDefined();
        expect(typeof routes).toBe('object');

      });

      it('should return object containing 1 level per state tree', function () {
        var permittedRoutes = ['index', 'index.home', 'index.home.leaf'];
        var expectedRoutes  = { index: { home: { leaf: {} } } };

        var routes = iscAuthorization.setAuthorizedRoutes(permittedRoutes);

        expect(routes).toBeDefined();
        expect(_.isEmpty(routes)).toBe(false);
        expect(routes).toEqual(expectedRoutes);

      });

      it('should be able to specify descendent states first', function () {
        var permittedRoutes = ['index.home.leaf', 'index.home', 'index'];
        var expectedRoutes  = { index: { home: { leaf: {} } } };

        var routes = iscAuthorization.setAuthorizedRoutes(permittedRoutes);

        expect(routes).toBeDefined();
        expect(_.isEmpty(routes)).toBe(false);
        expect(routes).toEqual(expectedRoutes);

      });

      it('should be able to map wildcards (.*)', function () {
        var permittedRoutes = ['index.*'];
        var expectedRoutes  = { index: { '*': {} } };

        var routes = iscAuthorization.setAuthorizedRoutes(permittedRoutes);

        expect(routes).toBeDefined();
        expect(_.isEmpty(routes)).toBe(false);
        expect(routes).toEqual(expectedRoutes);

      });

    });

    describe('checking permissions via isAuthorized', function () {

      it('should return false if the stateToCheck and/or permittedStates is null/undefined', function () {
        var permittedStates = null;
        var stateToCheck    = null;

        var isAuthorized = iscAuthorization.isAuthorized(stateToCheck, permittedStates);
        expect(isAuthorized).toBe(false);
      });

      it('should allow all routes', function () {
        var permittedStates = iscAuthorization.setAuthorizedRoutes(['*']);
        var stateToCheck    = 'index.messages.outbox';

        var isAuthorized = iscAuthorization.isAuthorized(stateToCheck, permittedStates);
        expect(isAuthorized).toBe(true);
      });

      it('should return false if the route is not permitted', function () {
        var permittedStates = iscAuthorization.setAuthorizedRoutes(['index', 'index.home']);
        var stateToCheck    = 'index.foo';

        var isAuthorized = iscAuthorization.isAuthorized(stateToCheck, permittedStates);
        expect(isAuthorized).toBe(false);
      });

      it('should return true if the route is permitted', function () {
        var permittedStates = iscAuthorization.setAuthorizedRoutes(['index', 'index.home']);
        var stateToCheck    = 'index';

        var isAuthorized = iscAuthorization.isAuthorized(stateToCheck, permittedStates);
        expect(isAuthorized).toBe(true);


        stateToCheck = 'index.home';
        isAuthorized = iscAuthorization.isAuthorized(stateToCheck, permittedStates);
        expect(isAuthorized).toBe(true);
      });

      it('should return true if the route is permitted', function () {
        var permittedStates = iscAuthorization.setAuthorizedRoutes(['index', 'index.home']);
        var stateToCheck    = 'index';

        var isAuthorized = iscAuthorization.isAuthorized(stateToCheck, permittedStates);
        expect(isAuthorized).toBe(true);

        stateToCheck = 'index.home';
        isAuthorized = iscAuthorization.isAuthorized(stateToCheck, permittedStates);
        expect(isAuthorized).toBe(true);
      });

      it('should permit parent route if child route is permitted', function () {
        var permittedStates = iscAuthorization.setAuthorizedRoutes(['index.home.leaf']);
        var stateToCheck    = 'index.home';

        var isAuthorized = iscAuthorization.isAuthorized(stateToCheck, permittedStates);
        expect(isAuthorized).toBe(true);

      });

      it('should return true if the route is part of wild card pattern', function () {
        var permittedStates = iscAuthorization.setAuthorizedRoutes(['index.*']);

        var stateToCheck = 'index.home';
        var isAuthorized = iscAuthorization.isAuthorized(stateToCheck, permittedStates);
        expect(isAuthorized).toBe(true);

        stateToCheck = 'index.home.foo.bar';
        isAuthorized = iscAuthorization.isAuthorized(stateToCheck, permittedStates);
        expect(isAuthorized).toBe(true);
      });

      it('should return false if state is in black list', function () {
        var permittedStates = iscAuthorization.setAuthorizedRoutes(['index.*', '!index.home']);

        var stateToCheck = 'index.home';
        var isAuthorized = iscAuthorization.isAuthorized(stateToCheck, permittedStates);
        expect(isAuthorized).toBe(false);
      });

      it('should return false if state is in black list wild card pattern', function () {
        var permittedStates = iscAuthorization.setAuthorizedRoutes(['index.*', '!index.home.*']);

        var stateToCheck = 'index.home.foo';
        var isAuthorized = iscAuthorization.isAuthorized(stateToCheck, permittedStates);
        expect(isAuthorized).toBe(false);
      });
    });

  });
})();
