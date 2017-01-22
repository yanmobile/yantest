(function() {
  'use strict';

  describe( 'iscFormsCodeTableApi', function() {
    var suite;

    describe( 'default config', function() {
      init();

      describe( 'iscFormsCodeTableApi', function() {
        it( 'should have revealed functions', function() {
          expect( _.isFunction( suite.iscFormsCodeTableApi.getAsync ) ).toBe( true );
          expect( _.isFunction( suite.iscFormsCodeTableApi.getSync ) ).toBe( true );
        } );
      } );

      describe( 'api.getSync', function() {
        it( 'should return undefined if the code table has not been cached', function() {
          // Then they are queried synchronously from the cache
          var sampleTable = suite.iscFormsCodeTableApi.getSync( 'usStates' );
          expect( sampleTable ).toBeUndefined();
        } );
      } );

      describe( 'api.getAsync with optional orderBy', function() {
        it( 'should order the results if the order param is included', function() {
          suite.iscFormsCodeTableApi.getAsync( 'usStates' ).then( function( response ) {
            expect( response[2] ).toEqual( {
              displayField: 'Arizona',
              value       : 'AZ'
            } );
            expect( response[3] ).toEqual( {
              displayField: 'Arkansas',
              value       : 'AR'
            } );
          } );

          suite.iscFormsCodeTableApi.getAsync( 'usStates', 'value' ).then( function( response ) {
            expect( response[2] ).toEqual( {
              displayField: 'Arkansas',
              value       : 'AR'
            } );
            expect( response[3] ).toEqual( {
              displayField: 'Arizona',
              value       : 'AZ'
            } );
          } );

          suite.$httpBackend.flush();
        } );
      } );

      describe( 'api.getAsync and api.getSync', function() {
        it( 'should get a single code table from the API', function() {
          suite.iscFormsCodeTableApi.getAsync( 'usStates' ).then( function( response ) {
            expect( response.length ).toBe( 50 );

            var sampleTable = suite.iscFormsCodeTableApi.getSync( 'usStates' );
            expect( sampleTable ).toBeDefined();
            expect( _.isArray( sampleTable ) ).toBe( true );
            expect( sampleTable.length ).toEqual( 50 ); // fifty nifty
          } );

          suite.$httpBackend.flush();
        } );
      } );
    } );

    describe( 'alt config', function() {
      describe( 'api.applyResponseTransform using a string', function() {
        init( {
          moduleApi: {
            formCodeTables: {
              responseTransform: 'ListOfCodes'
            }
          }
        } );

        it( 'should transform the code table response', function() {
          suite.iscFormsCodeTableApi.getAsync( 'transformableCodeTable' ).then( function( response ) {
            expect( _.isArray( response ) ).toBe( true );
            expect( response[0] ).toEqual( {
              "name" : "Item 1",
              "value": 1
            } );
          } );

          suite.$httpBackend.flush();
        } );
      } );

      describe( 'api.applyResponseTransform using a function', function() {
        init( {
          moduleApi: {
            formCodeTables: {
              responseTransform: function( response ) {
                return response.ListOfCodes;
              }
            }
          }
        } );

        it( 'should transform the code table response', function() {
          suite.iscFormsCodeTableApi.getAsync( 'transformableCodeTable' ).then( function( response ) {
            expect( _.isArray( response ) ).toBe( true );
            expect( response[0] ).toEqual( {
              "name" : "Item 1",
              "value": 1
            } );
          } );

          suite.$httpBackend.flush();
        } );
      } );
    } );


    function init( config ) {
      useDefaultFormsModules( config );

      mockDefaultFormStates();

      beforeEach( inject( function( iscFormsCodeTableApi,
        iscCustomConfigService,
        $httpBackend ) {

        suite = window.createSuite( {
          iscFormsCodeTableApi  : iscFormsCodeTableApi,
          iscCustomConfigService: iscCustomConfigService,
          $httpBackend          : $httpBackend
        } );

        mockFormResponses( suite.$httpBackend );
      } ) );
    }
  } );


})();
