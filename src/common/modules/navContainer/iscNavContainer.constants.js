/**
 * Created by douglasgoodman on 11/24/14.
 */

(function () {
  'use strict';

  angular.module('iscNavContainer')

    .constant('APP_EVENTS', {
      appLoaded: 'iscAppLoaded'
    })

    .constant('NAV_EVENTS', {
      showSecondaryNav      : 'iscShowSecondaryNav',
      hideSecondaryNav      : 'iscHideSecondaryNav',
      goToBeforeLoginPage   : 'iscGoToBeforeLoginPage',
      modalBackgroundClicked: 'iscModalBackgroundClicked',
      hideSideNavBar        : 'iscHideSideNavBar'
    });

})();
