
(function(){
  'use strict';
  //console.log( 'iscSessionModel Tests' );

  describe('iscSessionModel', function(){
    var scope,
        rootScope,
        model,
        timeout,
        httpBackend,
        $window,
        loginData,
        AUTH_EVENTS,
        loginDataProxy;

    var  userPermittedTabs = {
      "user":[ "index.wellness.*", "index.messages.*", "index.library.*", "index.calendar.*", "index.myAccount.*" ],
      "proxy":["index.myAccount.*", "index.messages",  "index.messages.inbox", "index.messages.outbox", "index.messages.refillPrescription"]
    };

    var noLoginRequired = [
      "index",
      "index.login",
      "index.home"
    ];

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

    // setup devlog
    beforeEach(module('isc.core', function (devlogProvider) {
      devlogProvider.loadConfig(customConfig);
    }));

    // show $log statements
    beforeEach( module( 'isc.authentication', function( $provide ){
      $provide.value('$log', console);
    }));

    beforeEach( inject( function( $rootScope, $httpBackend, $timeout, _$window_, iscSessionModel, _AUTH_EVENTS_  ){
      rootScope = $rootScope;
      scope = $rootScope.$new();
      model = iscSessionModel;
      httpBackend = $httpBackend;
      $window = _$window_;
      timeout = $timeout;
      AUTH_EVENTS = _AUTH_EVENTS_;

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

      $window.sessionStorage.setItem( 'currentUser', '' );
      $window.sessionStorage.setItem( 'statePermissions', '' );

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

      it( 'should create the config when calling create, new session', function(){
        spyOn( rootScope, '$broadcast' );
        model.create( loginData, true );
        expect( model.getCredentials() ).toEqual( {} );
        expect( model.getCurrentUser() ).toEqual( loginData.UserData );
        expect( rootScope.$broadcast ).toHaveBeenCalledWith( AUTH_EVENTS.loginSuccess );

      });

      it( 'should create the config when calling create, page refresh', function(){
        spyOn( rootScope, '$broadcast' );
        model.create( loginData, false );
        expect( model.getCredentials() ).toEqual( {} );
        expect( model.getCurrentUser() ).toEqual( loginData.UserData );
        expect( rootScope.$broadcast ).toHaveBeenCalledWith( AUTH_EVENTS.sessionResumedSuccess );
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
    describe( 'getRemainingTime tests ', function(){
      it( 'should have a function getRemainingTime', function(){
        expect( angular.isFunction( model.getRemainingTime )).toBe( true );
      });

      it( 'should get the remaining time', function(){
        model.create( loginData ); // RemainingTime = 3600

        model.initSessionTimeout( 3400 );

        var expected  = model.getRemainingTime();
        expect( expected ).toBe( 200 );
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
    describe( 'isAuthorized tests ', function(){

      it( 'should have a function isAuthorized', function(){
        expect( angular.isFunction( model.isAuthorized )).toBe( true );
      });

      it( 'should have a function getPermittedStates', function(){
        expect( angular.isFunction( model.getPermittedStates )).toBe( true );
      });

      it( 'should have a function setPermittedStates', function(){
        expect( angular.isFunction( model.setPermittedStates )).toBe( true );
      });

      it( 'should know if someone is authorized, all permitted', function(){
        model.create( loginData );
        model.setPermittedStates( ['*'] );

        var expected  = model.isAuthorized( 'index.messages.outbox' );
        expect( expected ).toBe( true );

        var expected  = model.isAuthorized( 'index' );
        expect( expected ).toBe( true );

        var expected  = model.isAuthorized( 'foo' );
        expect( expected ).toBe( true );
      });

      it( 'should know if someone is authorized, some permitted', function(){
        model.create( loginData );
        model.setPermittedStates( ['index.messages.outbox', 'foo'] );

        var expected  = model.isAuthorized( 'index.messages.outbox' );
        expect( expected ).toBe( true );

        var expected  = model.isAuthorized( 'index' );
        expect( expected ).toBe( false );

        var expected  = model.isAuthorized( 'foo' );
        expect( expected ).toBe( true );
      });

      it( 'should know if someone is authorized, some permitted by wildcard', function(){
        model.create( loginData );
        model.setPermittedStates( ['index.messages.*'] );

        var expected  = model.isAuthorized( 'index.messages' );
        expect( expected ).toBe( true );

        var expected  = model.isAuthorized( 'index.messages.outbox' );
        expect( expected ).toBe( true );

        var expected  = model.isAuthorized( 'index.messages.inbox' );
        expect( expected ).toBe( true );

        var expected  = model.isAuthorized( 'index' );
        expect( expected ).toBe( false );

        var expected  = model.isAuthorized( 'foo' );
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

