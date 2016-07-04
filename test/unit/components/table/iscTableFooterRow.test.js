(function() {
  'use strict';
  //console.log( 'iscTable Tests' );

  describe( 'iscTableFooterRow', function() {
    var suite;

    var html = '<div isc-table-footer-row ng-form name="iscRowForm"> </div>';

    useDefaultModuleConfig("isc.templates");

    beforeEach( module( 'isc.table' ) );

    beforeEach( inject( function( $rootScope, $compile, $httpBackend, $state, $timeout, $q, $templateCache ) {
      suite = createSuite( {
        rootScope     : $rootScope,
        $q            : $q,
        $rootScope    : $rootScope,
        $scope        : $rootScope.$new(),
        $state        : $state,
        $templateCache: $templateCache,
        $compile      : $compile
      } );

      suite.$scope.iscTblCtrl = {
        tableConfig: getTableConfig(),
        deleteRow  : angular.noop,
        addRow     : angular.noop,
        updateRow  : angular.noop,
        editRow    : angular.noop,
        createRow  : angular.noop
      };

      suite.$scope.dataItem = getDataItems()[0];   //mimicking ng-repeat

      suite.$state.current = {
        name: 'tableTests'
      };

    } ) );

    function compileDirective() {
      suite.element = suite.$compile( html )( suite.$scope );
      suite.$scope.$digest();
      suite.rowScope   = suite.element.scope();
    }

    describe( 'setup test', function() {
      it( 'should have the right properties', function() {
        compileDirective();
        expect( _.isObject( suite.rowScope ) ).toBe( true );
        expect( _.isObject( suite.$scope ) ).toBe( true );
        expect( _.isObject( suite.element ) ).toBe( true );
        expect( _.isObject( suite.$scope.dataItem ) ).toBe( true );
      } );
    } );

    describe( 'preLink', function() {

      it( 'should also accept a custom template', function() {
        var customTemplteUrl = 'myCustomTemlpate.html';
        suite.$templateCache.put( customTemplteUrl, "<div>hello</div>" );

        suite.$scope.iscTblCtrl.tableConfig.footerRowTemplate = 'myCustomTemlpate.html';

        spyOn( suite.$templateCache, 'get' );
        compileDirective();
        expect( suite.$templateCache.get ).toHaveBeenCalledWith( customTemplteUrl );
      } );
    } );
  } );


  function getTableConfig() {
    return {
      key           : 'LabOrders',
      title         : '',
      backButtonText: 'back',
      editable      : true,
      columns       : [
        {
          key  : 'OrderedItemDisplay',
          title: 'ISC_WELLNESS_LAB_NAME'
        },
        {
          key  : 'Timestamp',
          title: 'ISC_WELLNESS_LAB_DATE',
          type : 'date'
        },
        {
          type : 'commands',
          key  : '',
          title: 'Actions'
        }]
    };
  }

  function getDataItems() {
    return [
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
    ];
  }

})();