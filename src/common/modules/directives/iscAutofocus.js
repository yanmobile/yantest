/**
 *
 * courtesy of mlynch
 * https://gist.github.com/mlynch/dd407b93ed288d499778
 *
 * the HTML5 iscAutofocus property can be finicky when it comes to dynamically loaded
 * templates and such with AngularJS. Use this simple directive to
 * tame this beast once and for all.
 *
 * Usage:
 * <input type="text" iscAutofocus>
 *
 * License: MIT
 */

(function () {
  'use strict';

  /* @ngInject */
  function iscAutofocus (devlog, $timeout) {
    devlog.channel('iscAutofocus').debug( 'iscAutofocus LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------
    var directive = {
      restrict: 'A',
      link    : link
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------

    function link (scope, elem, attr) {
      $timeout (function () {
        elem[ 0 ].focus ();
      });

    }//END LINK

  }//END CLASS


  // ----------------------------
  // injection
  // ----------------------------

  angular.module ('isc.directives')
      .directive ('iscAutofocus', iscAutofocus);

}) ();
