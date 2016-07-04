(function() {
  'use strict';

  describe( 'iscNavigationController', function() {
    var scope,
        self,
        rootScope,
        httpBackend,
        timeout,
        translate,
        sessionStorageHelper,
        alertModel,
        AUTH_EVENTS,
        NAV_EVENTS,
        $state,
        controller;

    window.useDefaultModuleConfig();

    // setup devlog
    beforeEach( module( 'iscNavContainer' ) );

    // this loads all the external templates used in directives etc
    // eg, everything in **/partials/*.html
    beforeEach( module( 'isc.templates' ) );

    beforeEach( inject( function( $rootScope, $controller, _$state_, $httpBackend, $timeout, $translate,
      _AUTH_EVENTS_, _NAV_EVENTS_,
      iscCustomConfigService, iscSessionModel, iscSessionStorageHelper ) {

      iscSessionStorageHelper.setConfig( customConfig );

      translate            = $translate;
      rootScope            = $rootScope;
      sessionStorageHelper = iscSessionStorageHelper;
      timeout              = $timeout;
      httpBackend          = $httpBackend;
      scope                = $rootScope.$new();
      controller           = $controller( 'iscNavigationController as navCtrl',
        {
          $scope    : scope,
          $rootScope: rootScope
        } );

      self = scope.navCtrl;

      self.sessionModel = iscSessionModel;
      $state            = _$state_;
      AUTH_EVENTS       = _AUTH_EVENTS_;
      NAV_EVENTS        = _NAV_EVENTS_;

    } ) );

    // -------------------------
    describe( 'onLoad tests ', function() {

      it( 'should know what to do onLoad, dont show warning', function() {
        spyOn( sessionStorageHelper, 'getShowTimedOutAlert' ).and.returnValue( false );
        spyOn( sessionStorageHelper, 'setShowTimedOutAlert' );
        // spyOn( alertModel, 'setOptionsByType' );
        spyOn( self, 'showAlertBox' );
        spyOn( self, 'onLoad' );

        // these tests are a little odd since the onLoad function is called every time the controller is instantiated
        // so the call counts are off
        self.onLoad();
        timeout.flush();

        expect( sessionStorageHelper.getShowTimedOutAlert ).toHaveBeenCalled();
        expect( self.showAlertBox ).not.toHaveBeenCalled();
        expect( sessionStorageHelper.setShowTimedOutAlert ).not.toHaveBeenCalled();
      } );

      it( 'should know what to do onLoad, show warning', function() {
        spyOn( sessionStorageHelper, 'getShowTimedOutAlert' ).and.returnValue( true );
        spyOn( sessionStorageHelper, 'setShowTimedOutAlert' );
        spyOn( self, 'showAlertBox' );

        // these tests are a little odd since the onLoad function is called every time the controller is instantiated
        // so the call counts are off
        timeout.flush();
        self.onLoad();

        expect( sessionStorageHelper.getShowTimedOutAlert ).toHaveBeenCalled();
        expect( sessionStorageHelper.setShowTimedOutAlert ).toHaveBeenCalledWith( false );
      } );

    } );

    // -------------------------
    describe( 'showAlertBox tests ', function() {

      it( 'should first call hide all popups', function() {
        spyOn( self, 'hideAllPopups' );
        controller.showAlertBox();

        expect( self.hideAllPopups ).toHaveBeenCalled();
      } );

      it( 'should set showAlert, showModalBkgrnd, alertShowing to true', function() {
        controller.showAlertBox();

        expect( self.showAlert ).toBe( true );
        expect( self.showModalBkgrnd ).toBe( true );
        expect( self.alertShowing ).toBe( true );
      } );
    } );

    describe( 'hideAlertBox', function() {

      it( 'should set showAlert, showModalBkgrnd, alertShowing to false', function() {
        controller.hideAlertBox();

        expect( self.showAlert ).toBe( false );
        expect( self.showModalBkgrnd ).toBe( false );
        expect( self.alertShowing ).toBe( false );
      } );
    } );

    describe( 'onSelectLanguage tests ', function() {
      it( 'should have a function onSelectLanguage', function() {
        expect( angular.isFunction( self.onSelectLanguage ) ).toBe( true );
      } );

      it( 'should know what to do onSelectLanguage', function() {
        spyOn( translate, 'use' );
        spyOn( sessionStorageHelper, 'setSessionStorageValue' );

        self.onSelectLanguage( { filename: 'es-es' } );
        expect( translate.use ).toHaveBeenCalled();
        expect( sessionStorageHelper.setSessionStorageValue ).toHaveBeenCalled();
      } );
    } );

    // -------------------------
    describe( 'onContinueSession tests ', function() {

      it( 'should have a function onContinueSession', function() {
        expect( angular.isFunction( self.onContinueSession ) ).toBe( true );
      } );

      it( 'should know what to do onContinueSession', function() {
        spyOn( rootScope, '$emit' );
        self.onContinueSession();
        expect( rootScope.$emit ).toHaveBeenCalledWith( AUTH_EVENTS.sessionTimeoutReset );
      } );
    } );

    // -------------------------
    describe( 'onCancelSession tests ', function() {

      it( 'should have a function onCancelSession', function() {
        expect( angular.isFunction( self.onCancelSession ) ).toBe( true );
      } );

      it( 'should know what to do onCancelSession', function() {
        spyOn( rootScope, '$emit' );
        self.onCancelSession();
        expect( rootScope.$emit ).toHaveBeenCalledWith( AUTH_EVENTS.sessionTimeoutConfirm );
      } );
    } );

    describe( 'AUTH_EVENTS.sessionTimeoutWarning', function() {
      it( 'should change alertShowing to true', function() {
        self.alertShowing = false;
        scope.$broadcast( AUTH_EVENTS.sessionTimeoutWarning );
        expect( self.alertShowing ).toBe( true );
      } );
    } );
    describe( 'AUTH_EVENTS.sessionTimeout', function() {
      it( 'should change alertShowing to true', function() {
        spyOn(self, 'hideAllPopups');
        self.alertShowing = true;
        scope.$broadcast( AUTH_EVENTS.sessionTimeout );
        expect( self.alertShowing ).toBe( false );
        expect( self.hideAllPopups ).toHaveBeenCalled();
      } );
    } );
  } );
})();

