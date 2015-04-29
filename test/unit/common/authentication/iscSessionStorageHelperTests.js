
(function(){
  'use strict';

  describe('iscSessionStorageHelper', function(){
    var rootScope,
      window,
      helper;

    beforeEach( module('iscHsCommunityAngular', 'isc.common') );

    // show $log statements
    beforeEach( module( 'iscHsCommunityAngular', 'isc.common', function( $provide ){
      $provide.value('$log', console);
    }));

    beforeEach( inject( function( $rootScope, $window, iscSessionStorageHelper ){
      rootScope = $rootScope; //NOTE when spying on $rootScope.$broadcast, you cant use $rootScope.$new()
      window = $window;
      helper = iscSessionStorageHelper;
    }));

    // -------------------------
    describe( 'destroy tests ', function(){

      it( 'should have a function destroy', function(){
        expect( angular.isFunction( helper.destroy )).toBe( true );
      });

      it( 'should do the right thing on destroy', function(){

        spyOn( window.sessionStorage, 'removeItem' );

        helper.destroy();

        expect( window.sessionStorage.removeItem ).toHaveBeenCalledWith( 'loginResponse' );
        expect( window.sessionStorage.removeItem ).toHaveBeenCalledWith( 'statePermissions' );
        expect( window.sessionStorage.removeItem ).toHaveBeenCalledWith( 'sessionTimeoutCounter' );
      });
    });

    // -------------------------
    describe( 'get/setLoginResponse tests ', function(){

      it( 'should have a function getLoginResponse', function(){
        expect( angular.isFunction( helper.getLoginResponse )).toBe( true );
      });

      it( 'should have a function setLoginResponse', function(){
        expect( angular.isFunction( helper.setLoginResponse )).toBe( true );
      });

      it( 'should get a login respose', function(){
        helper.destroy();

        var defaultVal = {}; // see class for details
        var expected = helper.getLoginResponse();
        expect( expected ).toEqual( defaultVal );

        var response = {foo: 'bar'};
        window.sessionStorage.setItem( 'loginResponse', angular.toJson( response ));

        var expected = helper.getLoginResponse();
        expect( expected ).toEqual( response );
      });

      it( 'should set a login respose', function(){
        helper.destroy();

        var defaultVal = {}; // see class for details
        var response = {foo: 'bar'};

        helper.setLoginResponse( response );
        var expected = helper.getLoginResponse();
        expect( expected ).toEqual( response );

        helper.setLoginResponse(); // should return the default val
        var expected = helper.getLoginResponse();
        expect( expected ).toEqual( defaultVal );
      });
    });

    // -------------------------
    describe( 'get/setStoredStatePermissions tests ', function(){

      it( 'should have a function getStoredStatePermissions', function(){
        expect( angular.isFunction( helper.getStoredStatePermissions )).toBe( true );
      });

      it( 'should have a function setStoredStatePermissions', function(){
        expect( angular.isFunction( helper.setStoredStatePermissions )).toBe( true );
      });

      it( 'should get a state permissions', function(){
        helper.destroy();

        var defaultVal = {}; // see class for details
        var expected = helper.getStoredStatePermissions();
        expect( expected ).toEqual( defaultVal );

        var response = {foo: 'bar'};
        window.sessionStorage.setItem( 'statePermissions', angular.toJson( response ));

        var expected = helper.getStoredStatePermissions();
        expect( expected ).toEqual( response );
      });

      it( 'should set a state permssions', function(){
        helper.destroy();

        var defaultVal = {}; // see class for details
        var response = {foo: 'bar'};

        helper.setStoredStatePermissions( response );
        var expected = helper.getStoredStatePermissions();
        expect( expected ).toEqual( response );

        helper.setStoredStatePermissions(); // should return the default val
        var expected = helper.getStoredStatePermissions();
        expect( expected ).toEqual( defaultVal );
      });
    });

    // -------------------------
    describe( 'get/setSessionTimeoutCounter tests ', function(){

      it( 'should have a function getSessionTimeoutCounter', function(){
        expect( angular.isFunction( helper.getSessionTimeoutCounter )).toBe( true );
      });

      it( 'should have a function setSessionTimeoutCounter', function(){
        expect( angular.isFunction( helper.setSessionTimeoutCounter )).toBe( true );
      });

      it( 'should get a sessionTimeout counter', function(){
        helper.destroy();

        var defaultVal = -1; // see class for details
        var expected = helper.getSessionTimeoutCounter();
        expect( expected ).toEqual( defaultVal );

        var counter = 500;
        window.sessionStorage.setItem( 'sessionTimeoutCounter', angular.toJson( counter ));

        var expected = helper.getSessionTimeoutCounter();
        expect( expected ).toEqual( counter );
      });

      it( 'should set a state permssions', function(){
        helper.destroy();

        var defaultVal = -1; // see class for details

        var counter = 'asdfasdf'; // bad data should return the defauld
        helper.setSessionTimeoutCounter( counter );
        var expected = helper.getSessionTimeoutCounter();
        expect( expected ).toEqual( defaultVal );

        var counter = 12;
        helper.setSessionTimeoutCounter( counter );
        var expected = helper.getSessionTimeoutCounter();
        expect( expected ).toEqual( counter );

        helper.setSessionTimeoutCounter(); // should return the default val
        var expected = helper.getSessionTimeoutCounter();
        expect( expected ).toEqual( defaultVal );
      });
    });

  });

})();

