/**
 * Created by hzou on 08/03/15.
 */

(function(){
  'use strict';

  iscTableFooterRow.$inject = [ '$log', 'devlog', '$state', '$templateCache', '$compile' ];

  function iscTableFooterRow( $log, devlog, $state, $templateCache, $compile ){
    //$log.debug('iscTableFooterRow.LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------

    var directive = {
      scope       : true, //prototypal inheritance
      restrict    : 'A',
      controllerAs: 'iscFooterRowCtrl',
      compile     : compile
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------
    function compile(){

      return {
        pre: pre
      };

      function pre( scope, trElem, attrs, iscRowCtrl ){
        var footerRowTemplate = _.get( scope, 'iscTblCtrl.tableConfig.footerRowTemplate' );

        if( footerRowTemplate ){
          //for some reason the template doesn't like spaces nor comments
          var template = $templateCache.get( footerRowTemplate );

          trElem.html( template );
          $compile( trElem.contents() )( scope );
        }
      }
    }
  }

  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'isc.common' )
    .directive( 'iscTableFooterRow', iscTableFooterRow );

})();
