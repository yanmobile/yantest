(function() {
  'use strict';

  describe( 'iscVersionApi', function() {
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
          'path'    : 'someOtherApi/forms'
        }
      }
    };

    useDefaultModules( 'isc.core', 'isc.http' );

    beforeEach( module( 'isc.configuration',
      function( iscCustomConfigServiceProvider ) {
        iscCustomConfigServiceProvider.loadConfig( mockConfig );
      } )
    );

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


    describe( 'apiHelper', function() {
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

  } );

})();