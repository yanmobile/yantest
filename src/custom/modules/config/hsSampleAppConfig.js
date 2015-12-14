/**
 * Created by hzou on 12/11/15.
 */

(function () {

  'use strict';

  var hsSampleAppConfig = {
    'devlogWhitelist'  : ['*'],
    'api'              : {
      'protocol' : 'http',
      'hostname' : 'localhost',
      'port'     : 57772,
      'namespace': 'mycc'
    },
    'noLoginRequired'  : [
      'index'
    ],
    'userRoles'        : [],
    'userPermittedTabs': {},
    'loginButton'      : {
      'state'         : 'index.login',
      'translationKey': 'ISC_LOGIN_BTN',
      'displayOrder'  : 8
    },
    'topTabs'          : {
      'index.home': {
        'state'         : 'index.home',
        'translationKey': 'HOME_TITLE',
        'displayOrder'  : 1
      }
    },
    'topNav'           : {
      'index.logout'   : {
        'translationKey': 'ISC_LOGOUT',
        'function'      : 'LogOut',
        'displayOrder'  : 1
      },
      'index.myAccount': {
        'externalLink'  : 'My Account',
        'target'        : 'myAccount',
        'translationKey': 'CMC_MY_ACCOUNT',
        'function'      : 'MyAccount',
        'displayOrder'  : 2
      }
    }
  };

  // ----------------------------
  // injection
  // ----------------------------
  angular.module('hsSampleApp')
    .constant('hsSampleAppConfig', hsSampleAppConfig);

})();
