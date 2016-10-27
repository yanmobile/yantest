(function() {
  'use strict';
  //console.log( 'iscNavContainerModel Tests' );


  describe( 'iscScrollContainer', function() {
    var suite;
    window.useDefaultModules();

    // setup devlog
    beforeEach( module( 'isc.configuration', 'isc.authorization', 'iscNavContainer', function( iscCustomConfigServiceProvider ) {
      iscCustomConfigServiceProvider.loadConfig( customConfig );
    } ) );

    beforeEach( inject( function( iscScrollContainerService, $compile ) {

      suite = createSuite( {
        iscScrollContainerService: iscScrollContainerService
      } );
      spyOn( iscScrollContainerService, "registerScrollingContent" );
      suite.element = $compile( '<isc-scroll-container></isc-scroll-container>' )( {} );

    } ) );

    it( 'should have called registerScrollingContent', function() {
      expect( suite.iscScrollContainerService.registerScrollingContent ).toHaveBeenCalledTimes( 1 );
    } );
  } );

})();