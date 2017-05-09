/**
 * Created by hzou on 6/18/16.
 */

(function() {

  describe( 'isc.fauxTable directive', function() {
    var suite;

    // show $log statements
    beforeEach( module( function( $provide ) {
      $provide.value( '$log', mock$log );
    } ) );

    // setup devlog
    beforeEach( module( 'pascalprecht.translate', 'isc.core', function( devlogProvider ) {
      devlogProvider.loadConfig( customConfig );
    } ) );

    beforeEach( module( 'isc.fauxTable', 'isc.templates' ) );

    beforeEach( inject( function( $rootScope, $compile ) {
      suite                         = window.createSuite();
      suite.$compile                = $compile;
      suite.$scope                  = $rootScope;
      suite.$scope.config           = getTableConfig();
      suite.$scope.data             = getTableData();
      suite.$scope.resultsAvailable = 4;
    } ) );

    function compile() {
      var html      = "<faux-table config='config' data='data' results-available='resultsAvailable'></faux-table>";
      suite.element = suite.$compile( html )( suite.$scope );
      suite.$scope.$digest();
      suite.$isolateScope = suite.element.isolateScope();
      suite.controller    = suite.$isolateScope.fauxTblCtrl;
    }

    describe( 'set setup', function() {
      it( 'should have right dependencies', function() {
        compile();
        expect( suite.$scope ).toBeDefined();
        expect( suite.element ).toBeDefined();
        expect( suite.$isolateScope ).toBeDefined();
        expect( suite.controller ).toBeDefined();
        expect( suite.controller.changePageNumber ).toBeDefined();
      } );
    } );

    describe( 'table client-side sorting', function() {
      beforeEach( function() {
        compile();
      } );

      it( 'should first sort ASC', function() {
        var column = { model: "Source" };
        suite.controller.sort( column );
        expect( suite.controller.sortBy ).toBe( column );
        expect( suite.controller.sortReverse ).toBe( false );
      } );

      it( 'should change sort to DESC sorting column is already sorted asc', function() {
        var column                   = { model: "Source" };
        suite.controller.sortBy      = column;
        suite.controller.sortReverse = false;
        suite.controller.sort( column );
        expect( suite.controller.sortBy ).toBe( column );
        expect( suite.controller.sortReverse ).toBe( true );
      } );

      it( 'should change to ASC when column is sorted by DESC', function() {
        var column                   = { model: "Source" };
        suite.controller.sortBy      = column;
        suite.controller.sortReverse = true;
        suite.controller.sort( column );
        expect( suite.controller.sortBy ).toBe( column );
        expect( suite.controller.sortReverse ).toBe( false );
      } );

      it( 'sort asc ', function() {
        compile();
        var column = { model: "Source" };

        _.set(suite, "$scope.data[1].Source", 'BCD3' );
        _.set(suite, "$scope.data[0].Source", 'BCD' );
        _.set(suite, "$scope.data[2].Source", 'ABC' );

        suite.controller.sort( column );
        suite.$scope.$digest();

        expect( suite.$scope.data[0].Source ).toBe( 'ABC' );
        expect( suite.$scope.data[1].Source ).toBe( 'BCD' );
        expect( suite.$scope.data[2].Source ).toBe( 'BCD3' );

      } );

      it( 'sort desc ', function() {
        compile();
        var column = { model: "Source" };

        expect( suite.$scope.data[0].Source ).toBe( 'ABC' );
        expect( suite.$scope.data[1].Source ).toBe( 'BCD' );

        suite.controller.sortBy      = column;
        suite.controller.sortReverse = false;
        suite.controller.sort( column );
        suite.$scope.$digest();

        expect( suite.$scope.data[0].Source ).toBe( 'BCD' );
        expect( suite.$scope.data[1].Source ).toBe( 'ABC' );

      } );

    } );

    describe( 'table server-side sorting', function() {
      var taskColumn;
      beforeEach( function() {
        compile();
        taskColumn = _.find( suite.$scope.config.columns, { model: 'TaskId' } );
      } );

      it( 'should invoke config.pager.onSort DESC', function() {
        expect( suite.$scope.data[0].Source ).toBe( 'ABC' );
        expect( suite.$scope.data[1].Source ).toBe( 'BCD' );
        spyOn( taskColumn, "onSort" ).and.callThrough();
        suite.controller.sort( taskColumn );

        expect( taskColumn.onSort ).toHaveBeenCalledWith( suite.controller.data, jasmine.objectContaining( taskColumn ), false );
        expect( suite.$scope.data[0].Source ).toBe( 'BCD' );
        expect( suite.$scope.data[1].Source ).toBe( 'ABC' );
      } );

      it( 'should invoke config.pager.onSort ASC', function() {
        expect( suite.$scope.data[0].Source ).toBe( 'ABC' );
        expect( suite.$scope.data[1].Source ).toBe( 'BCD' );
        spyOn( taskColumn, "onSort" ).and.callThrough();
        suite.controller.sortBy      = taskColumn;
        suite.controller.sortReverse = false;
        suite.controller.sort( taskColumn );

        expect( taskColumn.onSort ).toHaveBeenCalledWith( suite.controller.data, jasmine.objectContaining( taskColumn ), true );

        expect( suite.$scope.data[0].Source ).toBe( 'ABC' );
        expect( suite.$scope.data[1].Source ).toBe( 'BCD' );
      } );

    } );

    describe( 'table title', function() {
      beforeEach( function() {
        compile();
      } );

      it( 'should use config.title as the table title', function() {
        expect( suite.element.find( 'h3' ).text() ).toBe( 'my page title' );
      } );

    } );

    describe( 'table getSort', function() {
      beforeEach( function() {
        compile();
      } );

      it( 'should return null if column is not sorted', function() {
        var column                   = { model: "Source" };
        suite.controller.sortBy      = "Jane Doe";
        suite.controller.sortReverse = true;
        var actual                   = suite.controller.getSort( column );
        expect( actual ).toBe( null );
      } );

      it( 'should return "asc" if column is sorted asc', function() {
        var column                   = { model: "Source" };
        suite.controller.sortBy      = column;
        suite.controller.sortReverse = true;
        var actual                   = suite.controller.getSort( column );
        expect( actual ).toBe( 'desc' );
      } );

      it( 'should return "desc" if column is sorted asc', function() {
        var column                   = { model: "Source" };
        suite.controller.sortBy      = column;
        suite.controller.sortReverse = false;
        var actual                   = suite.controller.getSort( column );
        expect( actual ).toBe( 'asc' );
      } );

    } );

    describe( 'table server pagination - changePageNumber', function() {
      it( 'should invoke config.pager.onPageChange() if it is server paging', function() {
        compile();

        spyOn( suite.$scope.config.pager, "onPageChange" ).and.callThrough();
        var column                   = { model: "Source" };
        suite.controller.sortBy      = column;
        suite.controller.sortReverse = false;

        suite.controller.changePageNumber( 2 );
        suite.$scope.$digest();

        expect( suite.$scope.config.pager.onPageChange ).toHaveBeenCalledWith( 2, column, false );

      } );


      it( 'should NOT invoke config.pager.onPageChange() if it NOT server paging', function() {
        suite.$scope.config.pager.server = false;
        compile();


        spyOn( suite.$scope.config.pager, "onPageChange" ).and.callThrough();

        suite.controller.changePageNumber( 2 );
        suite.$scope.$digest();

        expect( suite.$scope.config.pager.onPageChange ).not.toHaveBeenCalled();

      } );

      it( 'should update data through parent scope ', function() {
        compile();

        expect( suite.$scope.data[0].Source ).toBe( 'ABC' );
        expect( suite.$scope.data[1].Source ).toBe( 'BCD' );

        spyOn( suite.$scope.config.pager, "onPageChange" ).and.callThrough();

        suite.controller.changePageNumber( 2 );
        suite.$scope.$digest();

        expect( suite.$scope.data[0].Source ).toBe( 'DEF' );
        expect( suite.$scope.data[1].Source ).toBe( 'CDE' );

      } );

      it ('should reset the current page to 1 when sorting', function () {
        compile();

        spyOn( suite.$scope.config.pager, "onPageChange" ).and.callThrough();
        var column                   = { model: "Source" };
        suite.controller.sortBy      = column;
        suite.controller.sortReverse = false;

        suite.controller.changePageNumber( 2 );
        suite.$scope.$digest();

        expect( suite.controller.currentPage ).toBe( 2 );

        suite.controller.sort( 'Date' );
        suite.$scope.$digest();
        expect( suite.controller.currentPage ).toBe( 1 );
      });

    } );

    function getTableData() {
      return [{
        Source : "ABC",
        TaskId : 100,
        Summery: "Summary 2",
        Date   : moment( "2012-2-28" )
      }, {
        Source : "BCD",
        TaskId : 55,
        Summery: "Summary 3",
        Date   : moment( "2016-10-15" )
      }];
    }

    function getPage2Data() {
      return [{
        Source : "DEF",
        TaskId : 9,
        Summery: "Summary 4",
        Date   : moment( "2012-4-6" )
      }, {
        Source : "CDE",
        TaskId : 12,
        Summery: "Summary 5",
        Date   : moment( "2012-7-8" )
      }];
    }

    function getTableConfig() {
      var config = {
        title  : "my page title",
        pager  : {
          itemsPerPage: 2,
          server      : true,
          onPageChange: function( page, column, sortReverse ) {
            suite.$scope.data = getPage2Data();
            suite.controller.currentPage = page;
          }
        },
        columns: [
          { key: 'Source', model: 'Source' },
          { key: 'Task Id', model: 'TaskId', onSort: onSort },
          { key: 'Summary', model: 'Summary' },
          { key: 'Date', model: 'Date', type: 'date' }
        ]
      };

      return config;
    }

    function onSort( data, column, direction ) {
      return direction ? data : data.reverse();
    }
  } );
})();