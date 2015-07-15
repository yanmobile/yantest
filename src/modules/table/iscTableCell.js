/**
 * Created by Trevor Hudson on 06/02/15.
 */
(function(){
  'use strict';

  iscTableCell.$inject = [ '$log', '$state' ];

  function iscTableCell( $log, $state ){
    //$log.debug('iscTableCell.LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------

    var directive = {
      scope      : {
        cellData   : '=',
        cellConfig : '=',
        mobileClass: '@?'
      },
      require    : "^?iscTableRow",
      restrict   : 'A',
      templateUrl: 'table/iscTableCell.html',
      link       : link
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------


    function link( scope, elem, attr, iscTableRowCtrl ){//jshint ignore:line

      // ----------------------------
      // vars
      // ----------------------------

      scope.iscRowCtrl     = iscTableRowCtrl;
      scope.displayUnit    = scope.cellData[ scope.cellConfig.unit ];
      scope.state          = $state.current.name;
      scope.getTrClass     = getTrClass;
      scope.getDisplayText = getDisplayText;
      scope.notThere       = notThere;

      var cellData      = scope.cellData[ scope.cellConfig.key ];
      var defaultText   = scope.cellConfig.default;
      scope.displayText = getDisplayText( cellData, defaultText );


      // ----------------------------
      // functions
      // ----------------------------

      function getTrClass( item ){
        if( scope.cellConfig.className ){
          return scope.cellConfig.className;
        }
        else if( scope.cellConfig.classGetter ){
          return scope.cellConfig.classGetter( item );
        }
        else {
          return '';
        }
      }

      function getDisplayText( cellData, defaultText ){

        var retVal;
        if( scope.notThere( cellData ) && scope.notThere( defaultText ) ){
          retVal = 'ISC_NA'
        }
        else if( scope.notThere( cellData ) ){
          retVal = String( defaultText );
        }
        else {
          retVal = String( cellData );
        }

        return retVal;
      }

      function notThere( val ){
        return !val && val !== 0;
      }

    }
  }

  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'isc.common' )
    .directive( 'iscTableCell', iscTableCell );

})();
