/**
 * Created by hzou on 6/12/16.
 */

/**
 * @description this service exposes the media query's breakpoints to JavaScript.
 * It'll also update when the window is resized
 *
 * NOTE: if retrieving value directly using "iscBreakpointsService.getBreakpoints()", be sure to update on window resize event.
 *
 * usage:

 * ==app.module.js==
 iscBreakpointsServiceProvider.setCssClasses( ["phablet", "small", "medium", "large"] ); //css breakpoint classes to check against

 * ==Controller==
 $timeout(function(){
   self.breakpoints = iscBreakpointsService.getBreakpoints();
   self.smallBp = iscBreakpointsService.getBreakpoint('small');
   self.phabletBp = iscBreakpointsService.getBreakpoint('phablet');
 });

 * ==DOM==
 <div ng-if="$ctrl.breakpoints['<breakpoint css class>']">Show content for this breakpoint</div>
 */
( function() {
  "use strict";

  angular
    .module( 'isc.breakpoints' )
    .directive( 'breakpoints', iscBreakpoints );

  function iscBreakpoints( iscBreakpointsService, $window ) {
    return {
      restrict: "E",
      link    : link
    };

    function link( scope, elem, attrs, ctrl ) {
      var breakpointClasses = iscBreakpointsService.getCssClasses();
      if ( breakpointClasses.length === 0 ) {
        return;
      }

      var breakpointElements = []; //caching
      breakpointClasses.forEach( function( cssClass ) {
        var breakpointElem = angular.element( '<div class="' + cssClass + '">' );
        elem.append( breakpointElem );
        breakpointElements.push( breakpointElem ); //caching
      } );

      updateBreakpoints(); // initial kickoff on initialization

      // update values on window.resize, but throttle the drag event for 250ms
      $( $window ).resize( _.throttle( updateBreakpoints, 250 ) );

      function updateBreakpoints() {
        var breakpoints = {};
        breakpointClasses.forEach( function( cssClass, index ) {
          //check their display property. if breakpoint is "valid", display property should not be none
          breakpoints[cssClass] = breakpointElements[index].css( 'display' ) !== "none";
        } );

        iscBreakpointsService.setBreakpoints( breakpoints );  //update the service
        scope.$evalAsync(); //since resize() is a jQuery event, we need to kick off a $digest cycle
      }
    }
  }
} )();
