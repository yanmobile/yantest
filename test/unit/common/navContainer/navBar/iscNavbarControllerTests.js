
(function(){
  'use strict';
  //console.log( 'iscNavbarController Tests' );

  var mockConfig = angular.copy( customConfig );

  describe('iscNavbarController', function(){
    var scope,
      self,
      rootScope,
      $state,
      configHelper,
      AUTH_EVENTS,
      controller;


    beforeEach( module('isc.common'));

    // show $log statements
    beforeEach( module(  function( $provide ){
      $provide.value('$log', console);
    }));


    beforeEach( inject( function( $rootScope, $controller, _$state_, iscCustomConfigService, iscCustomConfigHelper, iscSessionModel, _AUTH_EVENTS_  ){

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

      AUTH_EVENTS = _AUTH_EVENTS_;
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
        spyOn( rootScope, '$broadcast' );

        scope.navCtrl.logout();
        expect( rootScope.$broadcast ).toHaveBeenCalledWith( AUTH_EVENTS.logout );
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

