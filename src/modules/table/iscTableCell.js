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
      scope.displayText = scope.cellData[scope.cellConfig.key] || scope.cellConfig.default;
      scope.displayText = scope.displayText.toString(); // cast as a string; translate fails on numbers
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
      }

    }
  }

  // ----------------------------
  // inject
  // ----------------------------

   angular.module( 'isc.common' )
     .directive( 'iscTableCell', iscTableCell );

 })();
