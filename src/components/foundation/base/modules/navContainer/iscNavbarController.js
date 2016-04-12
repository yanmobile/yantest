(function () {
  'use strict';

  // ------------------------------------------
  // module injection
  // ------------------------------------------
  angular.module('iscNavContainer')
    .controller('iscNavbarController', iscNavbarController);

  /**
   * @ngDoc controller
   * @memberOf iscNavContainer
   * @param devlog
   * @param $scope
   * @param $state
   * @param $rootScope
   * @param iscNavContainerModel
   * @param iscCustomConfigService
   * @param iscCustomConfigHelper
   * @param iscUiHelper
   * @param iscSessionModel
     * @param AUTH_EVENTS
     */
  function iscNavbarController(
    devlog, $scope, $state, $rootScope, iscNavContainerModel,
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

      getTabs  : iscNavContainerModel.getTopNav,
      userRoles: [],
      logout   : logout,

      setPageState     : setPageState,
      setTabActiveState: setTabActiveState
    });

    setShowRoles();

    /**
     * @memberOf iscNavbarController
     */
    function logout() {
      devlog.channel('iscNavbarController').debug('iscNavbarController.logout');
      $rootScope.$emit(AUTH_EVENTS.logout);
    }

    /**
     * @memberOf iscNavbarController
     */
    function setShowRoles() {
      devlog.channel('iscNavbarController').debug('iscNavbarController.isAuthenticated');
      self.user      = iscSessionModel.getCurrentUser();
      self.userRoles = _.get(self.user, 'Roles', [self.user.userRole]);
      self.showRoles = self.userRoles.length > 1;
    }

    /**
     * @memberOf iscNavbarController
     * @param name
       */
    function setPageState(name) {
      self.setTabActiveState(name, self.getTabs());
      self.sectionTranslationKey = iscCustomConfigHelper.getSectionTranslationKeyFromName(name);
    }

    /**
     * @memberOf iscNavbarController
     * @param state
       */
    function setTabActiveState(state) {
      devlog.channel('iscNavbarController').debug('iscNavbarController.setTabActiveState');
      self.iscUiHelper.setTabActiveState(state, self.getTabs());
    }

    // -----------------------------
    // listeners
    // -----------------------------

    //
    $rootScope.$on(AUTH_EVENTS.sessionChange, function () {
      self.isAuthenticated = iscSessionModel.isAuthenticated();
    });

    $rootScope.$on(AUTH_EVENTS.sessionResumedSuccess, function () {
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


