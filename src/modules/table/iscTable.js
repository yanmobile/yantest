/**
 * Created by Trevor Hudson on 06/02/15.
 *
 * --------------------------------------
 * sample config
 * --------------------------------------
 *
 var labOrdersConfig = {
    key: 'LabOrders', // if the data is part of a larger set, this is the key, if not, leave blank
    title: '',
    rowsOnPage: 20,
    backButtonText: 'Go Back'

    columns: [{
      key: 'OrderedItemDisplay',
      title: 'ISC_WELLNESS_LAB_NAME',
      type: 'buttonWithSref',
      sref: 'route.index',
      className: 'class-name'
    },
    {
      key: 'Timestamp',
      title: 'ISC_WELLNESS_LAB_DATE',
      classGetter: function(){},
      type: 'date'
    },
    {
      key: 'Timestamp',
      title: 'ISC_WELLNESS_LAB_DATE',
      type: 'buttonWithCallback',
      callback: function(){}
    }],

    buttons: [{
      key: 'chart',
      title: 'ISC_WELLNESS_CHART',
      icon: 'svg/isc-chart-blue.html'
    },
    {
      key: 'details',
      title: 'ISC_WELLNESS_DETAILS',
      icon: 'svg/isc-arrow-right-blue.html'
    }]
  };

 * --------------------------------------
 * sample getter for classes -
 * use when different <td>'s in the same column need different classes
 * --------------------------------------
 *
 * function getButtonClass( type ){
      switch( type ){
        case 'APPROVAL':
          return 'cmc-approval-pill';

        case 'REVIEW':
          return 'cmc-review-pill';

        case 'DRAFT':
        default:
          return 'cmc-draft-pill';
      }
    }
 *
 * --------------------------------------
 * sample html
 * --------------------------------------
 *
 * <isc-table table-config="homeCtrl.model.getDashboardTableConfig()"
 table-data="homeCtrl.model.getHomePageData()">
 </isc-table>
 *
 *
 */
(function(){
  'use strict';

  iscTable.$inject = ['$log'];

  function iscTable( $log ){
    //$log.debug('iscTable.LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------

    var directive = {
      scope: {
        tableConfig: '=',
        tableData: '=',
        rowButtonCallback: '&?',
        backButtonCallback: '&?'
      },

      restrict: 'E',
      replace: true,
      templateUrl: 'table/iscTable.html',
      link: link
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------
    function link( scope, elem, attr, ctrl ){//jshint ignore:line
      //$log.debug( 'iscTable.link, tableConfig', scope.tableConfig );
      //$log.debug( '...tableData', scope.tableData );

      scope.rowsOnPage = scope.tableConfig.rowsOnPage || 15;
      scope.currentPage = 1;

      // set an array of the table row objects
      scope.tableRows = scope.tableConfig.key ? scope.tableData[ scope.tableConfig.key ] : scope.tableData;

      scope.sortField = { reverse: false };

      scope.sortColumn = function( column ) {
        if (scope.sortField.name === column.key) {
          scope.sortField.reverse = !scope.sortField.reverse;
        };

        scope.sortField.name = column.key;
      };

      scope.changePage = function(newPageNumber){
        scope.currentPage = newPageNumber;
      };

    }
  }

  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'isc.common' )
      .directive( 'iscTable', iscTable );

})();
