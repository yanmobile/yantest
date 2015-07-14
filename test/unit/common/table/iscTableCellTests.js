
(function(){
  'use strict';
  //console.log( 'iscTable Tests' );

  describe('iscTableCell', function(){
    var scope,
        rootScope,
        helper,
        isolateScope,
        httpBackend,
        timeout,
        element,
        state;

    var cellConfig = [
      {
        key: 'OrderedItemDisplay',
        title: 'ISC_WELLNESS_LAB_NAME'
      },
      {
        key: 'Timestamp',
        title: 'ISC_WELLNESS_LAB_DATE',
        type: 'date'
      }
    ];

    var cellData = [
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
    ];

    var html =  '<div isc-table-cell ' +
        'cell-data="cellData"' +
        'cell-config="cellConfig"' +
        'mobile-class="isc-text-item">' +
        '</div>';

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

      scope.cellConfig = cellConfig[0];
      scope.cellData = cellData[0];

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

      compile();
    }));

    function compile(){
      inject( function( $rootScope, $compile ){
        element = $compile( html )( scope );
        scope.$digest();
        isolateScope = element.isolateScope();
      })
    }

    // -------------------------
    describe( 'setup tests ', function(){

      it("should have a cellConfig", function() {
        expect( angular.isObject(isolateScope.cellConfig) ).toBe( true );
      });

      it("should have cellData", function() {
        expect( angular.isObject(isolateScope.cellData) ).toBe( true );
      });

      xit("should have mobileClass", function() {
        expect( angular.isObject(isolateScope.mobileClass) ).toBe( true );
      });

    });

    // -------------------------
    describe( 'getTrClass tests ', function(){

      it("should have a getTrClass", function() {
        expect( angular.isFunction(isolateScope.getTrClass) ).toBe( true );
      });

      it("should get the right class, no explicit className, no getter", function() {
        var expected = isolateScope.getTrClass( {} );
        expect( expected ).toBe( '' );
      });

      it("should get the right class, WITH explicit className, no getter", function() {

        cellConfig = [
          {
            key: 'OrderedItemDisplay',
            title: 'ISC_WELLNESS_LAB_NAME',
            className: 'some-class-name'
          },
          {
            key: 'Timestamp',
            title: 'ISC_WELLNESS_LAB_DATE',
            type: 'date'
          }
        ];

        cellData = [
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
        ];

        scope.cellConfig = cellConfig[0];
        scope.cellData = cellData[0];
        compile();

        var expected = isolateScope.getTrClass( {} );
        expect( expected ).toBe( 'some-class-name' );
      });

      it("should get the right class, no explicit className, WITH getter", function() {

        scope.getClass = function(){
          return 'got-the-class'
        };

        cellConfig = [
          {
            key: 'OrderedItemDisplay',
            title: 'ISC_WELLNESS_LAB_NAME',
            classGetter: scope.getClass
          },
          {
            key: 'Timestamp',
            title: 'ISC_WELLNESS_LAB_DATE',
            type: 'date'
          }
        ];

        cellData = [
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
        ];

        scope.cellConfig = cellConfig[0];
        scope.cellData = cellData[0];
        compile();

        var expected = isolateScope.getTrClass( {} );
        expect( expected ).toBe( 'got-the-class' );
      });
    });


    // -------------------------
    describe( 'getDisplayText tests ', function(){

      it("should have a getDisplayText", function() {
        expect( angular.isFunction(isolateScope.getDisplayText) ).toBe( true );
      });

      it("should get the right displayText, getter function", function() {

        var cellData = 'shazam';
        var defaultText = 1234;

        scope.cellConfig =  {
          key: 'OrderedItemDisplay',
          title: 'ISC_WELLNESS_LAB_NAME',
          textGetter: function(){
            return 'foo bar baz';
          }
        };
        compile();

        var expected = isolateScope.getDisplayText( cellData, defaultText );
        expect( expected ).toBe( 'foo bar baz' );
      });

      it("should get the right displayText, neither defined", function() {

        var cellData = '';
        var defaultText = '';

        var expected = isolateScope.getDisplayText( cellData, defaultText );
        expect( expected ).toBe( 'ISC_NA' );
      });

      it("should get the right displayText, cellData defined, string", function() {

        var cellData = 'shazam';
        var defaultText = '';

        var expected = isolateScope.getDisplayText( cellData, defaultText );
        expect( expected ).toBe( cellData );
      });

      it("should get the right displayText, cellData defined, number", function() {

        var cellData = 0;
        var defaultText = '';

        var expected = isolateScope.getDisplayText( cellData, defaultText );
        expect( expected ).toBe( '0' );
      });

      it("should get the right displayText, defaultText defined, string", function() {

        var cellData = '';
        var defaultText = 'shazam';

        var expected = isolateScope.getDisplayText( cellData, defaultText );
        expect( expected ).toBe( 'shazam' );
      });

      it("should get the right displayText, defaultText defined, number", function() {

        var cellData = '';
        var defaultText = 1234;

        var expected = isolateScope.getDisplayText( cellData, defaultText );
        expect( expected ).toBe( '1234' );
      });

      it("should get the right displayText, BOTH defined", function() {

        var cellData = 'shazam'; // cellData should take presidence
        var defaultText = 1234;

        var expected = isolateScope.getDisplayText( cellData, defaultText );
        expect( expected ).toBe( 'shazam' );
      });
    });

    // -------------------------
    describe( 'notThere tests ', function(){

      it("should have a notThere", function() {
        expect( angular.isFunction( isolateScope.notThere )).toBe( true );
      });

      it("should know if something isnt there", function() {
        var expected = isolateScope.notThere( 0 );
        expect( expected ).toBe( false );

        var expected = isolateScope.notThere( 'some string' );
        expect( expected ).toBe( false );

        var expected = isolateScope.notThere( '' );
        expect( expected ).toBe( true );

        var expected = isolateScope.notThere( null );
        expect( expected ).toBe( true );

        var expected = isolateScope.notThere( false );
        expect( expected ).toBe( true );
      });
    });

  });
})();

