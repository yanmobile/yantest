(function () {
  'use strict';
  //console.log( 'iscNavbarController Tests' );

  var mockConfig = angular.copy (customConfig);

  describe ('iscNavbarController', function () {
    var scope,
        self,
        rootScope,
        state,
        customConfigService,
        sessionModel,
        configHelper,
        uiHelper,
        AUTH_EVENTS,
        controller;


    // show $log statements
    beforeEach( module( 'iscNavContainer', function( $provide ){
      $provide.value('$log', console);
    }));


    beforeEach (inject (function ($rootScope,
                                  $controller,
                                  $state,
                                  iscCustomConfigService,
                                  iscCustomConfigHelper,
                                  iscUiHelper,
                                  iscSessionModel,
                                  _AUTH_EVENTS_) {

      mockConfig = angular.copy (customConfig);

      customConfigService = iscCustomConfigService;
      customConfigService.setConfig (mockConfig);

      rootScope  = $rootScope;
      scope      = $rootScope.$new ();
      controller = $controller ('iscNavbarController as ctrl',
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
    describe (
        'setup tests',
        function () {

          it ('should have a value showLogin', function () {
            expect (angular.isDefined (self.showLogin)).toBe (true);
            expect (self.showLogin).toBe (false);
          });

          it ('should have a value showLogout', function () {
            expect (angular.isDefined (self.showLogout)).toBe (true);
            expect (self.showLogout).toBe (false);
          });

          it ('should have a value sectionTranslationKey', function () {
            expect (angular.isDefined (self.sectionTranslationKey)).toBe (true);
            expect (self.sectionTranslationKey).toBe ('');
          });

          it ('should have a value tabs', function () {
            expect (angular.isDefined (self.tabs)).toBe (true);
            expect (self.tabs).toBe (customConfigService.getTopTabsArray ());
          });

          it ('should have a value logoutButton', function () {
            expect (angular.isDefined (self.logoutButton)).toBe (true);
            expect (self.logoutButton).toBe (customConfigService.getLogoutButtonConfig ());
          });

          it ('should have a value loginButton', function () {
            expect (angular.isDefined (self.loginButton)).toBe (true);
            expect (self.loginButton).toBe (customConfigService.getLoginButtonConfig ());
          });
        });

    // -------------------------
    describe (
        '$stateChangeSuccess tests',
        function () {

          it ('should call the right functions on $stateChangeSuccess', function () {
            spyOn (self, 'setPageState');
            spyOn (self, 'setShowLogout');
            spyOn (self, 'setShowLogin');

            rootScope.$broadcast ('$stateChangeSuccess', {}, { name: 'foo' });
            expect (self.setPageState).toHaveBeenCalled ();
            expect (self.setShowLogout).toHaveBeenCalled ();
            expect (self.setShowLogin).toHaveBeenCalled ();
          });
        });

    // -------------------------
    describe (
        'logout tests ',
        function () {

          it ('should have a function logout', function () {
            expect (angular.isFunction (self.logout)).toBe (true);
          });

          it ('should call the right functions on logout', function () {
            spyOn (rootScope, '$broadcast');

            self.logout ();
            expect (rootScope.$broadcast).toHaveBeenCalledWith (AUTH_EVENTS.logout);
          });
        });

    // -------------------------
    describe (
        'setShowLogin tests',
        function () {

          it ('should have a function setShowLogin', function () {
            expect (angular.isFunction (self.setShowLogin)).toBe (true);
          });

          it ('should know when to show the login button, authenticated and logged in', function () {
            spyOn (sessionModel, 'isAuthenticated').and.returnValue (true);
            spyOn (state, 'is').and.returnValue (true);
            spyOn (self, 'setPageState');
            spyOn (self, 'setShowLogout');

            rootScope.$broadcast ('$stateChangeSuccess', {}, { name: 'foo' });
            self.setShowLogin ();
            expect (self.showLogin).toBe (false);
          });

          it ('should know when to show the login button, NOT authenticated but logged in', function () {
            spyOn (self.sessionModel, 'isAuthenticated').and.returnValue (false);
            spyOn (state, 'is').and.returnValue (true);
            spyOn (self, 'setPageState');
            spyOn (self, 'setShowLogout');

            rootScope.$broadcast ('$stateChangeSuccess', {}, { name: 'foo' });
            self.setShowLogin ();
            expect (self.showLogin).toBe (false);

          });

          it ('should know when to show the login button, authenticated but NOT logged in', function () {
            spyOn (self.sessionModel, 'isAuthenticated').and.returnValue (true);
            spyOn (state, 'is').and.returnValue (false);
            spyOn (self, 'setPageState');
            spyOn (self, 'setShowLogout');

            rootScope.$broadcast ('$stateChangeSuccess', {}, { name: 'foo' });
            self.setShowLogin ();
            expect (self.showLogin).toBe (false);
          });

          it ('should know when to show the login button, NOT authenticated and NOT logged in', function () {
            spyOn (self.sessionModel, 'isAuthenticated').and.returnValue (false);
            spyOn (state, 'is').and.returnValue (false);
            spyOn (self, 'setPageState');
            spyOn (self, 'setShowLogout');

            rootScope.$broadcast ('$stateChangeSuccess', {}, { name: 'foo' });
            self.setShowLogin ();
            expect (self.showLogin).toBe (true);
          });
        });

    // -------------------------
    describe (
        'setShowLogout tests',
        function () {

          it ('should have a function setShowLogout', function () {
            expect (angular.isFunction (self.setShowLogout)).toBe (true);
          });

          it ('should know when to show the logout button, authenticated and on login page', function () {
            spyOn (sessionModel, 'isAuthenticated').and.returnValue (true);
            spyOn (state, 'is').and.returnValue (true);
            spyOn (self, 'setPageState');
            spyOn (self, 'setShowLogin');

            rootScope.$broadcast ('$stateChangeSuccess', {}, { name: 'foo' });
            self.setShowLogout ();
            expect (self.showLogout).toBe (false);
          });

          it ('should know when to show the logout button, NOT authenticated and on login page', function () {
            spyOn (self.sessionModel, 'isAuthenticated').and.returnValue (false);
            spyOn (state, 'is').and.returnValue (true);
            spyOn (self, 'setPageState');
            spyOn (self, 'setShowLogin');

            rootScope.$broadcast ('$stateChangeSuccess', {}, { name: 'foo' });
            self.setShowLogout ();
            expect (self.showLogout).toBe (false);

          });

          it ('should know when to show the logout button, authenticated and NOT on login page', function () {
            spyOn (self.sessionModel, 'isAuthenticated').and.returnValue (true);
            spyOn (state, 'is').and.returnValue (false);
            spyOn (self, 'setPageState');
            spyOn (self, 'setShowLogin');

            rootScope.$broadcast ('$stateChangeSuccess', {}, { name: 'foo' });
            self.setShowLogout ();
            expect (self.showLogout).toBe (true);
          });

          it ('should know when to show the logout button, NOT authenticated and NOT on login page', function () {
            spyOn (self.sessionModel, 'isAuthenticated').and.returnValue (false);
            spyOn (state, 'is').and.returnValue (false);
            spyOn (self, 'setPageState');
            spyOn (self, 'setShowLogin');

            rootScope.$broadcast ('$stateChangeSuccess', {}, { name: 'foo' });
            self.setShowLogout ();
            expect (self.showLogout).toBe (false);
          });
        });

    // -------------------------
    describe (
        'setPageState tests',
        function () {

          it ('should have a function setPageState', function () {
            expect (angular.isFunction (self.setPageState)).toBe (true);
          });

          it ('should setPageState', function () {
            spyOn (configHelper, 'getSectionTranslationKeyFromName').and.returnValue ('foo');
            spyOn (self, 'setTabActiveState');

            self.setPageState ('bar');
            expect (self.setTabActiveState).toHaveBeenCalledWith ('bar');
            expect (configHelper.getSectionTranslationKeyFromName).toHaveBeenCalledWith ('bar');
          });
        });

    // -------------------------
    describe (
        'setTabActiveState tests',
        function () {

          it ('should have a function setTabActiveState', function () {
            expect (angular.isFunction (self.setTabActiveState)).toBe (true);
          });

          it ('should setTabActiveState', function () {
            spyOn (uiHelper, 'setTabActiveState');

            self.setTabActiveState ('bar');
            expect (uiHelper.setTabActiveState).toHaveBeenCalledWith ('bar', self.tabs);
          });
        });

  });
}) ();

