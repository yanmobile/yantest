
(function(){
  'use strict';

  describe('iscSessionModel', function(){
    var scope,
      rootScope,
      model,
      timeout,
      httpBackend,
      $window,
      configService,
      loginData,
      loginDataProxy;

    var statePermissions = {
      "index.messages.outbox": ["user"],
      "index.myAccount": ["user"]
    };

    var mockLoginResponse = {
      "ChangePassword": 0,
      "SessionTimeout": 3600,
      "UserData": {
        "FirstName": "Adam",
        "FullName": "Adam Everyman",
        "LastName": "Everyman",
        "ProxyOnly": 0,
        "userRole" :"Admin"
      },
      "reload": 0
    };

    var mockLoginResponseProxy = {
      "ChangePassword": 0,
      "SessionTimeout": 3600,
      "UserData": {
        "FirstName": "Adam",
        "FullName": "Adam Everyman",
        "LastName": "Everyman",
        "ProxyOnly": 1
      },
      "reload": 0
    };

    beforeEach( module('isc.common', 'iscHsCommunityAngular') );

    // show $log statements
    beforeEach( module( 'isc.common', function( $provide ){
      $provide.value('$log', console);
    }));

    beforeEach( inject( function( $rootScope, $httpBackend, $timeout, _$window_, iscSessionModel, iscCustomConfigService  ){
      rootScope = $rootScope;
      scope = $rootScope.$new();
      model = iscSessionModel;
      httpBackend = $httpBackend;
      $window = _$window_;
      timeout = $timeout;
      configService = iscCustomConfigService;

      $window.sessionStorage = { // mocking sessionStorage
        getItem: function (key) {
          return this[key];
        },

        setItem: function(key, val){
          this[key] = val;
        }
      };

      loginData = angular.copy( mockLoginResponse );
      loginDataProxy = angular.copy( mockLoginResponseProxy );

      model.create( loginData );
      model.setStatePermissions( statePermissions );

      $window.sessionStorage.setItem( 'currentUser', '');
      $window.sessionStorage.setItem( 'statePermissions', '');

      spyOn( configService, 'getStatePermissions').andReturn( statePermissions );

    }));

    // -------------------------
    describe( 'create / destroy tests ', function(){

      it( 'should have a function create', function(){
        expect( angular.isFunction( model.create )).toBe( true );
      });

      it( 'should have a function destroy', function(){
        expect( angular.isFunction( model.destroy )).toBe( true );
      });

      it( 'should have a function getCredentials', function(){
        expect( angular.isFunction( model.getCredentials )).toBe( true );
      });

      it( 'should have a function getCurrentUser', function(){
        expect( angular.isFunction( model.getCurrentUser )).toBe( true );
      });

      it( 'should create the config when calling create', function(){
        model.create( loginData );
        expect( model.getCredentials() ).toEqual( {} );
      });

      it( 'should destroy the config when calling destroy', function(){

        var creds  = model.getCredentials();
        var user  = model.getCurrentUser();
        expect( creds ).toEqual( {} );
        expect( user ).toEqual( loginData.UserData );

        model.destroy();
        var creds  = model.getCredentials();
        var user  = model.getCurrentUser();

        expect( creds ).toBe( null );
        expect( user ).toBe( null );
      });
    });

    // -------------------------
    describe( 'sessionTimeout tests ', function(){

      it( 'should have a function initSessionTimeout', function(){
        expect( angular.isFunction( model.initSessionTimeout )).toBe( true );
      });

      it( 'should have a function stopSessionTimeout', function(){
        expect( angular.isFunction( model.stopSessionTimeout )).toBe( true );
      });

      it( 'should have a function resetSessionTimeout', function(){
        expect( angular.isFunction( model.resetSessionTimeout )).toBe( true );
      });
    });

    // -------------------------
    describe( 'isAuthenticated tests ', function(){

      it( 'should have a function isAuthenticated', function(){
        expect( angular.isFunction( model.isAuthenticated )).toBe( true );
      });

      it( 'should know when someone is authenticated', function(){
        model.create( loginData );
        var expected  = model.isAuthenticated();
        expect( expected ).toBe( true );

        model.destroy();
        var expected  = model.isAuthenticated();
        expect( expected ).toBe( false );

      });
    });

    // -------------------------
    describe( 'statePermittedToRole tests ', function(){

      it( 'should have a function statePermittedToRole', function(){
        expect( angular.isFunction( model.getUnitTestPrivate().statePermittedToRole )).toBe( true );
      });

      it( 'should know when state is permitted to a role', function(){

        // user is allowed
        var permitted  = model.getUnitTestPrivate().statePermittedToRole( 'index.messages.outbox' );
        expect( permitted ).toBe( true );

        var permitted  = model.getUnitTestPrivate().statePermittedToRole( 'index.myAccount' );
        expect( permitted ).toBe( true );

        // not specifically forbidden
        var permitted  = model.getUnitTestPrivate().statePermittedToRole( 'foobar' );
        expect( permitted ).toBe( true );

        // no user
        model.destroy();
        var permitted  = model.getUnitTestPrivate().statePermittedToRole( 'index.myAccount' );
        expect( permitted ).toBe( false );

        // proxy (restricted role)
        model.create( loginDataProxy );

        // not specifically forbidden
        var permitted  = model.getUnitTestPrivate().statePermittedToRole( 'foobar' );
        expect( permitted ).toBe( true );

        // user is restricted
        var permitted  = model.getUnitTestPrivate().statePermittedToRole( 'index.messages.outbox' );
        expect( permitted ).toBe( false );
      });
    });

    // -------------------------
    describe( 'getStateToCheck tests ', function(){

      it( 'should have a function getStateToCheck', function(){
        expect( angular.isFunction( model.getUnitTestPrivate().getStateToCheck )).toBe( true );
      });

      it( 'should know what state to check', function(){

        var expected  = model.getUnitTestPrivate().getStateToCheck( 'index.messages.outbox' );
        expect( expected ).toBe( 'index.messages.outbox' );

        var expected  = model.getUnitTestPrivate().getStateToCheck( 'index.myAccount' );
        expect( expected ).toBe( 'index.myAccount' );

        var expected  = model.getUnitTestPrivate().getStateToCheck( 'foobar' );
        expect( expected ).toBe( 'foobar' );

      });
    });

    // -------------------------
    describe( 'isAuthorized tests ', function(){

      it( 'should have a function isAuthorized', function(){
        expect( angular.isFunction( model.isAuthorized )).toBe( true );
      });

      it( 'should know if someone is authorized, restricted role', function(){
        model.create( loginDataProxy );

        var expected  = model.isAuthorized( 'index.messages.outbox' );
        expect( expected ).toBe( false );

        var expected  = model.isAuthorized( 'index' );
        expect( expected ).toBe( true );
      });

      it( 'should know if someone is authorized, right roles', function(){
        model.create( loginData );
        var expected  = model.isAuthorized( 'index.messages.outbox' );
        expect( expected ).toBe( true );
      });

      it( 'should know if someone is authorized, after destroy', function(){
        model.create( loginData );
        var expected  = model.isAuthorized( 'index.messages.outbox' );
        expect( expected ).toBe( true );

        model.destroy();
        var expected  = model.isAuthorized( 'index.messages.outbox' );
        expect( expected ).toBe( false );
      });
    });

    // -------------------------
    describe( 'whitelist, setNoLoginRequiredList tests ', function(){
      it( 'should have a function isWhiteListed', function(){
        expect( angular.isFunction( model.isWhiteListed )).toBe( true );
      });

      it( 'should have a function setNoLoginRequiredList', function(){
        expect( angular.isFunction( model.setNoLoginRequiredList )).toBe( true );
      });


      it( 'should know when a page is whitelisted', function(){
        model.setNoLoginRequiredList( ['ix.foo', 'ix.fee', 'ix.baz.*', 'ix.buz.*']);

        var expected  = model.isWhiteListed( 'ix.foo' );
        expect( expected ).toBe( true );

        var expected  = model.isWhiteListed( 'ix.fee' );
        expect( expected ).toBe( true );

        var expected  = model.isWhiteListed( 'ix.baz' );
        expect( expected ).toBe( true );

        var expected  = model.isWhiteListed( 'ix.baz.sub.sub' );
        expect( expected ).toBe( true );

        var expected  = model.isWhiteListed( 'ix.baz.sub' );
        expect( expected ).toBe( true );

        var expected  = model.isWhiteListed( 'ix.buz' );
        expect( expected ).toBe( true );

        var expected  = model.isWhiteListed( 'ix.buz.sub.sub' );
        expect( expected ).toBe( true );

        // ---------
        var expected  = model.isWhiteListed( 'ix.bar.baz.buz' );
        expect( expected ).toBe( false );

        var expected  = model.isWhiteListed( 'ix.bar' );
        expect( expected ).toBe( false );

      });
    });

    // -------------------------
    describe( 'getFullName tests ', function(){
      it( 'should have a function getFullName', function(){
        expect( angular.isFunction( model.getFullName )).toBe( true );
      });

      it( 'should get the full name', function(){
        model.create( loginData );

        var expected  = model.getFullName();
        expect( expected ).toBe( mockLoginResponse.UserData.FullName );
      });

    });

  });

})();

