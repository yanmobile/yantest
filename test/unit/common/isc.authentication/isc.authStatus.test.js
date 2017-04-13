(function() {
  'use strict';

  var suite;

  var mockResults = {
    mock: 'Results'
  };

  var focus = makeEvent( 'focus' ),
      blur  = makeEvent( 'blur' );

  // Factory/service
  describe( 'isc.authStatusService', function() {

    useDefaultModules( 'isc.templates' );

    beforeEach( module( 'isc.authentication', function( $provide ) {
      $provide.value( 'NAV_EVENTS', {
        showSecondaryNav      : 'iscShowSecondaryNav',
        hideSecondaryNav      : 'iscHideSecondaryNav',
        goToBeforeLoginPage   : 'iscGoToBeforeLoginPage',
        modalBackgroundClicked: 'iscModalBackgroundClicked',
        hideSideNavBar        : 'iscHideSideNavBar',
        tabLoaded             : 'iscTabLoaded'
      } );
    } ) );

    beforeEach( inject( function( $httpBackend,
      $window,
      $timeout,
      $rootScope,
      iscCookieManager,
      iscAuthStatus,
      iscAuthStatusService,
      iscSessionModel,
      iscSessionStorageHelper,
      AUTH_EVENTS,
      NAV_EVENTS ) {

      suite = window.createSuite( {
        $window                : $window,
        $rootScope             : $rootScope,
        cookieStorage          : iscCookieManager,
        iscAuthStatus          : iscAuthStatus,
        iscAuthStatusService   : iscAuthStatusService,
        iscSessionModel        : iscSessionModel,
        iscSessionStorageHelper: iscSessionStorageHelper,
        AUTH_EVENTS            : AUTH_EVENTS,
        NAV_EVENTS             : NAV_EVENTS
      } );

      suite.iscAuthStatus.configure( {
        authStatusUrl: 'auth/status'
      } );

      suite.cookieStorage.remove( 'browserIsLoggedOut' );
      suite.cookieStorage.remove( 'hashcode' );

      spyOn( suite.cookieStorage, 'get' ).and.callThrough();
      spyOn( suite.cookieStorage, 'set' ).and.callThrough();
      spyOn( suite.iscAuthStatusService, 'checkAuthStatus' ).and.callThrough();
      spyOn( suite.$rootScope, '$emit' ).and.callThrough();
      spyOn( $, 'ajax' );
    } ) );

    // -------------------------
    it( 'should log out if the flag is set', function() {
      suite.cookieStorage.set( 'browserIsLoggedOut', 1 );
      suite.$window.dispatchEvent( focus );

      // logout is only called if the user is authenticated
      expect( suite.$rootScope.$emit ).not.toHaveBeenCalled();

      spyOn( suite.iscSessionModel, 'isAuthenticated' ).and.returnValue( true );
      suite.$window.dispatchEvent( focus );
      expect( suite.$rootScope.$emit ).toHaveBeenCalledWith( suite.AUTH_EVENTS.logout );
    } );

    // -------------------------
    it( 'should store the hashcode on blur', function() {
      suite.$window.dispatchEvent( blur );

      expect( suite.cookieStorage.get ).toHaveBeenCalledWith( 'hashcode' );
    } );

    // -------------------------
    it( 'should call auth/status if the hashcode differs', function() {
      mockAuthStatusCall( 'success' );

      suite.iscAuthStatus.configure( {
        authStatusUrl          : 'auth/status',
        authStatusFocusCallback: authStatusFocusCallback
      } );

      suite.cookieStorage.set( 'hashcode', 'abcdefg' );
      suite.$window.dispatchEvent( focus );

      expect( suite.cookieStorage.get ).toHaveBeenCalledWith( 'hashcode' );
      expect( suite.$rootScope.$emit ).not.toHaveBeenCalled();

      expect( suite.authStatusFocusCallbackWasCalled ).toBe( true );

    } );

    it( 'should do nothing else if the call to auth/status fails', function() {
      mockAuthStatusCall( 'error' );

      suite.iscAuthStatus.configure( {
        authStatusUrl          : 'auth/status',
        authStatusFocusCallback: authStatusFocusCallback
      } );

      suite.cookieStorage.set( 'hashcode', 'abcdefg' );
      suite.$window.dispatchEvent( focus );

      expect( suite.cookieStorage.get ).toHaveBeenCalledWith( 'hashcode' );
      expect( suite.$rootScope.$emit ).not.toHaveBeenCalled();
      expect( suite.authStatusFocusCallbackWasCalled ).toBeUndefined();
    } );

    // -------------------------
    it( 'should call auth/status if the stored login response does not exist', function() {
      mockAuthStatusCall( 'success' );
      suite.iscAuthStatusService.checkAuthStatus();

      expect( suite.$rootScope.$emit ).toHaveBeenCalledWith( suite.NAV_EVENTS.tabLoaded, mockResults );
    } );

    // -------------------------
    it( 'should not emit tabLoaded if the configured authStatusSuccessTest is falsy', function() {
      suite.iscAuthStatus.configure( {
        authStatusUrl        : 'auth/status',
        authStatusSuccessTest: authStatusSuccessTestFail
      } );

      mockAuthStatusCall( 'success' );
      suite.iscAuthStatusService.checkAuthStatus();

      expect( suite.$rootScope.$emit ).not.toHaveBeenCalled();
    } );

    // -------------------------
    it( 'should emit tabLoaded if the configured authStatusSuccessTest is truthy', function() {
      suite.iscAuthStatus.configure( {
        authStatusUrl        : 'auth/status',
        authStatusSuccessTest: authStatusSuccessTestPass
      } );

      mockAuthStatusCall( 'success' );
      suite.iscAuthStatusService.checkAuthStatus();

      expect( suite.$rootScope.$emit ).toHaveBeenCalledWith( suite.NAV_EVENTS.tabLoaded, mockResults );
    } );

  } );

  function authStatusFocusCallback() {
    suite.authStatusFocusCallbackWasCalled = true;
  }

  function authStatusSuccessTestFail( results ) {
    return results.mock !== mockResults.mock;
  }

  function authStatusSuccessTestPass( results ) {
    return results.mock === mockResults.mock;
  }

  function makeEvent( eventName ) {
    var event = document.createEvent( 'CustomEvent' );
    event.initEvent( eventName, true, false );
    return event;
  }

  function mockAuthStatusCall( status ) {
    // Mock the synchronous auth/status call
    $.ajax.and.callFake( function( config ) {
      config[status]( mockResults );
    } );
  }
})
();
