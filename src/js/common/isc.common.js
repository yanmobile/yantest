/**
 * Created by douglasgoodman on 11/21/14.
 */

(function(){
  'use strict';

  angular.module( 'isc.common',
      [
        'iscNavContainer',

        // third party modules
        'angularUtils.directives.dirPagination',
        'ui.calendar',
        'ui.router',
        'mobile-angular-ui',
        'mobile-angular-ui.gestures',
        'ngSanitize',
        'ngAnimate',
        'pascalprecht.translate',
        'angular.filter'
      ]
  );

})();

