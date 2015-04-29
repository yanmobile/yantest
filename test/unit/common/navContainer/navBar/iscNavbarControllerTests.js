
(function(){
  'use strict';

  var mockConfig = angular.copy( customConfig );

  describe('iscNavbarController', function(){
    var scope,
      self,
      rootScope,
      $state,
      configHelper,
      api,
      controller;

    beforeEach( module('iscHsCommunityAngular'));
    beforeEach( module('isc.common'));
    beforeEach( module('iscNavContainer'));

    // show $log statements
    beforeEach( module( 'iscHsCommunityAngular', function( $provide ){
      $provide.value('$log', console);
    }));


    beforeEach( inject( function( $rootScope, $controller, _$state_, iscAuthenticationApi, iscCustomConfigService, iscCustomConfigHelper, iscSessionModel  ){

      mockConfig = angular.copy( customConfig );
      iscCustomConfigService.setConfig( mockConfig );

      rootScope = $rootScope;
      scope = $rootScope.$new();
      controller = $controller('iscNavbarController as navCtrl',
        {
          '$scope' : scope
        });

      self = scope.navCtrl;

      scope.navCtrl.sessionModel  = iscSessionModel;

      api = iscAuthenticationApi;
      $state = _$state_;
      configHelper = iscCustomConfigHelper;

    }));

    // -------------------------
    //describe( '$stateChangeSuccess tests ', function(){
    //  it( 'should call the right functions on logout', function(){
    //    spyOn( configHelper, 'getSectionTranslationKeyFromName').andReturn( 'foobar' );
    //    spyOn( rootScope, '$on' ).andReturn( [{}, {name:'theName'}, {}, {}, {} ] );
    //
    //    rootScope.$broadcast('$stateChangeSuccess');
    //    expect( self.sectionTranslationKey ).toBe( 'foobar');
    //  });
    //});

    // -------------------------
    describe( 'logout tests ', function(){

      it( 'should have a function logout', function(){
        expect( angular.isFunction( scope.navCtrl.logout )).toBe( true );
      });

      it( 'should call the right functions on logout', function(){
        spyOn( api, 'logout' );

        scope.navCtrl.logout();
        expect( api.logout ).toHaveBeenCalled();
      });
    });

    // -------------------------
    describe( 'showLogin tests ', function(){

      it( 'should have a function showLogin', function(){
        expect( angular.isFunction( scope.navCtrl.showLogin )).toBe( true );
      });

      it( 'should know when to show the login button, authenticated and logged in', function(){
        spyOn( scope.navCtrl.sessionModel, 'isAuthenticated').andReturn( true );
        spyOn( $state, 'is').andReturn( true );
        var expected = scope.navCtrl.showLogin();
        expect( expected ).toBe( false );
      });

      it( 'should know when to show the login button, NOT authenticated but logged in', function(){
        spyOn( scope.navCtrl.sessionModel, 'isAuthenticated').andReturn( false );
        spyOn( $state, 'is').andReturn( true );
        var expected = scope.navCtrl.showLogin();
        expect( expected ).toBe( false );

      });

      it( 'should know when to show the login button, authenticated but NOT logged in', function(){
        spyOn( scope.navCtrl.sessionModel, 'isAuthenticated').andReturn( true );
        spyOn( $state, 'is').andReturn( false );
        var expected = scope.navCtrl.showLogin();
        expect( expected ).toBe( false );

      });

      it( 'should know when to show the login button, NOT authenticated and NOT logged in', function(){
        spyOn( scope.navCtrl.sessionModel, 'isAuthenticated').andReturn( false );
        spyOn( $state, 'is').andReturn( false );
        var expected = scope.navCtrl.showLogin();
        expect( expected ).toBe( true );
      });
    });

  });
})();

