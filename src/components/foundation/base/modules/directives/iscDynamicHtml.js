/**
 * Created by douglas goodman on 3/7/15.
 */

(function(){
  'use strict';
  // ----------------------------
  // injection
  // ----------------------------

  angular.module( 'isc.directives' )
    .directive( 'iscDynamicHtml', iscDynamicHtml );

  /* @ngInject */
  function iscDynamicHtml( devlog, $compile, $templateCache ){//jshint ignore:line
//    devlog.channel('iscDynamicHtml').debug( 'iscDynamicHtml LOADED');

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
        devlog.channel('iscDynamicHtml').debug( 'iscDynamicHtml', html );
        elem.html( html );
        $compile( elem.contents() )( scope );
      });
    }


  }//END CLASS



})();
