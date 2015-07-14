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
      scope: {
        cellData: '=',
        cellConfig: '=',
        mobileClass: '@?'
      },

      restrict: 'A',
      transclude: false,
      templateUrl: 'table/iscTableCell.html',
      link: link
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------


    function link( scope, elem, attr ){//jshint ignore:line

      scope.displayUnit = scope.cellData[scope.cellConfig.unit];

      scope.state = $state.current.name;

      scope.getTrClass = function( item ){
        if( scope.cellConfig.className ){
          return scope.cellConfig.className;
        }
        else if( scope.cellConfig.classGetter ){
          return scope.cellConfig.classGetter( item );
        }
        else{
          return '';
        }
      };

      scope.getDisplayText = function( cellData, defaultText ){

        if( scope.cellConfig.textGetter ){
          return scope.cellConfig.textGetter( scope.cellData );
        }

        var retVal;
        if( scope.notThere( cellData ) && scope.notThere( defaultText )){
          retVal = 'ISC_NA'
        }
        else if( scope.notThere( cellData )){
          retVal = String( defaultText );
        }
        else{
          retVal = String( cellData );
        }

        return retVal;
      };

      scope.notThere = function( val ){
        return !val && val !== 0;
      };

      var cellData = scope.cellData[scope.cellConfig.key];
      var defaultText = scope.cellConfig.default;
      scope.displayText = scope.getDisplayText( cellData, defaultText );

      //$log.debug( 'cellData', cellData );
      //$log.debug( 'scope.cellConfig.default', scope.cellConfig.default );
      //$log.debug( 'scope.displayText', scope.displayText );

    }
  }

  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'isc.common' )
      .directive( 'iscTableCell', iscTableCell );

})();
