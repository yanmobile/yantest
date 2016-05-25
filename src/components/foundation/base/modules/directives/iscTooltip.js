/**
 * Created by Henry Zou on 5/17/2016, 9:45:31 PM.
 */

( function() {
  'use strict';

  angular
    .module( 'isc.directives' )
    .directive( 'iscTooltip', iscTooltip );

  /**
   * @description this is an Angular wrapper around jquery's tooltipster widget
   *
   * USAGE:
   * <ANY isc-tooltip config="tooltipsterConfiguration"></ANY>
   *
   * @returns {{restrict: string, link: link, scope: boolean, bindToController: {config: string}, controller: directive.controller, controllerAs: string}}
   */
  function iscTooltip( $timeout ) {//jshint ignore:line
    var defaultConfig = { animation: 'grow', touchDevices: true, maxWidth: 900 };
    var directive     = {
      restrict        : 'A',
      link            : link,
      scope           : true,
      bindToController: {
        "config": "="
      },
      controller      : function() {
      },
      controllerAs    : 'iscTooltipCtrl'

    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------
    function link( scope, elem, attrs, iscTooltipCtrl ) {

      // $timeout is needed in order to ensure the order of events
      $timeout( function() {
        // The directive needs to initialize jQuery's tooltip after Angular has interpolated the title
        elem.tooltipster( iscTooltipCtrl.config || defaultConfig );
      }, 0 );
    }

  }//END CLASS

} )();