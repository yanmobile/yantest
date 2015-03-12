/**
 * Created by douglas goodman on 3/7/15.
 */

(function(){
  'use strict';

  iscDynamicHtml.$inject = [ '$log', '$compile', '$templateCache' ];

  function iscDynamicHtml( $log, $compile, $templateCache ){
//    //$log.debug( 'iscDynamicHtml LOADED');

    // ----------------------------
    // vars
    // ----------------------------



    // ----------------------------
    // class factory
    // ----------------------------
    var directive = {
      restrict: 'EA',
      replace: true,
      link: link
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------

    function link( scope, elem, attr ){
      scope.$watch( attr.iscDynamicHtml, function( html ){
        //$log.debug( 'iscDynamicHtml', html );
        elem.html( html );
        $compile( elem.contents() )( scope );
      });
    }


  }//END CLASS


  // ----------------------------
  // injection
  // ----------------------------

  angular.module( 'isc.common' )
      .directive( 'iscDynamicHtml', iscDynamicHtml );

})();
