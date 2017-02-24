/**
 * Created by hzou on 1/13/16.
 */

( function() {
  'use strict';

  /**
   * @ngdoc directive
   * @memberOf isc.fauxTable
   * @description
   * Configuration:
   *
   * {
   *   title   : 'Sortable table by fauxTable',
   *   sortable: true,
   *   pager  : {
   *     server      : true, //required for server side paging
   *     itemsPerPage: 2,
   *     onPageChange: function( page ) { //used with server side paging
   *       self.data = model.getData();
   *     }
   *   },
   *   columns : [
   *     { key: 'Salads', model: 'Salads', sortable: false },
   *     { key: 'Entrees', model: 'Entrees', type: 'string' },
   *     { key: 'Desserts', model: 'Desserts', cssTHClass: 'grid-block th', cssTDClass: 'grid-block td'  },
   *     { key: 'Soups', model: 'Soups' },
   *     { key: 'Customer', model: 'Customer.Name' },
   *     { key: 'Order Time', model: 'Customer.Date', type: 'date', onSort: function(data, column, direction){...} },
   *     { key: 'Age', model: 'Customer.DOB', type: 'integer', templateUrl: 'isc.fauxTable/cells/cell.age.html' }
   *   ]
   * }
   * @returns {{restrict: string, controller: controller, controllerAs: string, bindToController: {config: string, data: string}, scope: boolean, templateUrl: directive.templateUrl}}
   */
  angular.module( 'isc.fauxTable' )
    .component( 'fauxTable', {
      controller  : controller,
      controllerAs: 'fauxTblCtrl',
      bindings    : {
        config          : '=',
        data            : '=',
        resultsAvailable: '<'
      },
      templateUrl : /* @ngInject */ function( $attrs ) {
        return $attrs.templateUrl || 'isc.fauxTable/fauxTable.html';
      }
    } );

  /* @ngInject */
  function controller( $translate, $filter, devlog ) {
    var log = devlog.channel( 'fauxTable' );

    var self = this;
    var pager;

    angular.extend( self, {
      $onChanges: $onChanges,

      sort           : sort,
      getSort        : getSort,
      getEmptyMessage: getEmptyMessage,

      changePageNumber: changePageNumber
    } );

    function changePageNumber( page ) {
      log.logFn( 'changePageNumber' );
      if ( _.get( self, 'config.pager.server' ) ) {
        self.config.pager.onPageChange( page, self.sortBy, self.sortReverse );
      }
    }

    function $onChanges( changes ) {
      log.logFn( '$onChanges' );

      pager             = _.get( changes, "config.pager", {} );
      self.paginationId = 'fauxTable_' + _.camelCase( self.config.title || '' );
      if ( pager.server && !pager.onPageChange ) {
        log.error( 'config.pager.onPageChange is required for server paging' );
      }
    }

    /**
     * Place the specified column as sort column
     * sortReverse: false => asc
     * sortReverse: true => desc
     * @param column
     *
     */
    function sort( column ) {
      if ( self.sortBy !== column ) {
        self.sortBy      = column;
        self.sortReverse = false;
      } else { //asc => desc
        self.sortReverse = !self.sortReverse;
      }

      if ( column.onSort ) {
        // call custom column sort
        column.onSort( self.data, column, self.sortReverse );
      } else {
        self.data = $filter( "orderBy" )( self.data, column.model, self.sortReverse );
      }
    }

    /**
     * Gets the state of the sort for the specified column
     * @param column
     * @return null = not sorted, 'asc' = ascending, 'desc' = descending
     */
    function getSort( column ) {
      var sortState = null;
      if ( self.sortBy === column ) {
        sortState = self.sortReverse ? 'desc' : "asc";
      }
      return sortState;
    }

    /*========================================
     =                 private               =
     ========================================*/

    /**
     * Gets the message to display (if any) when the collection is empty
     */
    function getEmptyMessage() {
      var configuredMessage = _.get( self, 'config.emptyText' );

      return configuredMessage === undefined ?
        $translate.instant( 'No content available' )
        : $translate.instant( configuredMessage );
    }
  }

} )();
