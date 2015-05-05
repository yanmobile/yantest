
(function(){
  'use strict';

  var mockConfig = angular.copy( customConfig );

  describe('iscUiHelper', function(){
    var scope,
        service;

    beforeEach( module('iscHsCommunityAngular'));
    beforeEach( module('isc.common'));
    beforeEach( module('iscNavContainer'));

    beforeEach( inject( function( $rootScope, iscUiHelper ){
      scope = $rootScope.$new();
      service = iscUiHelper;
    }));

    // -------------------------
    describe( 'displayOrder tests ', function(){

      it( 'should have a function displayOrder', function(){
        expect( angular.isFunction( service.displayOrder )).toBe( true );
      });

      it( 'should return the display order of a tab when calling displayOrder', function(){
        var topTabs = mockConfig.topTabs;
        var expected, result;
        _.forEach( topTabs, function( tabObj ){
          expected = tabObj.displayOrder;
          result = service.displayOrder( tabObj );
          expect( expected ).toBe( result );
        })

      });
    });

    // -------------------------
    describe( 'setTabActiveState tests ', function(){

      it( 'should have a function setTabActiveState', function(){
        expect( angular.isFunction( service.setTabActiveState )).toBe( true );
      });

      it( 'should set the active tab state', function(){
        var topTabs = mockConfig.topTabs;
        var expected, result;

        service.setTabActiveState( 'index.home', topTabs );

        _.forEach( topTabs, function( tab ){
          if( tab.state === 'index.home' ){
            expect ( tab.$$active ).toBe( true );
          }
          else{
            expect ( tab.$$active ).toBe( false );
          }
        })
      });
    })

  });

})();

