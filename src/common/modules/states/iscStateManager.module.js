/**
 * Created by douglas goodman on 3/9/15.
 */

(function () {
  'use strict';

  // ----------------------------
  // injection
  // ----------------------------

  angular
    .module('isc.states', ['isc.core', 'ui.router'])
    .run(run);

  function run(iscRouterDefaultEventService, iscSessionModel, iscAuthorization, iscCustomConfigService) {
    iscRouterDefaultEventService.loadDataFromStoredSession();

    var currentUser = iscSessionModel.getCurrentUser();
    var userRole    = currentUser.userRole;

    var authorizedRoutes = iscCustomConfigService.getConfigSection("rolePermissions")[userRole];
    iscAuthorization.setAuthorizedRoutes(authorizedRoutes);

  }

})();

