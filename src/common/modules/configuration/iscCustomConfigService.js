/**
 * Created by douglasgoodman on 11/19/14.
 */

(function () {
  'use strict';

  angular.module('isc.configuration')
    .provider('iscCustomConfigService', function () {
      var routeSpecificRolePermissions = {};
      var config                       = {};

      function hydrateRolePermissions(masterRoutes, routes) {
        /**
         * CONVERTS FORMAT FROM:
         {'index.home.*': ['%HSCC_CMC_CarePlanApprover',
           '%HSCC_CMC_CarePlanCreator',
           '%HSCC_CMC_CarePlanViewer',
           '%HSCC_CMC_Administrator'
           ]}

         TO:
         [{'%HSCC_CMC_CarePlanApprover': ["index.home.*"]},
         {'%HSCC_CMC_CarePlanCreator': ["index.home.*"]},
         {'%HSCC_CMC_CarePlanViewer': ["index.home.*"]},
         {'%HSCC_CMC_Administrator': ["index.home.*"]}]
         */
        _.forEach(routes, function (roles, routes) {
          _.forEach(roles, function (role) {
            masterRoutes[role] = masterRoutes[role] || [];
            masterRoutes[role].push(routes);
          });
        });
      }

      return {
        loadConfig        : function loadConfig(configObj) {

          config                 = configObj;
          config.rolePermissions = config.rolePermissions || [];
          _.forEach(routeSpecificRolePermissions, function (value, key) {
            config.rolePermissions[key] = config.rolePermissions[key] || [];
            Array.prototype.push.apply(config.rolePermissions[key], value);
          });
        },
        addRolePermissions: function addRolePermissions(states) {
          hydrateRolePermissions(routeSpecificRolePermissions, states);
        },
        $get              : iscCustomConfigService
      };

      /* @ngInject */
      function iscCustomConfigService(devlog, iscCustomConfigHelper) {
        devlog.channel('iscCustomConfigService').debug('iscCustomConfigService LOADED');

        // ----------------------------
        // vars
        // ----------------------------

        var topTabsArray;

        // ----------------------------
        // class factory
        // ----------------------------

        var service = {

          getConfigSection: getConfigSection,
          getConfig       : getConfig,
          setConfig       : setConfig,
          addStates       : addStates
        };

        return service;

        // ----------------------------
        // functions
        // ----------------------------
        function getConfig() {
          devlog.channel('iscCustomConfigService').debug('iscCustomConfigService.getConfig');
          devlog.channel('iscCustomConfigService').debug('...config ' + JSON.stringify(config));
          return config;
        }

        function getConfigSection(section) {
          devlog.channel('iscCustomConfigService').debug('iscCustomConfigService.getConfigSection');
          devlog.channel('iscCustomConfigService').debug('...section' + section);
          return _.get(config, section);
        }

        function setConfig(val) {
          devlog.channel('iscCustomConfigService').debug('iscCustomConfigService.setConfig');
          devlog.channel('iscCustomConfigService').debug('...config ', val);
          config = val;
        }

        // ----------------------------
        // states

        function addStates() {
          devlog.channel('iscCustomConfigService').debug('iscCustomConfigService.addStates');

          // add the top tabs
          iscCustomConfigHelper.addStates(config.topTabs);

          // add the login button if it exists
          var login = config.loginButton;
          if (!!login) {
            iscCustomConfigHelper.addStates({
              loginButton: config.loginButton
            });
          }

          // add the secondary navs
          var secondaryNavs = _.filter(config, 'secondaryNav');
          devlog.channel('iscCustomConfigService').debug('...secondaryNavs', secondaryNavs);
          _.forEach(secondaryNavs, function (obj) {
            iscCustomConfigHelper.addStates(obj.secondaryNav);
          });

          // add the secondary tasks
          var tasks = _.filter(config, 'tasks');
          devlog.channel('iscCustomConfigService').debug('...tasks', tasks);
          _.forEach(tasks, function (obj) {
            iscCustomConfigHelper.addStates(obj.tasks);
          });
        }
      }// END CLASS

    });
})();
