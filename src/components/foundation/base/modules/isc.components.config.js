/**
 * Created by hzou on 12/11/15.
 */

(function () {
  'use strict';

  angular
    .module('isc.common')
    .constant('componentConfig', getConfig());

  /*========================================
   =                 config                =
   ========================================*/
  function getConfig() {
    return {
      'devlogWhitelist': [],
      'session'        : {
        'routeMemoryExpirationInMinutes': 15
      },
      'moduleApi' : {
        'forms' : {
          'path'    : 'api/v1/forms'
        },
        'formData' : {
          'path'    : 'api/v1/formData'
        },
        'formInfo' : {
          'path'    : 'api/v1/formInfo'
        },
        'formTemplates' : {
          'path'    : 'api/v1/formTemplates'
        },
        'formCodeTables' : {
          'path'    : 'api/v1/codeTables'
        }
      },
      'debugDisplay'   : {
        'forms': {
          'additionalModels': false,
          'annotations'     : false,
          'formData'        : false
        }
      },
      'formats'        : {
        'date': {
          'shortDate'   : 'MM-DD-YYYY',
          'shortTime'   : 'h:mm A',
          'longDate'    : 'd MMMM yyyy',
          'longDateTime': 'd MMMM yyyy H:mm',
          'database'    : 'YYYY-MM-DD HH:mm:ss'
        }
      },
      'rolePermissions': {},
      'landingPages'   : {},
      'topTabs'        : {}
    };
  }

})();
