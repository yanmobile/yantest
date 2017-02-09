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

      describe( 'bundling async requests', function() {
        init( {
          moduleApi: {
            formCodeTables: {
              responseTransform: 'ListOfCodes',
              bundlePath       : 'bundledCodeTables',
              bundleRequests   : true
            }
          }
        } );

        it( 'should get multiple code tables with a single request', function() {
          var codeTables = [
            'colors',
            'usStates'
          ];

          spyOn( suite.iscFormsCodeTableApi, 'getAsyncBundle' ).and.callThrough();

          suite.iscFormsCodeTableApi.getAsyncBundle( codeTables ).then( function() {
            expect( suite.iscFormsCodeTableApi.getAsyncBundle ).toHaveBeenCalledWith( codeTables );

            // The requested tables should have been cached
            var statesTable = suite.iscFormsCodeTableApi.getSync( 'usStates' );
            expect( statesTable.length ).toEqual( 50 );

            var colorsTable = suite.iscFormsCodeTableApi.getSync( 'colors' );
            expect( colorsTable.length ).toEqual( 3 );
          } );

          suite.$httpBackend.flush();
        } );
      } );

      describe( 'bundling async requests with a bundle size', function() {
        init( {
          moduleApi: {
            formCodeTables: {
              responseTransform: 'ListOfCodes',
              bundlePath       : 'bundledCodeTables',
              bundleSize       : 1,
              bundleRequests   : true
            }
          }
        } );

        it( 'should get multiple code tables with a single request', function() {
          var mockFdn = {
            form: {
              sections: [
                {
                  fields: [
                    {
                      data: {
                        codeTable: 'colors'
                      }
                    },
                    {
                      data: {
                        codeTable: 'usStates'
                      }
                    }
                  ]
                }
              ]
            }
          };

          var callCount = 0;

          spyOn( suite.iscFormsCodeTableApi, 'getAsyncBundle' ).and.callFake( function() {
            callCount++;
          } );

          suite.iscFormsTemplateService.loadCodeTables( mockFdn ).then( function() {
            expect( callCount ).toBe( 2 );
          } );

          suite.$timeout.flush();
        } );
      } );
    } );


    function init( config ) {
      useDefaultFormsModules( config );

      mockDefaultFormStates();

      beforeEach( inject( function( iscFormsCodeTableApi,
        iscFormsTemplateService,
        iscCustomConfigService,
        $httpBackend,
        $timeout ) {

        suite = window.createSuite( {
          iscFormsCodeTableApi   : iscFormsCodeTableApi,
          iscFormsTemplateService: iscFormsTemplateService,
          iscCustomConfigService : iscCustomConfigService,
          $httpBackend           : $httpBackend,
          $timeout               : $timeout
        } );

        mockFormResponses( suite.$httpBackend );
      } ) );
    }
  } );


})();
