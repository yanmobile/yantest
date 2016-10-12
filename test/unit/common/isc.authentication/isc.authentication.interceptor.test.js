(function() {
  'use strict';

  var url = '/fake/url';

  describe( 'iscAuthenticationInterceptor test', function() {

    var suite;
    var fakeConfirmationService;
    var interceptor;
    var $rootScope;
    var AUTH_EVENTS;
    var statusCode;

    useDefaultModules( 'isc.http' );

    beforeEach( inject( function( iscAuthenticationInterceptor, $http, $httpBackend, $timeout, _$rootScope_, _AUTH_EVENTS_, _statusCode_ ) {
      suite              = {};
      suite.$http        = $http;
      suite.interceptor  = iscAuthenticationInterceptor;
      suite.$rootScope   = _$rootScope_;
      suite.AUTH_EVENTS  = _AUTH_EVENTS_;
      suite.statusCode   = _statusCode_;
      suite.$timeout     = $timeout;
      suite.$httpBackend = $httpBackend;
    } ) );


    /**
     *  tests
     */
    describe( 'sanity check', function() {
      it( 'should have interceptor defined', function() {
        expect( suite.interceptor ).toBeDefined();
      } );
    } );

    describe( 'status code 401', function() {
      it( 'should broadcast AUTH_EVENTS.sessionTimeout', function() {
        spyOn( suite.$rootScope, '$emit' );
        var response = { status: suite.statusCode.Unauthorized, config: {} };
        suite.interceptor.responseError( response );
        expect( suite.$rootScope.$emit ).toHaveBeenCalledWith( suite.AUTH_EVENTS.notAuthenticated, response );

      } );
    } );

    describe( 'status code 403', function() {
      it( 'should broadcast AUTH_EVENTS.notAuthenticated', function() {
        spyOn( suite.$rootScope, '$emit' );
        var response = { status: suite.statusCode.Forbidden, config: {} };
        suite.interceptor.responseError( response );
        expect( suite.$rootScope.$emit ).toHaveBeenCalledWith( suite.AUTH_EVENTS.notAuthorized, response );
      } );
    } );


    describe( 'status code 404', function() {

      it( 'should reject original response when url is ignored', function() {

        var response = { status: suite.statusCode.NotFound, config: { url: "api/v1/auth/status" } };
        var actual   = suite.interceptor.responseError( response );
        suite.$rootScope.$digest();
        expect( actual['$$state'].value ).toBe( response );

      } );

      it( 'should reject original response when url is ignored #2', function() {

        var response = { status: suite.statusCode.NotFound, config: { url: "api/v1/auth/logout" } };
        var actual   = suite.interceptor.responseError( response );
        // suite.$timeout.flush();
        suite.$rootScope.$digest();
        expect( actual['$$state'].value ).toBe( response );

      } );


      it( 'should should check session status by calling api/v1/auth/status', function() {

        spyOn( suite.$http, 'get' ).and.callThrough();
        suite.$httpBackend.whenGET( 'api/v1/auth/status' ).respond( 200, {} );
        var response = { status: suite.statusCode.NotFound, config: { url: "api/v1/patient/404" } };
        suite.interceptor.responseError( response );
        suite.$httpBackend.flush();
        expect( suite.$http.get ).toHaveBeenCalledTimes( 1 );

      } );

      it( 'should not $emit AUTH_EVENTS.notAuthetnicated if session check succeeds', function() {

        spyOn( suite.$rootScope, '$emit' );
        suite.$httpBackend.whenGET( 'api/v1/auth/status' ).respond( 200, {} );
        var response = { status: suite.statusCode.NotFound, config: { url: "api/v1/patient/404" } };
        var actual   = suite.interceptor.responseError( response );
        suite.$httpBackend.flush();
        expect( actual['$$state'].value ).toBe( response );
        expect( suite.$rootScope.$emit ).not.toHaveBeenCalled();

      } );

      it( 'should $emit AUTH_EVENTS.notAuthenticated if session check returns 404', function() {

        spyOn( suite.$rootScope, '$emit' );
        suite.$httpBackend.whenGET( 'api/v1/auth/status' ).respond( 404, {} );
        var response = { status: suite.statusCode.NotFound, config: { url: "api/v1/patient/404" } };
        var actual   = suite.interceptor.responseError( response );
        suite.$httpBackend.flush();
        expect( actual['$$state'].value ).toBe( response );
        expect( suite.$rootScope.$emit ).toHaveBeenCalledWith( suite.AUTH_EVENTS.notAuthenticated, jasmine.objectContaining( { status: 404 } ) );

      } );


    } );

    xdescribe( 'without preventDefault', function() {

      it( 'should have called confirmationService.show status 404', function() {
        spyOn( fakeConfirmationService, 'show' );

        interceptor.responseError( { status: 404, config: { url: "api/v1/patient" } } );
        expect( fakeConfirmationService.show ).toHaveBeenCalled();
      } );

      it( 'should have called confirmationService.show status 555', function() {
        spyOn( fakeConfirmationService, 'show' );

        interceptor.responseError( { status: 555, config: {} } );
        expect( fakeConfirmationService.show ).toHaveBeenCalled();
      } );

    } );

    xdescribe( 'prevent default on ALL status code with preventDefault = true', function() {
      it( 'should not call confirmationService.show status 404', function() {
        spyOn( fakeConfirmationService, 'show' );

        interceptor.responseError( { status: 404, config: { preventDefault: true } } );
        expect( fakeConfirmationService.show ).not.toHaveBeenCalled();
      } );

      it( 'should not call confirmationService.show status 555', function() {
        spyOn( fakeConfirmationService, 'show' );

        interceptor.responseError( { status: 555, config: { preventDefault: true } } );
        expect( fakeConfirmationService.show ).not.toHaveBeenCalled();
      } );
    } );

    xdescribe( 'prevent default on selective status code with preventDefault = [codes]', function() {
      it( 'should call confirmation.show if status code is 404', function() {
        spyOn( fakeConfirmationService, 'show' );

        interceptor.responseError( { status: 404, config: { preventDefault: [403] } } );
        expect( fakeConfirmationService.show ).toHaveBeenCalled();
      } );

      it( 'should not call confirmationService.show status 404', function() {
        spyOn( fakeConfirmationService, 'show' );

        interceptor.responseError( { status: 404, config: { preventDefault: [404] } } );
        expect( fakeConfirmationService.show ).not.toHaveBeenCalled();
      } );

      it( 'should not call confirmationService.show status 555', function() {
        spyOn( fakeConfirmationService, 'show' );

        interceptor.responseError( { status: 555, config: { preventDefault: [555] } } );
        expect( fakeConfirmationService.show ).not.toHaveBeenCalled();
      } );
    } );

  } );
}());
