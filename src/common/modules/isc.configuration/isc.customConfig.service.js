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
    var config = { rolePermissions: {}, landingPages: {}, topTabs: {} };

    return {
      loadConfig        : function loadConfig(configObj) {
        updateConfig(configObj);
      },
      addRolePermissions: function addRolePermissions(states) {
        updateConfig(mapRolePermissions(states), 'rolePermissions');
      },
      addTopNavTab      : function addTopNavTab(topNavTab) {
        updateConfig(topNavTab, 'topTabs');
      },
      setLandingPageFor : function (role, state) {
        updateConfig(_.makeObj(role, state), 'landingPages');
      },
      $get              : iscCustomConfigService
    };

    function updateConfig(object, key) {
      if (key) {
        _.mergeWith(config[key], object, concatArrays);
      } else {
        _.mergeWith(config, object, concatArrays);
      }
    }

    //used as a helper method for _.merge() to indicate when
    //to concat two arrays instead of overwrite properities by array index
    function concatArrays(a, b) {
      if (_.isArray(a)) {
        return a.concat(b);
      }
    }

    /*========================================
     =                 SERVICE                =
     ========================================*/
    function iscCustomConfigService(devlog) {
      var channel = devlog.channel('iscCustomConfigService');
      channel.debug('iscCustomConfigService LOADED');

      // ----------------------------
      // class factory
      // ----------------------------
      var service = {
        getConfigSection: getConfigSection,
        getConfig       : getConfig
      };

      return service;

      // ----------------------------
      // functions
      // ----------------------------
      function getConfig() {
        channel.debug('iscCustomConfigService.getConfig');
        channel.debug('...config ' + JSON.stringify(config));
        return config;
      }

      function getConfigSection(section, role) {
        channel.debug('iscCustomConfigService.getConfigSection', section);
        var retObj;
        if (role) {
          retObj = _.get(config, [section, role].join('.'));
        } else {
          retObj = _.get(config, section);
        }
        return retObj;
      }

    }// END CLASS

    function mapRolePermissions(permissions) {
      /**
       *
       CONVERTS FORMAT FROM:
       {'index.home.*': ['Role1', 'Nurse','Provider','Receptionist' ]}

       TO:
       [{'Role1': ['index.home.*']}, {'Nurse': ['index.home.*']}, {'Provider': ['index.home.*']}, {'Receptionist': ['index.home.*']}]
       */
      var masterRoutes = {};
      if (!_.isTypeOf(permissions, 'array')) {
        //converting to an array
        permissions = [permissions];
      }

      // NOTE: This is an Big O(n^3) operation.
      // In practice this is Big O(n^2) operation, with very small # of items < 3.
      // The permissions argument is usually an object instead of an array
      _.forEach(permissions, function (permission) {
        _.forEach(permission, function (roles, route) {
          _.forEach(roles, function (role) {
            masterRoutes[role] = masterRoutes[role] || [];
            masterRoutes[role].push(route);
          });
        });
      });
      return masterRoutes;
    }
  }
})();
