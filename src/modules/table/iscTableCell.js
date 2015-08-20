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
      scope       : true, //prototypal inheritance
      restrict    : 'EA',
      templateUrl : 'table/iscTableCell.html',
      link        : link,
      controller  : controller,
      controllerAs: "iscCellCtrl"
    };
    return directive;

    // ----------------------------
    // functions
    // ----------------------------

    function controller(){ //needed to use with controllerAs
    }


    function link( scope, elem, attrs ){//jshint ignore:line

      // ----------------------------
      // vars
      // ----------------------------
      scope.notThere       = notThere;
      scope.getTrClass     = getTrClass;
      scope.getDisplayText = getDisplayText;

      scope.mobileClass = scope.$eval( attrs.mobileClass );

      scope.state       = $state.current.name;
      var cellData      = scope.dataItem[ scope.column.key ];
      var defaultText   = scope.column.default;
      scope.displayText = getDisplayText( cellData, defaultText ); //getDisplayText( scope.dataItem[ column.key ], column.default );
      scope.displayUnit = scope.dataItem[scope.column.unit];

      // ----------------------------
      // functions
      // ----------------------------

      function getTrClass( item ){
        if( scope.column.className ){
          return scope.column.className;
        }
        else if( scope.column.classGetter ){
          return scope.column.classGetter( item );
        }
        else {
          return '';
        }
      }

      function getDisplayText(){

        var cellData = _.get( scope.dataItem, scope.column.key );
        var defaultText = scope.column.default;

        if( scope.column.textGetter ){
          return scope.column.textGetter( scope.dataItem );
        }

        var retVal;
        if( scope.notThere( cellData ) && scope.notThere( defaultText ) ){
          retVal = ''
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
