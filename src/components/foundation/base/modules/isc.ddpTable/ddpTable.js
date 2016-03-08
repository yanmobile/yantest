/**
 * Created by hzou on 1/13/16.
 */

/**
 * Configuration:
 *
 * {
      title   : 'Sortable table by ddpTable',
      sortable: true,
      columns : [
        { key: 'Salads', model: 'Salads', sortable: false },
        { key: 'Entrees', model: 'Entrees', type: 'string' },
        { key: 'Desserts', model: 'Desserts', cssTHClass: 'grid-block th', cssTDClass: 'grid-block td'  },
        { key: 'Soups', model: 'Soups' },
        { key: 'Customer', model: 'Customer.Name' },
        { key: 'Order Time', model: 'Customer.Date', type: 'date' },
        { key: 'Age', model: 'Customer.DOB', type: 'integer', templateUrl: 'ddpTable/cells/cell.age.html' }
      ]
    }
 */
(function () {
  'use strict';

  angular.module('isc.ddpTable')
    .directive('ddpTable', ddpTable);


  function ddpTable() {//jshint ignore:line

    // ----------------------------
    // class factory
    // ----------------------------
    var directive = {
      restrict        : 'EA',
      controller      : controller,
      controllerAs    : 'ddpTblCtrl',
      bindToController: {
        config: '=',
        data  : '='
      },
      scope           : true,
      templateUrl     : function (elem, attrs) {
        return attrs.templateUrl || 'isc.ddpTable/ddpTable.html';
      }
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------
    function controller() {
      var self = this;

      angular.extend(self, {
        sort   : sort,
        getSort: getSort
      });

      /*========================================
       =                 private               =
       ========================================*/
      /**
       * Place the specfied column as sort column
       * sortDirection: true => asc
       * sortDirection: false => desc
       * @param column
       *
       */
      function sort(column) {
        if (self.sortBy !== column.model) {
          self.sortBy        = column.model;
          self.sortDirection = false;
        } else { //asc => desc
          self.sortDirection = !self.sortDirection;
        }
      }

      /**
       * Gets the state of the sort for the specified column
       * @param column
       * @return null = not sorted, 'asc' = ascending, 'desc' = descending
       */
      function getSort(column) {
        var sortState = null;
        if (self.sortBy === column.model) {
          sortState = self.sortDirection ? 'asc' : 'desc';
        }
        return sortState;
      }
    }

  }//END CLASS

})();
