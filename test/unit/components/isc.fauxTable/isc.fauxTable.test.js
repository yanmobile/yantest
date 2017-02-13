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

    describe( 'table sort', function() {
      beforeEach( function() {
        compile();
      } );

      it( 'should first sort ASC', function() {
        var column = { model: "John Smith" };
        suite.controller.sort( column );
        expect( suite.controller.sortBy ).toBe( column.model );
        expect( suite.controller.sortDirection ).toBe( false );
      } );

      it( 'should change sort to DESC sorting an pre-sorted column', function() {
        var column                     = { model: "John Smith" };
        suite.controller.sortBy        = column.model;
        suite.controller.sortDirection = false;
        suite.controller.sort( column );
        expect( suite.controller.sortBy ).toBe( column.model );
        expect( suite.controller.sortDirection ).toBe( true );
      } );

      it( 'should change to ASC when column is sorted by DESC', function() {
        var column                     = { model: "John Smith" };
        suite.controller.sortBy        = column.model;
        suite.controller.sortDirection = true;
        suite.controller.sort( column );
        expect( suite.controller.sortBy ).toBe( column.model );
        expect( suite.controller.sortDirection ).toBe( false );
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
        var column                     = { model: "John Smith" };
        suite.controller.sortBy        = "Jane Doe";
        suite.controller.sortDirection = true;
        var actual                     = suite.controller.getSort( column );
        expect( actual ).toBe( null );
      } );

      it( 'should return "asc" if column is sorted asc', function() {
        var column                     = { model: "John Smith" };
        suite.controller.sortBy        = "John Smith";
        suite.controller.sortDirection = true;
        var actual                     = suite.controller.getSort( column );
        expect( actual ).toBe( 'asc' );
      } );

      it( 'should return "desc" if column is sorted asc', function() {
        var column                     = { model: "John Smith" };
        suite.controller.sortBy        = "John Smith";
        suite.controller.sortDirection = false;
        var actual                     = suite.controller.getSort( column );
        expect( actual ).toBe( 'desc' );
      } );

    } );

    describe( 'table server pagination - changePageNumber', function() {
      it( 'should invoke config.pager.onPageChange() if it is server paging', function() {
        compile();

        spyOn( suite.$scope.config.pager, "onPageChange" ).and.callThrough();

        suite.controller.changePageNumber( 2 );
        suite.$scope.$digest();

        expect( suite.$scope.config.pager.onPageChange ).toHaveBeenCalledWith( 2 );

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

        expect( suite.$scope.data[0].Source ).toBe( '12345' );
        expect( suite.$scope.data[1].Source ).toBe( '3DB3-123A-B889' );

        spyOn( suite.$scope.config.pager, "onPageChange" ).and.callThrough();

        suite.controller.changePageNumber( 2 );
        suite.$scope.$digest();

        expect( suite.$scope.data[0].Source ).toBe( '33344' );
        expect( suite.$scope.data[1].Source ).toBe( 'NPPES' );

      } );

    } );

    function getTableData() {
      return [{
        Source : "12345",
        TaskId : 100,
        Summery: "Summary 2",
        Date   : moment( "2012-2-28" )
      }, {
        Source : "3DB3-123A-B889",
        TaskId : 55,
        Summery: "Summary 3",
        Date   : moment( "2016-10-15" )
      }];
    }

    function getPage2Data() {
      return [{
        Source : "33344",
        TaskId : 9,
        Summery: "Summary 4",
        Date   : moment( "2012-4-6" )
      }, {
        Source : "NPPES",
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
          onPageChange: function( page ) {
            suite.$scope.data = getPage2Data();
          }
        },
        columns: [
          { key: 'Source', model: 'Source' },
          { key: 'Task Id', model: 'TaskId', sortAs: 'number' },
          { key: 'Summary', model: 'Summary' },
          { key: 'Date', model: 'Date', type: 'date', sortAs: 'date' }
        ]
      };

      return config;
    }

  } );
})();