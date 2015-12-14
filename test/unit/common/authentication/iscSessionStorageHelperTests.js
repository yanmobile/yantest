
(function(){
  'use strict';
  //console.log( 'iscSessionStorageHelper Tests' );

  describe('iscSessionStorageHelper', function(){
    var rootScope,
        window,
        helper;

    // setup devlog
    beforeEach(module('isc.core', function (devlogProvider) {
      devlogProvider.loadConfig(customConfig);
    }));

    // show $log statements
    beforeEach( module(  'isc.authentication', function( $provide ){
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
        expect( window.sessionStorage.removeItem ).toHaveBeenCalledWith( 'sessionTimeoutCounter' );
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

    // -------------------------
    describe( 'get/setShowTimedOutAlert tests ', function(){

      it( 'should have a function getShowTimedOutAlert', function(){
        expect( angular.isFunction( helper.getShowTimedOutAlert )).toBe( true );
      });

      it( 'should have a function setShowTimedOutAlert', function(){
        expect( angular.isFunction( helper.setShowTimedOutAlert )).toBe( true );
      });

      it( 'should get a showTimedOutAlert', function(){
        helper.destroy();

        var defaultVal = false; // see class for details
        var expected = helper.getShowTimedOutAlert();
        expect( expected ).toEqual( defaultVal );

        var value = true;
        window.sessionStorage.setItem( 'showTimedOutAlert', angular.toJson( value ));

        var expected = helper.getShowTimedOutAlert();
        expect( expected ).toEqual( value );
      });

      it( 'should set a showTimedOutAlert', function(){
        helper.destroy();

        var defaultVal = false; // see class for details

        var alertVal = 'asdfasdf'; // bad data should return the default
        helper.setShowTimedOutAlert( alertVal );
        var expected = helper.getShowTimedOutAlert();
        expect( expected ).toEqual( defaultVal );

        var alertVal = true;
        helper.setShowTimedOutAlert( alertVal );
        var expected = helper.getShowTimedOutAlert();
        expect( expected ).toEqual( alertVal );

        helper.setShowTimedOutAlert(); // should return the default val
        var expected = helper.getShowTimedOutAlert();
        expect( expected ).toEqual( defaultVal );
      });
    });

    // -------------------------
    describe( 'canParse tests ', function(){

      it( 'should have a function canParse', function(){
        expect( angular.isFunction( helper.canParse )).toBe( true );
      });

      it( 'should know if you can parse something, blank', function(){
        var expected = helper.canParse();
        expect( expected).toBe( false );

        var expected = helper.canParse('');
        expect( expected).toBe( false );
      });

      it( 'should know if you can parse something, empty', function(){
        var expected = helper.canParse( {} );
        expect( expected).toBe( false );
      });

      it( 'should know if you can parse something, undefined', function(){
        var expected = helper.canParse( 'undefined' );
        expect( expected).toBe( false );

        var expected = helper.canParse( undefined );
        expect( expected).toBe( false );
      });

      it( 'should know if you can parse something, null', function(){
        var expected = helper.canParse( 'null' );
        expect( expected).toBe( false );

        var expected = helper.canParse( null );
        expect( expected).toBe( false );
      });

      it( 'should know if you can parse something, valid', function(){
        var expected = helper.canParse( {foo: 'bar'} );
        expect( expected).toBe( true );
      });
    });

    // -------------------------
    describe( 'getValFromSessionStorage tests ', function(){

      it( 'should have a function getValFromSessionStorage', function(){
        expect( angular.isFunction( helper.getValFromSessionStorage )).toBe( true );
      });

      it( 'should return a default value if you cant parse', function(){
        spyOn( window.sessionStorage, 'getItem').and.returnValue( '' );
        spyOn( helper, 'canParse' ).and.callThrough();

        var expected = helper.getValFromSessionStorage( 'key', 'default value' );
        expect( window.sessionStorage.getItem ).toHaveBeenCalledWith( 'key' );
        expect( helper.canParse ).toHaveBeenCalledWith( '' );
        expect( expected ).toBe( 'default value' );
      });

      it( 'should return a value if you can parse', function(){
        spyOn( window.sessionStorage, 'getItem').and.returnValue( '{ "foo":"bar"}' );
        spyOn( helper, 'canParse' ).and.callThrough();

        var expected = helper.getValFromSessionStorage( 'key', 'default value' );
        expect( window.sessionStorage.getItem ).toHaveBeenCalledWith( 'key' );
        expect( helper.canParse ).toHaveBeenCalledWith( '{ "foo":"bar"}' );
        expect( expected ).toEqual( {foo: 'bar'} );
      });
    });

    // -------------------------
    describe( 'setSessionStorageValue tests ', function(){

      it( 'should have a function setSessionStorageValue', function(){
        expect( angular.isFunction( helper.setSessionStorageValue )).toBe( true );
      });

      it( 'should return a value if you can parse', function(){
        spyOn( window.sessionStorage, 'setItem');

        helper.setSessionStorageValue( 'key', {"foo":"bar"} );
        expect( window.sessionStorage.setItem ).toHaveBeenCalledWith( 'key', '{"foo":"bar"}' );
      });
    });

  });

})();

