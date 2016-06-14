/**
 * Created by hzou on 6/13/16.
 */

(function() {
  'use strict';

  angular
    .module( 'isc.breakpoints' )
    .provider( 'iscBreakpointsService', iscBreakpointService );

  /*========================================
   =                 impl                =
   ========================================*/
  function iscBreakpointService() {
    var cssClasses = [];
    var breakpoints;
    return {
      setCssClasses: function( classes ) {
        //["small", "phablet", "desktop-only"]
        cssClasses = classes;
      },
      $get         : function() {
        return {
          getCssClasses : function() {
            return cssClasses;
          },
          setBreakpoints: function( breakpointObj ) {
            //{ "phablet": true, "small": true, "medium": true, "large": false }
            breakpoints = breakpointObj;
          },
          getBreakpoints: function() {
            return breakpoints;
          },
          getBreakpoint : function( breakpointCssClass ) {
            return breakpoints[breakpointCssClass];
          }
        };
      }
    };
  }
})();
