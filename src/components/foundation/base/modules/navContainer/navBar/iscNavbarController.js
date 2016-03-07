(function () {
  'use strict';

  // ------------------------------------------
  // module injection
  // ------------------------------------------
  angular.module('iscNavContainer')
    .controller('iscNavbarController', iscNavbarController);

  /* @ngInject */
  function iscNavbarController(
    devlog, $scope, $state, $rootScope, $window,
    iscNavContainerModel,
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

      getTabs     : iscNavContainerModel.getTopNav,
      logoutButton: iscCustomConfigService.getConfigSection('logoutButton'),
      loginButton : iscCustomConfigService.getConfigSection('loginButton'),
      userRoles   : [],

      logout           : logout,
      setPageState     : setPageState,
      setTabActiveState: setTabActiveState
    });

    setShowRoles();


    function logout() {
      devlog.channel('iscNavbarController').debug('iscNavbarController.logout');
      $rootScope.$emit(AUTH_EVENTS.logout);
    }

    function setShowRoles() {
      devlog.channel('iscNavbarController').debug('iscNavbarController.isAuthenticated');
      self.user      = iscSessionModel.getCurrentUser();
      self.userRoles = _.get(self.user, 'Roles', [self.user.userRole]);
      self.showRoles = self.userRoles.length > 1;
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

    //
    $rootScope.$on(AUTH_EVENTS.sessionChange, function () {
      self.isAuthenticated = iscSessionModel.isAuthenticated();
    });

    $rootScope.$on(AUTH_EVENTS.iscSessionResumedSuccess, function () {
      self.isAuthenticated = iscSessionModel.isAuthenticated();
    });

    //
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      devlog.channel('iscNavbarController').debug('iscNavbarController.$stateChangeSuccess', arguments);
      self.setPageState(toState.name);
      setShowRoles();
    });

    // when you refresh the page, this will reset the active state of the selected tab
    $scope.$evalAsync(function () {
      devlog.channel('iscNavbarController').debug('iscNavbarController setting page name to', $state.$current.name);
      self.setPageState($state.$current.name);
    });


  } // END CLASS


})();


