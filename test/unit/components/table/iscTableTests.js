(function () {
  'use strict';
  //console.log( 'iscTable Tests' );

  describe('iscTable', function () {
    var $rootScope,
        isolateScope,
        httpBackend,
        timeout,
        element,
        state, $rootScope, $compile;

    var tableConfig = {
      key           : 'LabOrders',
      title         : '',
      backButtonText: 'back',
      editable      : false,

      columns: [{
        key  : 'OrderedItemDisplay',
        title: 'ISC_WELLNESS_LAB_NAME'
      },
        {
          key  : 'Timestamp',
          title: 'ISC_WELLNESS_LAB_DATE',
          type : 'date'
        }]
    };

    var tableData = {
      "LabOrders": [{
        "OrderedItemDisplay": "BASIC METABOLIC PANEL",
        "ResultItems"       : [
          {
            "ResultValue"     : 141,
            "ResultValueUnits": "MEQ/L",
            "Test"            : "SODIUM"
          },
          {
            "ResultValue"     : 3.9,
            "ResultValueUnits": "MEQ/L",
            "Test"            : "POTASSIUM"
          }
        ],
        "Timestamp"         : "2012-11-09 05:06:00"
      }
      ]
    };

    var tableData2 = {
      "LabOrders": [
        {
          "OrderedItemDisplay": "BASIC METABOLIC PANEL",
          "ResultItems"       : [
            {
              "ResultValue"     : 141,
              "ResultValueUnits": "MEQ/L",
              "Test"            : "SODIUM"
            },
            {
              "ResultValue"     : 3.9,
              "ResultValueUnits": "MEQ/L",
              "Test"            : "POTASSIUM"
            }
          ],
          "Timestamp"         : "2012-11-09 05:06:00"
        },
        {
          "OrderedItemDisplay": "BASIC FOOBAR PANEL",
          "ResultItems"       : [
            {
              "ResultValue"     : 141,
              "ResultValueUnits": "MEQ/L",
              "Test"            : "SODIUM"
            },
            {
              "ResultValue"     : 3.9,
              "ResultValueUnits": "MEQ/L",
              "Test"            : "POTASSIUM"
            }
          ],
          "Timestamp"         : "2012-11-09 05:06:00"
        },
        {
          "OrderedItemDisplay": "BASIC WHATEVER",
          "ResultItems"       : [
            {
              "ResultValue"     : 141,
              "ResultValueUnits": "MEQ/L",
              "Test"            : "SODIUM"
            },
            {
              "ResultValue"     : 3.9,
              "ResultValueUnits": "MEQ/L",
              "Test"            : "POTASSIUM"
            }
          ],
          "Timestamp"         : "2012-11-09 05:06:00"
        }
      ]
    };

    var html = '<isc-table template-url="fakeTable.html" table-config="tableConfig"' +
      'table-data="tableData"' +
      'back-button-callback="backButtonCallback()"' +
      'row-button-callback="rowButtonCallback( state )">' +
      '</isc-table>';

    beforeEach(module('isc.table'));

    // this loads all the external templates used in directives etc
    // eg, everything in templates/**/*.html
    beforeEach(module('isc.templates'));

    // show $log statements
    beforeEach(module(function ($provide) {
      $provide.value('$log', console);
    }));
    // setup devlog
    beforeEach(module('isc.core', function (devlogProvider) {
      devlogProvider.loadConfig(customConfig);
    }));


    beforeEach(inject(function (_$rootScope_, _$compile_, $httpBackend, $state, $timeout, _$templateCache_) {
      $rootScope = _$rootScope_;
      $compile   = _$compile_;

      $rootScope.tableConfig = tableConfig;
      $rootScope.tableData   = tableData;

      state         = $state;
      state.current = {
        name: 'tableTests'
      };

      $rootScope.backButtonCallback = function () {
      };

      $rootScope.rowButtonCallback = function () {
      };

      httpBackend = $httpBackend;
      timeout     = $timeout;

      _$templateCache_.put('fakeTable.html', '<div ng-repeat"dataItem in iscTblCtrl.tableRows" class="row"> </div>');

      compile();
    }));

    function compile() {
      element      = $compile(html)($rootScope);

      $rootScope.$digest();
      isolateScope = element.isolateScope();
    };

    // -------------------------
    describe('setup tests ', function () {

      it("should have a table config", function () {
        expect(angular.isObject(isolateScope.iscTblCtrl.tableConfig)).toBe(true);
      });

      it("should have table data", function () {
        expect(angular.isObject(isolateScope.iscTblCtrl.tableData)).toBe(true);
      });

    });

    // -------------------------
    describe('tableData change tests ', function () {

      it("should updated table data", function () {

        $rootScope.tableData = tableData;
        $rootScope.$digest();
        expect(isolateScope.iscTblCtrl.tableRows.length).toBe(1);

        $rootScope.tableData = tableData2;
        $rootScope.$digest();
        expect(isolateScope.iscTblCtrl.tableRows.length).toBe(3);
      });

    });

    // -------------------------
    describe('table pagination tests ', function () {

      it("should have a default of 15 rowsOnPage", function () {
        expect(isolateScope.iscTblCtrl.rowsOnPage).toBe(15);
      });

      it("should chage rowsOnPage if you add number to config", function () {
        $rootScope.tableConfig.rowsOnPage = 20;
        compile();

        expect(isolateScope.iscTblCtrl.rowsOnPage).toBe(20);
      });

      it("should start on page one", function () {
        expect(isolateScope.iscTblCtrl.currentPage).toBe(1);
      });

      it("should have a function changePage", function () {
        expect(angular.isFunction(isolateScope.iscTblCtrl.changePage)).toBe(true);
      });

      it("should change the page when you pass in a new page number", function () {
        isolateScope.iscTblCtrl.changePage(2);
        expect(isolateScope.iscTblCtrl.currentPage).toBe(2);
      });

    });

    describe('table sorting tests ', function () {

      it("should start with unreversed sort order", function () {
        expect(isolateScope.iscTblCtrl.sortField).toEqual({ reverse: false });
      });

      it("should have a function sortColumn", function () {
        expect(angular.isFunction(isolateScope.iscTblCtrl.sortColumn)).toBe(true);
      });

      it("should change the sort field to the column you pass in without reversing", function () {
        isolateScope.iscTblCtrl.sortColumn(tableConfig.columns[0]);
        expect(isolateScope.iscTblCtrl.sortField).toEqual({ reverse: false, name: 'OrderedItemDisplay' });
      });

      it("should reverse the next time called", function () {
        isolateScope.iscTblCtrl.sortColumn(tableConfig.columns[1]);
        isolateScope.iscTblCtrl.sortColumn(tableConfig.columns[1]);
        expect(isolateScope.iscTblCtrl.sortField).toEqual({ reverse: true, name: 'Timestamp' });
      });

    });

    describe('callback function tests ', function () {

      it("should have a function rowButtonCallback", function () {
        expect(angular.isFunction(isolateScope.iscTblCtrl.rowButtonCallback)).toBe(true);
      });

      it("should call rowButtonCallback", function () {
        spyOn($rootScope, 'rowButtonCallback');
        isolateScope.iscTblCtrl.rowButtonCallback({ state: 'test' });

        expect($rootScope.rowButtonCallback).toHaveBeenCalledWith('test');
      });

      it("should have a function backButtonCallback", function () {
        expect(angular.isFunction(isolateScope.iscTblCtrl.backButtonCallback)).toBe(true);
      });

      it("should call backButtonCallback", function () {
        spyOn($rootScope, 'backButtonCallback');
        isolateScope.iscTblCtrl.backButtonCallback();

        expect($rootScope.backButtonCallback).toHaveBeenCalled();
      });

    });

  });
})();