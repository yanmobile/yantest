/**
 * Created by douglasgoodman on 11/19/14.
 */

(function () {
  'use strict';

  angular.module('isc.configuration')
    .provider('iscCustomConfigService', iscCustomConfigServiceProvider);

  /*========================================
   =     iscCustomConfigServiceProvider     =
   ========================================*/
  function iscCustomConfigServiceProvider() {
    var topTabOverrides         = {};
    var rolePermissionOverrides = {};
    var config                  = {};
    var landingPages            = {};

    return {
      loadConfig        : function loadConfig(configObj) {
        config                 = configObj;
        config.rolePermissions = config.rolePermissions || [];
        _.forEach(rolePermissionOverrides, function (value, key) {
          config.rolePermissions[key] = config.rolePermissions[key] || [];
          Array.prototype.push.apply(config.rolePermissions[key], value);
        });

        _.extend(config.topTabs, topTabOverrides);

        config.landingPages = config.landingPages || {};
        _.extend(config.landingPages, landingPages);
      },
      addRolePermissions: function addRolePermissions(states) {
        hydrateRolePermissions(rolePermissionOverrides, states);
      },
      addTopNavTab      : function addTopNavTab(topNavTab) {
        _.merge(topTabOverrides, topNavTab);
      },
      setLandingPageFor : function (role, state) {
        landingPages[role] = state;
      },
      $get              : iscCustomConfigService
    };

    function hydrateRolePermissions(masterRoutes, routes) {
      /**
       *
       CONVERTS FORMAT FROM:
       {'index.home.*': ['Role1', 'Nurse','Provider','Receptionist' ]}

       TO:
       [{'Role1': ['index.home.*']}, {'Nurse': ['index.home.*']}, {'Provider': ['index.home.*']}, {'Receptionist': ['index.home.*']}]
       */
      _.forEach(routes, function (roles, routes) {
        _.forEach(roles, function (role) {
          masterRoutes[role] = masterRoutes[role] || [];
          masterRoutes[role].push(routes);
        });
      });
    }

    /*========================================
     =                 SERVICE                =
     ========================================*/
    function iscCustomConfigService(devlog, iscCustomConfigHelper, iscSessionModel) {
      devlog.channel('iscCustomConfigService').debug('iscCustomConfigService LOADED');

      // ----------------------------
      // class factory
      // ----------------------------
      var service = {
        getConfigSection: getConfigSection,
        getConfig       : getConfig,
        setConfig       : setConfig,
        addStates       : addStates
        //TODO: Add back once code has been refactored to use this
        //,
        //getRolePermissions: _.partial(getConfigSection, 'rolePermissions', true),
        //getTopNav         : _.partial(getConfigSection, 'topTabs', true),
        //getLandingPage    : _.partial(getConfigSection, 'landingPages', true)
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

      function getConfigSection(section, isRoleSpecific) {
        devlog.channel('iscCustomConfigService').debug('iscCustomConfigService.getConfigSection', section);

        var retObj;
        if (isRoleSpecific) {
          var currentUserRole = iscSessionModel.getCurrentUserRole();
          retObj              = _.get(config, section + '.' + currentUserRole);
        } else {
          retObj = _.get(config, section);
        }
        return retObj;
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
      }
    }// END CLASS

  }
})();
