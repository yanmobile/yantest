(function() {
  'use strict';

  describe( 'iscVersionApi', function() {
    var suite;

    var mockVersionFile = {
      app : {
        "releaseno": "internal",
        "buildno"  : "2016.0701",
        "codeno"   : "abc678-branch"
      },
      core: {
        "releaseno": "internal",
        "buildno"  : "2016.0701",
        "codeno"   : "abc678-core"
      }
    };

    var errorVersionFile = {
      app : {},
      core: {}
    };

    useDefaultModules( 'isc.core', 'isc.http' );

    beforeEach( inject( function( $httpBackend,
      iscVersionApi, iscHttpapi ) {
      suite = window.createSuite( {
        api         : iscVersionApi,
        httpApi     : iscHttpapi,
        $httpBackend: $httpBackend
      } );
    } ) );


    describe( 'iscVersionApi', function() {
      it( 'should have revealed functions', function() {
        expect( _.isFunction( suite.api.load ) ).toBe( true );
        expect( _.isFunction( suite.api.get ) ).toBe( true );
      } );
    } );

    describe( 'api.load and api.get', function() {
      it( 'should load a the version file from the server', function() {
        spyOn( suite.httpApi, 'get' ).and.callThrough();
        spyOn( suite.api, 'load' ).and.callThrough();
        spyOn( suite.api, 'get' ).and.callThrough();

        mockBackend( suite.$httpBackend );

        suite.api.load();
        suite.$httpBackend.flush();

        expect( suite.httpApi.get ).toHaveBeenCalled();

        var version = suite.api.get();
        expect( version ).toEqual( mockVersionFile );
      } );

      it( 'should load an empty version file on error', function() {
        spyOn( suite.httpApi, 'get' ).and.callThrough();
        spyOn( suite.api, 'load' ).and.callThrough();
        spyOn( suite.api, 'get' ).and.callThrough();

        mockBackend( suite.$httpBackend, true );

        suite.api.load();
        suite.$httpBackend.flush();

        expect( suite.httpApi.get ).toHaveBeenCalled();

        var version = suite.api.get();
        expect( version ).toEqual( errorVersionFile );
      } );
    } );

    function mockBackend( httpBackend, returnError ) {
      if ( returnError ) {
        httpBackend.when( 'GET', 'version.json' )
          .respond( 404, {} );
      }
      else {
        httpBackend.when( 'GET', 'version.json' )
          .respond( 200, mockVersionFile );
      }
    }
  } );

})();