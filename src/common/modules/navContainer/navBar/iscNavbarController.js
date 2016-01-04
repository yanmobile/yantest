(function () {
  'use strict';

  // ------------------------------------------
  // module injection
  // ------------------------------------------
  angular.module('iscNavContainer')
    .controller('iscNavbarController', iscNavbarController);

  /* @ngInject */
  function iscNavbarController(
    devlog, $scope, $state, $rootScope,
    iscCustomConfigService, iscCustomConfigHelper, iscUiHelper, iscSessionModel,
    AUTH_EVENTS
  ) {

    devlog.channel('iscNavbarController').debug('iscNavbarController LOADED');

    var self = this;

    angular.extend(self, {
      iscUiHelper  : iscUiHelper,
      configService: iscCustomConfigService,
      sessionModel : iscSessionModel,

      sectionTranslationKey: '',
      showLogin            : false,
      showLogout           : false,

      tabs        :  _.toArray(iscCustomConfigService.getConfigSection('topTabs.*')),
      logoutButton: iscCustomConfigService.getConfigSection('logoutButton'),
      loginButton : iscCustomConfigService.getConfigSection('loginButton'),

      logout           : logout,
      setShowLogin     : setShowLogin,
      setShowLogout    : setShowLogout,
      setPageState     : setPageState,
      setTabActiveState: setTabActiveState
    });

    function logout() {
      devlog.channel('iscNavbarController').debug('iscNavbarController.logout');
      $rootScope.$broadcast(AUTH_EVENTS.logout);
    }

    function setShowLogin() {
      devlog.channel('iscNavbarController').debug('iscNavbarController.showLogin');

      var loggedIn    = iscSessionModel.isAuthenticated();
      var isLoginPage = $state.is('index.login');
      var isHomePage  = $state.is('index.home');

      self.showLogin = !loggedIn && !isLoginPage && !isHomePage;
    }

    function setShowLogout() {
      devlog.channel('iscNavbarController').debug('iscNavbarController.showLoout');

      var loggedIn    = self.sessionModel.isAuthenticated();
      var isLoginPage = $state.is('index.login');
      self.showLogout = loggedIn && !isLoginPage;
    }

    function setPageState(name) {
      self.setTabActiveState(name);
      self.sectionTranslationKey = iscCustomConfigHelper.getSectionTranslationKeyFromName(name);
    }

    function setTabActiveState(state) {
      devlog.channel('iscNavbarController').debug('iscNavbarController.setTabActiveState');
      self.iscUiHelper.setTabActiveState(state, self.tabs);
    }

    // -----------------------------
    // listeners
    // -----------------------------

    $rootScope.$on('$stateChangeSuccess',
      function (event, toState, toParams, fromState, fromParams) {

        devlog.channel('iscNavbarController').debug('iscNavbarController.$stateChangeSuccess', arguments);
        self.setPageState(toState.name);
        self.setShowLogout();
        self.setShowLogin();
      });

    // when you refresh the page, this will reset the active state of the selected tab
    $scope.$evalAsync(function () {
      devlog.channel('iscNavbarController').debug('iscNavbarController setting page name to', $state.$current.name);
      self.setPageState($state.$current.name);
    });


  } // END CLASS


})();


