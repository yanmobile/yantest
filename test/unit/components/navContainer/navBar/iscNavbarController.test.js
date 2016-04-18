(function () {
  'use strict';
  //console.log( 'iscNavbarController Tests' );

  var mockConfig = angular.copy(customConfig);

  describe('iscNavbarController', function () {
    var scope,
        self,
        rootScope,
        state,
        customConfigService,
        sessionModel,
        configHelper,
        uiHelper,
        AUTH_EVENTS,
        navbarCtrl;


    // setup devlog
    beforeEach(module('isc.core', 'isc.configuration', 'iscNavContainer', function (devlogProvider, iscCustomConfigServiceProvider, $provide) {
      devlogProvider.loadConfig(mockConfig);
      iscCustomConfigServiceProvider.loadConfig(mockConfig);
      $provide.value('$log', mock$log);
    }));

    beforeEach(inject(function (
      $rootScope,
      $controller,
      $state,
      iscCustomConfigService,
      iscCustomConfigHelper,
      iscUiHelper,
      iscSessionModel,
      _AUTH_EVENTS_
    ) {

      mockConfig = angular.copy(customConfig);

      customConfigService = iscCustomConfigService;
      //customConfigService.setConfig (mockConfig);

      rootScope  = $rootScope;
      scope      = $rootScope.$new();
      navbarCtrl = $controller('iscNavbarController as ctrl',
        {
          '$scope': scope
        });

      self = scope.ctrl;

      AUTH_EVENTS  = _AUTH_EVENTS_;
      state        = $state;
      configHelper = iscCustomConfigHelper;
      uiHelper     = iscUiHelper;
      sessionModel = iscSessionModel;

    }));

    // -------------------------
    describe(
      'setup tests',
      function () {

        it('should have a value sectionTranslationKey', function () {
          expect(angular.isDefined(self.sectionTranslationKey)).toBe(true);
          expect(self.sectionTranslationKey).toBe('');
        });
      });

    // -------------------------
    describe(
      'setPageState tests',
      function () {

        it('should have a function setPageState', function () {
          expect(angular.isFunction(self.setPageState)).toBe(true);
        });

        it('should setPageState', function () {
          spyOn(configHelper, 'getSectionTranslationKeyFromName').and.returnValue('foo');
          spyOn(self, 'setTabActiveState');

          self.setPageState('bar');
          expect(configHelper.getSectionTranslationKeyFromName).toHaveBeenCalledWith('bar');
        });
      });

    // -------------------------
    describe(
      'setTabActiveState tests',
      function () {

        it('should have a function setTabActiveState', function () {
          expect(angular.isFunction(self.setTabActiveState)).toBe(true);
        });

        it('should setTabActiveState', function () {
          spyOn(uiHelper, 'setTabActiveState');

          self.setTabActiveState('bar');
          expect(uiHelper.setTabActiveState).toHaveBeenCalledWith('bar', jasmine.objectContaining(self.getTabs()));
        });
      });

  });
})();

