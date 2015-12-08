/**
 * Created by Trevor Hudson on 06/02/15.
 */
(function(){
  'use strict';

  iscTableCell.$inject = [ '$log', '$state', '$templateCache', '$compile' ];

  function iscTableCell( $log, $state, $templateCache, $compile ){
    //$log.debug('iscTableCell.LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------

    var directive = {
      restrict   : 'A',
      compile    : compile
    };
    return directive;

    // ----------------------------
    // functions
    // -----------
    function compile(){
      return {
        pre : pre,
        post: post
      }
    }

    function pre(scope, elem, attrs, iscRowCtrl){
      var defaultTemplate = attrs.templateUrl;
      defaultTemplate     = defaultTemplate || (scope.iscTblCtrl.tableConfig.editable === 'popup' ? "table/popup/iscTableReadOnlyCell.html" : 'table/iscTableCell.html');

      var rowTemplate = _.get(scope, 'iscTblCtrl.tableConfig.rowTemplate', defaultTemplate);

      if( rowTemplate ){
        //for some reason the template doesn't like spaces nor comments
        var template = $templateCache.get(rowTemplate);
        var output = $compile(template)(scope);
        elem.html(output);
      }
    }
    function post( scope, elem, attrs ){//jshint ignore:line

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
          return scope.column.textGetter( scope.iscRowCtrl.dataItem );
        }

        var retVal;
        if( scope.notThere( cellData ) && scope.notThere( defaultText ) ){
          retVal = '';
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

  angular.module( 'isc.table' )
      .directive( 'iscTableCell', iscTableCell );

})();
