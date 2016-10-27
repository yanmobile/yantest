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

    beforeEach( inject( function( iscScrollContainerService ) {

      suite = createSuite( {
        iscScrollContainerService: iscScrollContainerService
      } );

    } ) );

    it( 'should expose these methods', function() {
      expect( suite.iscScrollContainerService.registerScrollingContent ).toBeDefined();
      expect( suite.iscScrollContainerService.getCurrentScrollPosition ).toBeDefined();
      expect( suite.iscScrollContainerService.setCurrentScrollPosition ).toBeDefined();
    } );

    describe( 'getCurrentScrollPosition', function() {
      it( 'should return 0 as default value', function() {
        expect( suite.iscScrollContainerService.getCurrentScrollPosition( 0 ) ).toBe( 0 );
        expect( suite.iscScrollContainerService.getCurrentScrollPosition( 1 ) ).toBe( 0 );
        expect( suite.iscScrollContainerService.getCurrentScrollPosition( 2 ) ).toBe( 0 );
      } );

      it( 'should return 0 as default value', function() {
        expect( suite.iscScrollContainerService.getCurrentScrollPosition( 0 ) ).toBe( 0 );
      } );

      it( 'should return same item when called with "0" and "first"', function() {
        var mock = { scrollTop: _.constant( 25 ), animate: _.noop };
        suite.iscScrollContainerService.registerScrollingContent( mock );
        var first  = suite.iscScrollContainerService.getCurrentScrollPosition( 'first' );
        var index0 = suite.iscScrollContainerService.getCurrentScrollPosition( 0 );
        expect( first ).toBe( index0 );
      } );

      it( 'should return same item when called with "0" and "last"', function() {
        var mock = { scrollTop: _.constant( 25 ), animate: _.noop };
        suite.iscScrollContainerService.registerScrollingContent( mock );
        var last   = suite.iscScrollContainerService.getCurrentScrollPosition( 'last' );
        var index0 = suite.iscScrollContainerService.getCurrentScrollPosition( 0 );
        expect( last ).toBe( index0 );
      } );

      it( 'should return 25 as scrollTop() value', function() {
        var mock = { scrollTop: _.constant( 25 ), animate: _.noop };
        suite.iscScrollContainerService.registerScrollingContent( mock );
        expect( suite.iscScrollContainerService.getCurrentScrollPosition( 0 ) ).toBe( 25 );
      } );

    } );


    describe( 'setCurrentScrollPosition', function() {
      it( 'should set scrollTop to 55', function() {
        var scrollTopVal = 25;
        var mock         = {
          scrollTop : function( val ) {
            if ( val ) {
              scrollTopVal = val;
            }
            return scrollTopVal;
          }, animate: _.noop
        };
        suite.iscScrollContainerService.registerScrollingContent( mock );
        suite.iscScrollContainerService.setCurrentScrollPosition( 55, 0, 0 );
        expect( suite.iscScrollContainerService.getCurrentScrollPosition( 0 ) ).toBe( 55 );
      } );

      it( 'should animate when scrolling to top', function() {
        var scrollTopVal = 25;
        var mock         = {
          scrollTop: _.noop, animate: _.noop
        };
        spyOn( mock, "animate" );
        suite.iscScrollContainerService.registerScrollingContent( mock );
        suite.iscScrollContainerService.setCurrentScrollPosition( 55, 1, 0 );
        expect( mock.animate ).toHaveBeenCalledWith( jasmine.objectContaining( { scrollTop: 55 } ), 1 );
      } );

      it( 'should return 25 as scrollTop() value', function() {
        var mock = { scrollTop: _.constant( 25 ), animate: _.noop };
        suite.iscScrollContainerService.registerScrollingContent( mock );
        expect( suite.iscScrollContainerService.getCurrentScrollPosition( 0 ) ).toBe( 25 );
      } );

    } );

    describe( 'registerScrollingContent', function() {
      it( 'should add $element into scrollingContent array', function() {

        var mock = { scrollTop: _.constant( 25 ), animate: _.noop };

        suite.iscScrollContainerService.registerScrollingContent( mock );

      } );
    } );
  } );

})();