/**
 * Created by douglasgoodman on 11/21/14.
 */
(function () {
  'use strict';
  // --------------
  // inject
  // --------------
  angular.module('iscNavContainer')
    .controller('iscNavigationController', iscNavigationController);

  /* @ngInject */
  /**
   * @ngdoc controller
   * @memberOf iscNavContainer
   * @param devlog
   * @param $rootScope
   * @param $timeout
   * @param $scope
   * @param $translate
   * @param iscSessionModel
   * @param iscSessionStorageHelper
   * @param iscNavContainerModel
   * @param iscCustomConfigHelper
   * @param iscUiHelper
   * @param iscLanguageService
     * @param AUTH_EVENTS
     * @param NAV_EVENTS
     */
  function iscNavigationController(
    devlog, $rootScope, $timeout, $scope, $translate,
    iscSessionModel, iscSessionStorageHelper, iscNavContainerModel,
    iscCustomConfigHelper, iscUiHelper, iscLanguageService,
    AUTH_EVENTS, NAV_EVENTS
  ) {
    devlog.channel('iscNavigationController').debug( 'iscNavigationController LOADED');

    var self = this;

    // --------------
    // models
    self.navModel           = iscNavContainerModel;
    self.sessionModel       = iscSessionModel;
    self.customConfigHelper = iscCustomConfigHelper;
    self.iscUiHelper        = iscUiHelper;

    self.showLanguageDropDown = iscLanguageService.showDropDown();
    self.languages            = iscLanguageService.getLanguages();
    self.selectedLanguage     = iscLanguageService.getSelectedLanguage();

    // --------------
    // nav bars and alerts
    // --------------
    self.showAlert        = false;
    self.alertShowing     = false;
    self.showSideNav      = false;
    self.showSecondaryNav = false;
    self.showModalBkgrnd  = false;

    // --------------
    /**
     * @memberOf iscNavigationController
     */
    self.hideAllPopups = function () {
      devlog.channel('iscNavigationController').debug( 'iscNavigationController.hideAllPopups');
      self.showModalBkgrnd  = false;
      self.showAlert        = false;
      self.alertShowing     = false;
      self.showSideNav      = false;
      self.showSecondaryNav = false;
      self.showModalBkgrnd  = false;
      $rootScope.$broadcast(NAV_EVENTS.modalBackgroundClicked);
    };

    // --------------
    /**
     * @memberOf iscNavigationController
     */
    self.showAlertBox = function () {
      devlog.channel('iscNavigationController').debug( 'iscNavigationController.showAlertBox');
      self.hideAllPopups(); // close any that are already up
      self.showAlert       = true;
      self.showModalBkgrnd = true;
      self.alertShowing    = true;
    };

    /**
     * @memberOf iscNavigationController
     */
    self.hideAlertBox = function () {
      self.showAlert       = false;
      self.showModalBkgrnd = false;
      self.alertShowing    = false;
    };

    /**
     * @memberOf iscNavigationController
     * @param val
       */
    self.onSelectLanguage = function (val) {
      iscSessionStorageHelper.setSessionStorageValue('currentLanguage', val);
      $translate.use(val.fileName);
    };

    // --------------
    // session / login
    // --------------
    self.currentUser = self.sessionModel.getCurrentUser();
    self.credentials = self.sessionModel.getCredentials();

    // --------------
    // session timeout callbacks
    /**
     * @memberOf iscNavigationController
     */
    self.onContinueSession = function () {
      devlog.channel('iscNavigationController').debug( 'iscNavigationController.onContinueSession');
      $rootScope.$emit(AUTH_EVENTS.sessionTimeoutReset);
    };

    /**
     * @memberOf iscNavigationController
     */
    self.onCancelSession = function () {
      devlog.channel('iscNavigationController').debug( 'iscNavigationController.onCancelSession');
      $rootScope.$emit(AUTH_EVENTS.sessionTimeoutConfirm);
    };

    // --------------
    // on load
    // --------------
    /**
     * @memberOf iscNavigationController
     */
    self.onLoad = function () {
      devlog.channel('iscNavigationController').debug( 'iscNavigationController.onLoad');
      devlog.channel('iscNavigationController').debug( '...alertShowing ', self.alertShowing );

      // When the session times out, we refresh the page to reset all model data
      // and set a localStorage var to show a warning:
      // This looks for the localStorage var and triggers the warning popup
      // Wrapped in a timeout to ensure the dom is loaded
      $timeout(function () {
        var showTimedOutAlert = !!iscSessionStorageHelper.getShowTimedOutAlert();
        devlog.channel('iscNavigationController').debug( '...showTimedOutAlert',showTimedOutAlert);

        if (showTimedOutAlert) {
          devlog.channel('iscNavigationController').debug( '...showTimedOutAlert 2',showTimedOutAlert);
          iscSessionStorageHelper.setShowTimedOutAlert(false);
        }
      }, 250);
    };

    self.onLoad();


    // --------------
    // version info
    // --------------
    self.versionInfo = {};

    var removeWatch = $scope.$watch(
      function () {
        return iscNavContainerModel.getVersionInfo();
      },
      function (newVal) {
        if (newVal) {
          angular.merge(self.versionInfo, newVal);
          removeWatch();
        }
      }
    );


    // --------------
    // listeners
    // --------------
    $scope.$on(AUTH_EVENTS.responseError, function (event, response) {
      devlog.channel('iscNavigationController').debug( 'iscNavigationController.responseError' );
      devlog.channel('iscNavigationController').debug( '...response' + JSON.stringify( response ));
    });

    $scope.$on(AUTH_EVENTS.notAuthenticated, function (event, response) {
//      devlog.channel('iscNavigationController').debug( 'iscNavigationController.loginError' );
    });

    $scope.$on(AUTH_EVENTS.notAuthorized, function (event, response) {
//      devlog.channel('iscNavigationController').debug( 'iscNavigationController.loginError' );
    });

    $scope.$on(AUTH_EVENTS.sessionTimeoutWarning, function (event, response) {
      devlog.channel('iscNavigationController').debug( 'iscNavigationController.sessionTimeoutWarning' );
      devlog.channel('iscNavigationController').debug( '...self.alertShowing: ' + self.alertShowing );

      if (self.alertShowing) {
        devlog.channel('iscNavigationController').debug( '...nope' );
        return;
      }
      devlog.channel('iscNavigationController').debug( '...yup' );
      self.alertShowing = true;
    });

    $scope.$on(AUTH_EVENTS.sessionTimeout, function () {
      devlog.channel('iscNavigationController').debug( 'ischNavContainer.sessionTimeout');
      self.hideAllPopups();
      self.alertShowing = false;
    });

    $scope.$on(NAV_EVENTS.showSecondaryNav, function (event, response) {//jshint ignore:line
      devlog.channel('iscNavigationController').debug( 'iscNavigationController.iscShowModal' );
      self.showSecondaryNavbar();
    });

    $scope.$on(NAV_EVENTS.hideSecondaryNav, function (event, response) {//jshint ignore:line
      devlog.channel('iscNavigationController').debug( 'iscNavigationController.iscHideModal' );
      self.hideSecondaryNavbar();
    });

    $rootScope.$on(NAV_EVENTS.hideSideNavBar, function () {
      self.hideSideNavbar();
    });

  }// END CLASS


})();


