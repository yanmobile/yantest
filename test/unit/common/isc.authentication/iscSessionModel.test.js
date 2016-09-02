(function() {
  'use strict';
  //console.log( 'iscSessionModel Tests' );

  describe( 'iscSessionModel', function() {
    var scope,
        rootScope,
        sessionModel,
        cookieStorage,
        timeout,
        httpBackend,
        http,
        $window,
        loginData,
        iscCustomConfigServiceProvider,
        AUTH_EVENTS,
        sessionStorageHelper;

    // setup devlog
    beforeEach( module( 'isc.core', function( devlogProvider ) {
      devlogProvider.loadConfig( customConfig );
    } ) );

    beforeEach( module( 'isc.configuration', function( _iscCustomConfigServiceProvider_ ) {
      iscCustomConfigServiceProvider = _iscCustomConfigServiceProvider_;
    } ) );

    // show $log statements
    beforeEach( module( 'isc.authentication', function( $provide ) {
      $provide.value( '$log', mock$log );
    } ) );

    beforeEach( inject( function( $rootScope, $http, $httpBackend, $timeout, _$window_, _iscCookieManager_, _AUTH_EVENTS_, iscSessionModel, iscSessionStorageHelper ) {

      rootScope            = $rootScope;
      scope                = $rootScope.$new();
      sessionModel         = iscSessionModel;
      cookieStorage        = _iscCookieManager_;
      http                 = $http;
      httpBackend          = $httpBackend;
      $window              = _$window_;
      timeout              = $timeout;
      AUTH_EVENTS          = _AUTH_EVENTS_;
      sessionStorageHelper = iscSessionStorageHelper;

      $window.sessionStorage = { // mocking sessionStorage
        getItem: function( key ) {
          return this[key];
        },

        setItem: function( key, val ) {
          this[key] = val;
        }
      };

      loginData = angular.copy( mockLoginResponse );

      sessionModel.create( loginData );

      $window.sessionStorage.setItem( 'currentUser', '' );
      $window.sessionStorage.setItem( 'statePermissions', '' );

    } ) );

    // -------------------------
    describe( 'create / destroy tests ', function() {

      it( 'should have a function create', function() {
        expect( angular.isFunction( sessionModel.create ) ).toBe( true );
      } );

      it( 'should have a function destroy', function() {
        expect( angular.isFunction( sessionModel.destroy ) ).toBe( true );
      } );

      it( 'should have a function getCredentials', function() {
        expect( angular.isFunction( sessionModel.getCredentials ) ).toBe( true );
      } );

      it( 'should have a function getCurrentUser', function() {
        expect( angular.isFunction( sessionModel.getCurrentUser ) ).toBe( true );
      } );

      it( 'should create the config when calling create, new session', function() {
        spyOn( rootScope, '$emit' );
        sessionModel.create( loginData, true );
        expect( sessionModel.getCredentials() ).toEqual( {} );
        expect( sessionModel.getCurrentUser() ).toEqual( loginData.UserData );
        expect( rootScope.$emit ).toHaveBeenCalledWith( AUTH_EVENTS.loginSuccess );

      } );

      it( 'should create the config when calling create, page refresh', function() {
        spyOn( rootScope, '$emit' );
        spyOn( cookieStorage, 'set' );
        spyOn( sessionStorageHelper, 'setLoginResponse' );
        sessionModel.create( loginData, false );
        expect( sessionModel.getCredentials() ).toEqual( {} );
        expect( sessionModel.getCurrentUser() ).toEqual( loginData.UserData );
        expect( rootScope.$emit ).toHaveBeenCalledWith( AUTH_EVENTS.sessionResumedSuccess );
        expect( sessionStorageHelper.setLoginResponse ).toHaveBeenCalledWith( loginData );
        expect( cookieStorage.set ).not.toHaveBeenCalledWith( jasmine.objectContaining( 'jwt' ) );
      } );

      it( 'should create jwt vars when present', function() {
        var loginData = { jwt: 'foobar' };
        spyOn( cookieStorage, 'set' );
        sessionModel.create( loginData, false );

        expect( cookieStorage.set ).toHaveBeenCalledWith( 'jwt', 'foobar' );
        expect( http.defaults.headers.common.jwt ).toBe( 'foobar' );
      } );

      it( 'should destroy the config when calling destroy', function() {
        var anonymousUser = { userRole: '*', FullName: 'anonymous' };
        var creds         = sessionModel.getCredentials();
        var user          = sessionModel.getCurrentUser();
        expect( creds ).toEqual( {} );
        expect( user ).toEqual( loginData.UserData );

        sessionModel.destroy();
        var creds = sessionModel.getCredentials();
        var user  = sessionModel.getCurrentUser();

        expect( creds ).toBe( null );
        expect( user ).toEqual( anonymousUser );
      } );
    } );

    // -------------------------
    describe( 'sessionTimeout tests ', function() {

      it( 'should have a function initSessionTimeout', function() {
        expect( angular.isFunction( sessionModel.initSessionTimeout ) ).toBe( true );
      } );

      it( 'should have a function stopSessionTimeout', function() {
        expect( angular.isFunction( sessionModel.stopSessionTimeout ) ).toBe( true );
      } );

      it( 'should have a function resetSessionTimeout', function() {
        expect( angular.isFunction( sessionModel.resetSessionTimeout ) ).toBe( true );
      } );

      });
    // -------------------------

    describe ( 'initSessionTimeout tests ', function () {

        it ('should have a function initSessionTimeout', function () {
          expect (angular.isFunction (sessionModel.initSessionTimeout)).toBe (true);
        });

        it ('should initSessionTimeout, no warn or timeout', function (done) {
          var expiresOn      = moment ().add(10,'s').unix ();
          spyOn (rootScope, '$broadcast').and.callThrough ();
          spyOn (sessionModel, 'stopSessionTimeout');

          spyOn (cookieStorage,'get').and.callFake(function( key ) {
            if(key === 'sessionExpiresOn'){
              return expiresOn;
            }
          });

          sessionModel.initSessionTimeout ();
          $window.setTimeout(function(){
            expect (cookieStorage.get).toHaveBeenCalledWith('sessionExpiresOn');
            expect (rootScope.$broadcast).not.toHaveBeenCalledWith (AUTH_EVENTS.sessionTimeoutWarning);
            expect (rootScope.$broadcast).not.toHaveBeenCalledWith (AUTH_EVENTS.sessionTimeout);
            expect (sessionModel.stopSessionTimeout).not.toHaveBeenCalled ();
            done();
          }, 1000);

        });

        it ('should initSessionTimeout, warn', function () {
          var expiresOn      = moment ().add(5,'s').unix ();
          spyOn (rootScope, '$broadcast').and.callThrough ();
          spyOn (sessionModel, 'stopSessionTimeout');

          spyOn(cookieStorage,'get').and.callFake(function( key ) {
            if(key === 'sessionExpiresOn'){
              return expiresOn;
            }
          });

          sessionModel.initSessionTimeout ();
          $window.setTimeout(function(){
            expect (cookieStorage.get).toHaveBeenCalledWith('sessionExpiresOn');
            expect (rootScope.$broadcast).not.toHaveBeenCalledWith (AUTH_EVENTS.sessionTimeoutWarning);
            expect (rootScope.$broadcast).not.toHaveBeenCalledWith (AUTH_EVENTS.sessionTimeout);
            expect (sessionModel.stopSessionTimeout).not.toHaveBeenCalled ();
            done();
          }, 3000);

        });


        it ('should initSessionTimeout, timeout', function () {
          var expiresOn      = moment ().add(1,'s').unix ();
          spyOn (rootScope, '$broadcast').and.callThrough ();
          spyOn (sessionModel, 'stopSessionTimeout');

          spyOn(cookieStorage,'get').and.callFake(function( key ) {
            if(key === 'sessionExpiresOn'){
              return expiresOn;
            }
          });

          sessionModel.initSessionTimeout ();
          $window.setTimeout(function(){
            expect (cookieStorage.get).toHaveBeenCalledWith('sessionExpiresOn');
            expect (rootScope.$broadcast).not.toHaveBeenCalledWith (AUTH_EVENTS.sessionTimeoutWarning);
            expect (rootScope.$broadcast).not.toHaveBeenCalledWith (AUTH_EVENTS.sessionTimeout);
            expect (sessionModel.stopSessionTimeout).not.toHaveBeenCalled ();
            done();
          }, 2000);

        });


      });

    // -------------------------
    describe( 'isAuthenticated tests ', function() {

      it( 'should have a function isAuthenticated', function() {
        expect( angular.isFunction( sessionModel.isAuthenticated ) ).toBe( true );
      } );

      it( 'should know when someone is authenticated', function() {
        loginData.UserData.userRole = 'provider';

        sessionModel.create( loginData );
        var expected = sessionModel.isAuthenticated();
        expect( expected ).toBe( true );

        sessionModel.destroy();
        var expected = sessionModel.isAuthenticated();
        expect( expected ).toBe( false );
      } );
    } );

    // -------------------------
    describe( 'getFullName tests ', function() {
      it( 'should have a function getFullName', function() {
        expect( angular.isFunction( sessionModel.getFullName ) ).toBe( true );
      } );

      it( 'should get the full name', function() {
        sessionModel.create( loginData );

        var expected = sessionModel.getFullName();
        expect( expected ).toBe( loginData.UserData.FullName );
      } );
    } );

  } );
})();

