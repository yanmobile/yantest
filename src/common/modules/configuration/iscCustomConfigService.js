/**
 * Created by douglasgoodman on 11/19/14.
 */

(function () {
  'use strict';

  angular.module('isc.configuration')
    .provider('iscCustomConfigService', function () {
      var routeSpecificUserPermittedTabs = {};
      var config                         = {};

      function hydrateUserPermittedTabs(tabs, states) {
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
        _.forEach(states, function (roles, state) {
          _.forEach(roles, function (role) {
            tabs[role] = tabs[role] || [];
            tabs[role].push(state);
          });
        });
      }

      return {
        loadConfig          : function loadConfig(configObj) {

          config                   = configObj;
          config.userPermittedTabs = config.userPermittedTabs || [];
          _.forEach(routeSpecificUserPermittedTabs, function (value, key) {
            config.userPermittedTabs[key] = config.userPermittedTabs[key] || [];
            Array.prototype.push.apply(config.userPermittedTabs[key], value);
          });
        },
        addUserPermittedTabs: function addUserPermittedTabs(states) {
          hydrateUserPermittedTabs(routeSpecificUserPermittedTabs, states);
        },
        $get                : iscCustomConfigService
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
          getBaseUrl         : getBaseUrl,
          getBaseUrlSecondary: getBaseUrlSecondary,
          getApiUrl          : getApiUrl,

          getConfig  : getConfig,
          setConfig  : setConfig,
          clearConfig: clearConfig,
          addStates  : addStates,


          getTopTabsConfig     : getTopTabsConfig,
          getTopTabsArray      : getTopTabsArray,
          getHomePageConfig    : getHomePageConfig,
          getLogoutButtonConfig: getLogoutButtonConfig,
          getLoginButtonConfig : getLoginButtonConfig,
          getLanguageConfig    : getLanguageConfig
        };

        return service;

        // ----------------------------
        // functions
        // ----------------------------

        // ----------------------------
        // base url

        function getBaseUrl() {
          devlog.channel('iscCustomConfigService').debug('iscCustomConfigService.getBaseUrl');
          devlog.channel('iscCustomConfigService').debug('...baseUrl', config ? config.baseUrl : '');
          return config ? config.baseUrl : null;
        }

        function getBaseUrlSecondary() {
          return config.baseUrlSecondary;
        }

        function getApiUrl(apiUrl) {
          if (!config.api) {
            return apiUrl;
          }

          var url = (config.api.protocol || 'http') + '://' + config.api.hostname + ':' + (config.api.port || 80);
          url += (apiUrl || '');
          return url;
        }

        // ----------------------------
        // config

        function getLanguageConfig() {
          return config.languageList;
        }

        function getConfig() {
          devlog.channel('iscCustomConfigService').debug('iscCustomConfigService.getConfig');
          devlog.channel('iscCustomConfigService').debug('...config ' + JSON.stringify(config));
          return config;
        }

        function setConfig(val) {
          devlog.channel('iscCustomConfigService').debug('iscCustomConfigService.setConfig');
          devlog.channel('iscCustomConfigService').debug('...baseUrl ' + JSON.stringify(val.baseUrl));
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

        function clearConfig() {
          devlog.channel('iscCustomConfigService').debug('iscCustomConfigService.clearConfig');
          config = {};
        }


        // ----------------------------
        // specific config getters

        function getTopTabsConfig() {
          return config.topTabs;
        }

        function getTopTabsArray() {
          if (!topTabsArray) {
            topTabsArray = _.toArray(config.topTabs);
          }
          return topTabsArray;
        }

        function getLogoutButtonConfig() {
          return config.logoutButton;
        }

        function getLoginButtonConfig() {
          return config.loginButton;
        }

        function getHomePageConfig() {
          return config.homePage;
        }

      }// END CLASS

    });
})();
