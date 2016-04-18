(function () {
  'use strict';

  var mockConfig = angular.copy(customConfig);

  describe('iscNavigationController', function () {
    var scope,
        self,
        rootScope,
        httpBackend,
        timeout,
        translate,
        sessionStorageHelper,
        alertModel,
        AUTH_EVENTS,
        NAV_EVENTS,
        $state,
        controller;

    // show $log statements
    beforeEach( module( function( $provide ){
      $provide.value( '$log', mock$log );
    } ) );

    // setup devlog
    beforeEach(module('isc.core', 'isc.configuration', 'iscNavContainer', function (devlogProvider, iscCustomConfigServiceProvider) {
      devlogProvider.loadConfig(mockConfig);
      iscCustomConfigServiceProvider.loadConfig(mockConfig);
    }));

    // this loads all the external templates used in directives etc
    // eg, everything in **/partials/*.html
    beforeEach(module('isc.templates'));

    beforeEach(inject(function (
      $rootScope, $controller, _$state_, $httpBackend, $timeout, $translate,
      _AUTH_EVENTS_, _NAV_EVENTS_,
      iscCustomConfigService, iscSessionModel, iscSessionStorageHelper
    ) {

      mockConfig = angular.copy(customConfig);
      iscSessionStorageHelper.setConfig(mockConfig);

      translate            = $translate;
      rootScope            = $rootScope;
      sessionStorageHelper = iscSessionStorageHelper;
      timeout              = $timeout;
      httpBackend          = $httpBackend;
      scope                = $rootScope.$new();
      controller           = $controller('iscNavigationController as navCtrl',
        {
          '$scope': scope
        });

      self = scope.navCtrl;

      self.sessionModel = iscSessionModel;
      $state            = _$state_;
      AUTH_EVENTS       = _AUTH_EVENTS_;
      NAV_EVENTS        = _NAV_EVENTS_;

    }));

    // -------------------------
    xdescribe('onLoad tests ', function () {

      it('should know what to do onLoad, dont show warning', function () {
        spyOn(sessionStorageHelper, 'getShowTimedOutAlert').and.returnValue(false);
        spyOn(sessionStorageHelper, 'setShowTimedOutAlert');
        spyOn(alertModel, 'setOptionsByType');
        spyOn(self, 'showAlertBox');
        spyOn(self, 'onLoad');

        // these tests are a little odd since the onLoad function is called every time the controller is instantiated
        // so the call counts are off
        self.onLoad();
        timeout.flush();

        expect(sessionStorageHelper.setShowTimedOutAlert.callCount).toBe(0);
        expect(alertModel.setOptionsByType.callCount).toBe(1);
        expect(self.showAlertBox.callCount).toBe(1);
        expect(sessionStorageHelper.setShowTimedOutAlert).not.toHaveBeenCalled();
      });

      it('should know what to do onLoad, show warning', function () {
        spyOn(sessionStorageHelper, 'getShowTimedOutAlert').and.returnValue(true);
        spyOn(sessionStorageHelper, 'setShowTimedOutAlert');
        spyOn(alertModel, 'setOptionsByType');
        spyOn(self, 'showAlertBox');

        // these tests are a little odd since the onLoad function is called every time the controller is instantiated
        // so the call counts are off
        timeout.flush();
        self.onLoad();

        expect(sessionStorageHelper.setShowTimedOutAlert.callCount).toBe(1);
        expect(sessionStorageHelper.setShowTimedOutAlert).toHaveBeenCalledWith(false);
        expect(alertModel.setOptionsByType.callCount).toBe(2);
        expect(alertModel.setOptionsByType).toHaveBeenCalledWith(AUTH_EVENTS.sessionTimeout, null, null, null);
        expect(self.showAlertBox.callCount).toBe(2);
        expect(self.showAlertBox).toHaveBeenCalled();
      });

    });

    // -------------------------
    xdescribe('showAlertBox tests ', function () {

      it('should open the alert with the right args', function () {
        spyOn(self, 'showAlertBox');
        spyOn(alertModel, 'setOptionsByType');

        rootScope.$emit(AUTH_EVENTS.responseError);
        expect(self.showAlertBox).toHaveBeenCalled();
        expect(alertModel.setOptionsByType).toHaveBeenCalledWith(AUTH_EVENTS.responseError, undefined, null, null);

        rootScope.$emit(AUTH_EVENTS.notAuthenticated);
        expect(self.showAlertBox).toHaveBeenCalled();
        expect(alertModel.setOptionsByType).toHaveBeenCalledWith(AUTH_EVENTS.notAuthenticated, undefined, null, null);

        rootScope.$emit(AUTH_EVENTS.notAuthorized);
        expect(self.showAlertBox).toHaveBeenCalled();
        expect(alertModel.setOptionsByType).toHaveBeenCalledWith(AUTH_EVENTS.notAuthorized, undefined, null, null);
      });

      it('should open the warning alert with the right args', function () {
        spyOn(self, 'showAlertBox');
        spyOn(alertModel, 'setOptionsByType');

        self.alertShowing = false;

        rootScope.$emit(AUTH_EVENTS.sessionTimeoutWarning);
        expect(self.showAlertBox).toHaveBeenCalled();
        expect(self.alertShowing).toBe(true);
        expect(alertModel.setOptionsByType).toHaveBeenCalledWith(AUTH_EVENTS.sessionTimeoutWarning, undefined, self.onContinueSession, self.onCancelSession);
      });

      it('should NOT open the warning alert', function () {
        spyOn(self, 'showAlertBox');
        spyOn(alertModel, 'setOptionsByType');

        self.alertShowing = true;

        rootScope.$emit(AUTH_EVENTS.sessionTimeoutWarning);
        expect(self.showAlertBox).not.toHaveBeenCalled();
        expect(self.alertShowing).toBe(true);
        expect(alertModel.setOptionsByType).not.toHaveBeenCalled();
      });
    });

    describe('onSelectLanguage tests ', function () {
      it('should have a function onSelectLanguage', function () {
        expect(angular.isFunction(self.onSelectLanguage)).toBe(true);
      });

      it('should know what to do onSelectLanguage', function () {
        spyOn(translate, 'use');
        spyOn(sessionStorageHelper, 'setSessionStorageValue');

        self.onSelectLanguage({ filename: 'es-es' });
        expect(translate.use).toHaveBeenCalled();
        expect(sessionStorageHelper.setSessionStorageValue).toHaveBeenCalled();
      });
    });

    // -------------------------
    describe('onContinueSession tests ', function () {

      it('should have a function onContinueSession', function () {
        expect(angular.isFunction(self.onContinueSession)).toBe(true);
      });

      it('should know what to do onContinueSession', function () {
        spyOn(rootScope, '$emit');
        self.onContinueSession();
        expect(rootScope.$emit).toHaveBeenCalledWith(AUTH_EVENTS.sessionTimeoutReset);
      });
    });

    // -------------------------
    describe('onCancelSession tests ', function () {

      it('should have a function onCancelSession', function () {
        expect(angular.isFunction(self.onCancelSession)).toBe(true);
      });

      it('should know what to do onCancelSession', function () {
        spyOn(rootScope, '$emit');
        self.onCancelSession();
        expect(rootScope.$emit).toHaveBeenCalledWith(AUTH_EVENTS.sessionTimeoutConfirm);
      });
    });

  });
})();

