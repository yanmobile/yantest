(function() {
  'use strict';

  describe( 'iscUiHelper', function() {
    var scope,
        service;

    // show $log statements
    beforeEach( module( 'isc.core', function( $provide, devlogProvider ) {
      $provide.value( '$log', mock$log );
      devlogProvider.loadConfig( customConfig );
    } ) );


    beforeEach( inject( function( $rootScope, iscUiHelper ) {
      scope   = $rootScope.$new();
      service = iscUiHelper;
    } ) );

    // -------------------------
    describe( 'setTabActiveState tests ', function() {

      it( 'should have a function setTabActiveState', function() {
        expect( angular.isFunction( service.setTabActiveState ) ).toBe( true );
      } );

      it( 'should set the active tab state', function() {
        var topTabs = {
          'index.home'   : {
            'state'         : 'index.home',
            'translationKey': 'ISC_HOME_TAB',
            'displayOrder'  : 1,
            'active'        : true
          }, 'index.work': {
            'state'         : 'index.work',
            'translationKey': 'ISC_WORK_TAB',
            'displayOrder'  : 1,
            'active'        : false
          }
        };

        service.setTabActiveState( 'index.home', topTabs );
        expect( topTabs["index.home"].active ).toBe( true );
        expect( topTabs["index.work"].active ).toBe( false );
      } );
    } );

  } );

})();
