(function() {
  'use strict';

  describe( 'apiHelper', function() {
    var suite;

    var mockConfig = {
      api      : {
        'protocol': 'http',
        'hostname': 'localhost',
        'port'    : 3333,
        'path'    : 'myApi'
      },
      moduleApi: {
        forms: {
          'path': 'someOtherApi/forms'
        }
      }
    };

    var mockConfigRelative = {
      api      : {
        'path': 'myRelativeApi'
      },
      moduleApi: {
        forms: {
          'path': 'someOtherRelativeApi/forms'
        }
      }
    };

    // ---------------------------------
    describe( 'absoluteUrls', function() {
      useDefaultModules( 'isc.core', 'isc.http' );

      loadConfig( mockConfig );

      createApiHelperSuite();

      it( 'should have revealed functions', function() {
        expect( _.isFunction( suite.apiHelper.getUrl ) ).toBe( true );
        expect( _.isFunction( suite.apiHelper.getConfigUrl ) ).toBe( true );
        expect( _.isFunction( suite.apiHelper.getWsUri ) ).toBe( true );
      } );

      it( 'should create the appropriate endpoint', function() {
        var url               = suite.apiHelper.getUrl( 'myUrl' ),
            configUrl         = suite.apiHelper.getConfigUrl( mockConfig.moduleApi.forms ),
            wsUrl             = suite.apiHelper.getWsUri(),
            expectedUrl       = 'http://localhost:3333/myApi/myUrl',
            expectedConfigUrl = 'http://localhost:3333/someOtherApi/forms',
            expectedWsUrl     = 'ws://localhost:3333';

        expect( url ).toEqual( expectedUrl );
        expect( configUrl ).toEqual( expectedConfigUrl );
        expect( wsUrl ).toEqual( expectedWsUrl );
      } );
    } );

    // ---------------------------------
    describe( 'relativeUrls', function() {
      useDefaultModules( 'isc.core', 'isc.http' );

      loadConfig( mockConfigRelative );

      createApiHelperSuite();

      it( 'should return a relative url if the api property is not fully specified', function() {
        var url               = suite.apiHelper.getUrl( 'myUrl' ),
            configUrl         = suite.apiHelper.getConfigUrl( mockConfigRelative.moduleApi.forms ),
            expectedUrl       = 'myRelativeApi/myUrl',
            expectedConfigUrl = 'someOtherRelativeApi/forms';

        expect( url ).toEqual( expectedUrl );
        expect( configUrl ).toEqual( expectedConfigUrl );
      } );
    } );

    function loadConfig( config ) {
      beforeEach( module( 'isc.configuration',
        function( iscCustomConfigServiceProvider ) {
          iscCustomConfigServiceProvider.loadConfig( config );
        } )
      );
    }

    function createApiHelperSuite() {
      beforeEach( inject( function( $httpBackend,
        iscCustomConfigService,
        apiHelper,
        iscHttpapi ) {
        suite = window.createSuite( {
          apiHelper             : apiHelper,
          iscCustomConfigService: iscCustomConfigService,
          iscHttpapi            : iscHttpapi,
          $httpBackend          : $httpBackend
        } );
      } ) );
    }

  } );

})();