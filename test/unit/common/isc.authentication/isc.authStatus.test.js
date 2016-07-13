(function() {
  'use strict';

  var suite;

  var mockResults = {
    LoggedIn: 1
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
      storage,
      iscAuthStatus,
      iscAuthStatusService,
      iscSessionStorageHelper,
      AUTH_EVENTS,
      NAV_EVENTS ) {

      suite = window.createSuite( {
        $window                : $window,
        $rootScope             : $rootScope,
        storage                : storage,
        iscAuthStatus          : iscAuthStatus,
        iscAuthStatusService   : iscAuthStatusService,
        iscSessionStorageHelper: iscSessionStorageHelper,
        AUTH_EVENTS            : AUTH_EVENTS,
        NAV_EVENTS             : NAV_EVENTS
      } );

      suite.iscAuthStatus.configure( {
        authStatusUrl: 'auth/status'
      } );

      suite.storage.clear();

      spyOn( suite.storage, 'get' ).and.callThrough();
      spyOn( suite.storage, 'set' ).and.callThrough();
      spyOn( suite.iscAuthStatusService, 'checkAuthStatus' ).and.callThrough();
      spyOn( suite.$rootScope, '$emit' ).and.callThrough();

    } ) );

    // -------------------------
    it( 'should log out if the flag is set', function() {
      suite.storage.set( 'browserIsLoggedOut', 1 );
      suite.$window.dispatchEvent( focus );

      expect( suite.$rootScope.$emit ).toHaveBeenCalledWith( suite.AUTH_EVENTS.logout );
    } );

    // -------------------------
    it( 'should store the hashcode on blur', function() {
      suite.$window.dispatchEvent( blur );

      expect( suite.storage.get ).toHaveBeenCalledWith( 'hashcode' );
    } );

    // -------------------------
    it( 'should call auth/status if the hashcode differs', function() {
      mockAuthStatusCall( 'success' );

      suite.iscAuthStatus.configure( {
        authStatusUrl          : 'auth/status',
        authStatusFocusCallback: authStatusFocusCallback
      } );

      suite.storage.set( 'hashcode', 'abcdefg' );
      suite.$window.dispatchEvent( focus );

      expect( suite.storage.get ).toHaveBeenCalledWith( 'hashcode' );
      expect( suite.$rootScope.$emit ).not.toHaveBeenCalled();

      expect( suite.authStatusFocusCallbackWasCalled ).toBe( true );

      function authStatusFocusCallback() {
        suite.authStatusFocusCallbackWasCalled = true;
      }
    } );

    it( 'should do nothing else if the call to auth/status fails', function() {
      mockAuthStatusCall( 'error' );

      suite.iscAuthStatus.configure( {
        authStatusUrl          : 'auth/status',
        authStatusFocusCallback: authStatusFocusCallback
      } );

      suite.storage.set( 'hashcode', 'abcdefg' );
      suite.$window.dispatchEvent( focus );

      expect( suite.storage.get ).toHaveBeenCalledWith( 'hashcode' );
      expect( suite.$rootScope.$emit ).not.toHaveBeenCalled();
      expect( suite.authStatusFocusCallbackWasCalled ).toBeUndefined();

      function authStatusFocusCallback() {
        suite.authStatusFocusCallbackWasCalled = true;
      }
    } );

    // -------------------------
    it( 'should call auth/status if the stored login response does not exist', function() {
      mockAuthStatusCall( 'success' );
      suite.iscAuthStatusService.checkAuthStatus();

      expect( suite.$rootScope.$emit ).toHaveBeenCalledWith( suite.NAV_EVENTS.tabLoaded, mockResults );
    } );

  } );

  function makeEvent( eventName ) {
    var event = document.createEvent( 'CustomEvent' );
    event.initEvent( eventName, true, false );
    return event;
  }

  function mockAuthStatusCall( status ) {
    // Mock the synchronous auth/status call
    spyOn( $, 'ajax' ).and.callFake( function( config ) {
      config[status]( mockResults );
    } );
  }
})
();
