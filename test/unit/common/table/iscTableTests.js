
(function(){
  'use strict';
  //console.log( 'iscTable Tests' );

  describe('iscTable', function(){
    var scope,
      rootScope,
      helper,
      isolateScope,
      httpBackend,
      timeout,
      element,
      state;

    var tableConfig = {
      key: 'LabOrders',
      title: '',
      backButtonText: 'back',

      columns: [{
        key: 'OrderedItemDisplay',
        title: 'ISC_WELLNESS_LAB_NAME'
      },
      {
        key: 'Timestamp',
        title: 'ISC_WELLNESS_LAB_DATE',
        type: 'date'
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

    var tableData = {
      "LabOrders": [{
        "OrderedItemDisplay": "BASIC METABOLIC PANEL",
        "ResultItems": [
          {
            "ResultValue": 141,
            "ResultValueUnits": "MEQ/L",
            "Test": "SODIUM"
          },
          {
            "ResultValue": 3.9,
            "ResultValueUnits": "MEQ/L",
            "Test": "POTASSIUM"
          }
        ],
        "Timestamp": "2012-11-09 05:06:00",
      }]
    }

    var html =  '<isc-table table-config="tableConfig"' +
                  'table-data="tableData"' +
                  'back-button-callback="backButtonCallback()"' +
                  'row-button-callback="rowButtonCallback( state )">' +
                '</isc-table>';

    beforeEach( module('isc.common'));

    // this loads all the external templates used in directives etc
    // eg, everything in templates/**/*.html
    beforeEach( module('isc.templates') );

    // show $log statements
    beforeEach( module(  function( $provide ){
      $provide.value('$log', console);
    }));

    beforeEach( inject( function( $rootScope, $compile, $httpBackend, $state, $timeout ){
      rootScope = $rootScope;

      scope = $rootScope.$new();

      scope.tableConfig = tableConfig;
      scope.tableData = tableData;

      state = $state;
      state.current = {
        name: 'tableTests'
      };

      scope.backButtonCallback = function(){
      };

      scope.rowButtonCallback = function(){
      };

      httpBackend = $httpBackend;
      timeout = $timeout;

      // dont worry about calls to assets
      httpBackend.when( 'GET', 'assets/i18n/en_US.json' )
        .respond( 200, {} );

      element = $compile( html )( scope );
      scope.$digest();

      isolateScope = element.isolateScope();
    }));

    function compile(){
      inject( function( $rootScope, $compile ){
        element = $compile( html )( scope );
        scope.$digest();
        isolateScope = element.isolateScope();
      })
    };

    // -------------------------
    describe( 'setup tests ', function(){

      it("should have a table config", function() {
        expect( angular.isObject(isolateScope.tableConfig) ).toBe( true );
      });

      it("should have table data", function() {
        expect( angular.isObject(isolateScope.tableData) ).toBe( true );
      });

    });

    // -------------------------
    describe( 'table pagination tests ', function(){

      it("should have a default of 15 rowsOnPage", function() {
        expect( isolateScope.rowsOnPage ).toBe( 15 );
      });

      it("should chage rowsOnPage if you add number to config", function() {
        scope.tableConfig.rowsOnPage = 20;
        compile();

        expect( isolateScope.rowsOnPage ).toBe( 20 );
      });

      it("should start on page one", function() {
        expect( isolateScope.currentPage ).toBe( 1 );
      });

      it("should have a function changePage", function() {
        expect( angular.isFunction(isolateScope.changePage) ).toBe( true );
      });

      it("should change the page when you pass in a new page number", function() {
        isolateScope.changePage( 2 );
        expect( isolateScope.currentPage ).toBe( 2 );
      });

    });

    describe( 'table sorting tests ', function(){

      it("should start with unreversed sort order", function() {
        expect( isolateScope.sortField ).toEqual( { reverse: false } );
      });

      it("should have a function sortColumn", function() {
        expect( angular.isFunction(isolateScope.sortColumn) ).toBe( true );
      });

      it("should change the sort field to the column you pass in without reversing", function() {
        isolateScope.sortColumn( tableConfig.columns[0] );
        expect( isolateScope.sortField ).toEqual( { reverse: false, name: 'OrderedItemDisplay' } );
      });

      it("should reverse the next time called", function() {
        isolateScope.sortColumn( tableConfig.columns[1] );
        isolateScope.sortColumn( tableConfig.columns[1] );
        expect( isolateScope.sortField ).toEqual( { reverse: true, name: 'Timestamp' } );
      });

    });

    describe( 'callback function tests ', function(){

      it("should have a function rowButtonCallback", function() {
        expect( angular.isFunction(isolateScope.rowButtonCallback) ).toBe( true );
      });

      it("should call rowButtonCallback", function() {
        spyOn( scope, 'rowButtonCallback' );
        isolateScope.rowButtonCallback( {state: 'test' } );

        expect( scope.rowButtonCallback ).toHaveBeenCalledWith( 'test' );
      });

      it("should have a function backButtonCallback", function() {
        expect( angular.isFunction(isolateScope.backButtonCallback) ).toBe( true );
      });

      it("should call backButtonCallback", function() {
        spyOn( scope, 'backButtonCallback' );
        isolateScope.backButtonCallback();

        expect( scope.backButtonCallback ).toHaveBeenCalled();
      });

    });

  });
})();

