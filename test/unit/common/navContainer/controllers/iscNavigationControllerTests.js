
(function(){
  'use strict';

  var mockConfig = angular.copy( customConfig );

  describe('iscNavigationController', function(){
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


    beforeEach( module('isc.common'));
    beforeEach( module('iscNavContainer'));

    // show $log statements
    beforeEach( module( 'isc.common', function( $provide ){
      $provide.value('$log', console);
    }));

    // this loads all the external templates used in directives etc
    // eg, everything in **/partials/*.html
    beforeEach( module('isc.templates') );


    beforeEach( inject( function( $rootScope, $controller, _$state_, $httpBackend, $timeout, $translate,
                                  _AUTH_EVENTS_, _NAV_EVENTS_, 
                                  iscAlertModel, iscCustomConfigService, iscSessionModel, iscSessionStorageHelper  ){

      mockConfig = angular.copy( customConfig );
      iscCustomConfigService.setConfig( mockConfig );

      translate = $translate;
      rootScope = $rootScope;
      sessionStorageHelper = iscSessionStorageHelper;
      timeout = $timeout;
      httpBackend = $httpBackend;
      alertModel = iscAlertModel;
      scope = $rootScope.$new();
      controller = $controller('iscNavigationController as navCtrl',
        {
          '$scope' : scope
        });

      self = scope.navCtrl;

      self.sessionModel  = iscSessionModel;
      $state = _$state_;
      AUTH_EVENTS = _AUTH_EVENTS_;
      NAV_EVENTS = _NAV_EVENTS_;

      // dont worry about calls to assets
      httpBackend.when( 'GET', 'assets/i18n/en-us.json' )
        .respond( 200, {} );

      // mock calls to the config
      httpBackend.when( 'GET', 'assets/configuration/configFile.json' )
        .respond( 200, customConfig );

      // dont worry about calls to home page mocks
      httpBackend.when( 'GET', 'assets/mockData/home/mockPatientData.json' )
        .respond( 200, {} );

      // dont worry about calls to home page mocks
      httpBackend.when( 'GET', 'assets/mockData/home/mockPanelData.json' )
        .respond( 200, {} );

    }));

    // -------------------------
    describe( 'onLoad tests ', function(){

      it( 'should have a function onLoad', function(){
        expect( angular.isFunction( self.onLoad )).toBe( true );
      });

      xit( 'should know what to do onLoad, dont show warning', function(){
        spyOn( sessionStorageHelper, 'getShowTimedOutAlert' ).and.returnValue( false );
        spyOn( sessionStorageHelper, 'setShowTimedOutAlert' );
        spyOn( alertModel, 'setOptionsByType' );
        spyOn( self, 'showAlertBox' );
        spyOn( self, 'onLoad' );

        // these tests are a little odd since the onLoad function is called every time the controller is instantiated
        // so the call counts are off
        self.onLoad();
        timeout.flush();

        expect( sessionStorageHelper.setShowTimedOutAlert.callCount ).toBe( 0 );
        expect( alertModel.setOptionsByType.callCount ).toBe( 1 );
        expect( self.showAlertBox.callCount ).toBe( 1 );
        expect( sessionStorageHelper.setShowTimedOutAlert).not.toHaveBeenCalled();
      });

      xit( 'should know what to do onLoad, show warning', function(){
        spyOn( sessionStorageHelper, 'getShowTimedOutAlert' ).and.returnValue( true );
        spyOn( sessionStorageHelper, 'setShowTimedOutAlert' );
        spyOn( alertModel, 'setOptionsByType' );
        spyOn( self, 'showAlertBox' );

        // these tests are a little odd since the onLoad function is called every time the controller is instantiated
        // so the call counts are off
        timeout.flush();
        self.onLoad();

        expect( sessionStorageHelper.setShowTimedOutAlert.callCount ).toBe( 1 );
        expect( sessionStorageHelper.setShowTimedOutAlert ).toHaveBeenCalledWith( false );
        expect( alertModel.setOptionsByType.callCount ).toBe( 2 );
        expect( alertModel.setOptionsByType ).toHaveBeenCalledWith( AUTH_EVENTS.sessionTimeout, null, null, null );
        expect( self.showAlertBox.callCount ).toBe( 2 );
        expect( self.showAlertBox ).toHaveBeenCalled();
      });

    });

    // -------------------------
    describe( 'showAlertBox tests ', function(){

      it( 'should have a function showAlertBox', function(){
        expect( angular.isFunction( self.showAlertBox )).toBe( true );
      });

      it( 'should open the alert with the right args', function(){
        spyOn( self, 'showAlertBox' );
        spyOn( alertModel, 'setOptionsByType' );

        rootScope.$broadcast( AUTH_EVENTS.responseError );
        expect( self.showAlertBox ).toHaveBeenCalled();
        expect( alertModel.setOptionsByType ).toHaveBeenCalledWith( AUTH_EVENTS.responseError, undefined, null, null);

        rootScope.$broadcast( AUTH_EVENTS.notAuthenticated );
        expect( self.showAlertBox ).toHaveBeenCalled();
        expect( alertModel.setOptionsByType ).toHaveBeenCalledWith( AUTH_EVENTS.notAuthenticated, undefined, null, null);

        rootScope.$broadcast( AUTH_EVENTS.notAuthorized );
        expect( self.showAlertBox ).toHaveBeenCalled();
        expect( alertModel.setOptionsByType ).toHaveBeenCalledWith( AUTH_EVENTS.notAuthorized, undefined, null, null);
      });

      it( 'should open the warning alert with the right args', function(){
        spyOn( self, 'showAlertBox' );
        spyOn( alertModel, 'setOptionsByType' );

        self.alertShowing = false;

        rootScope.$broadcast( AUTH_EVENTS.sessionTimeoutWarning );
        expect( self.showAlertBox ).toHaveBeenCalled();
        expect( self.alertShowing ).toBe( true );
        expect( alertModel.setOptionsByType ).toHaveBeenCalledWith( AUTH_EVENTS.sessionTimeoutWarning, undefined, self.onContinueSession, self.onCancelSession);
      });

      it( 'should NOT open the warning alert', function(){
        spyOn( self, 'showAlertBox' );
        spyOn( alertModel, 'setOptionsByType' );

        self.alertShowing = true;

        rootScope.$broadcast( AUTH_EVENTS.sessionTimeoutWarning );
        expect( self.showAlertBox).not.toHaveBeenCalled();
        expect( self.alertShowing ).toBe( true );
        expect( alertModel.setOptionsByType).not.toHaveBeenCalled();
      });
    });

    describe ('onSelectLanguage tests ', function () {
      it ('should have a function onSelectLanguage', function () {
        expect (angular.isFunction (self.onSelectLanguage)).toBe (true);
      });

      it ('should know what to do onSelectLanguage', function () {
        spyOn (translate, 'use');
        spyOn (sessionStorageHelper, 'setSessionStorageValue');

        self.onSelectLanguage ({ filename: 'es-es' });
        expect (translate.use).toHaveBeenCalled ();
        expect (sessionStorageHelper.setSessionStorageValue).toHaveBeenCalled ();
      });
    });
    
    describe( 'showSideNavbar tests ', function(){

      it( 'should have a function showSideNavbar', function(){
        expect( angular.isFunction( self.showSideNavbar )).toBe( true );
      });

      it( 'should know what to do showSideNavbar', function(){
        self.showSideNav = false;
        self.showModalBkgrnd = false;

        self.showSideNavbar();
        expect( self.showSideNav ).toBe( true );
        expect( self.showModalBkgrnd ).toBe( true );
      });
    });

    // -------------------------
    describe( 'hideSideNavbar tests ', function(){

      it( 'should have a function hideSideNavbar', function(){
        expect( angular.isFunction( self.hideSideNavbar )).toBe( true );
      });

      it( 'should know what to do hideSideNavbar', function(){
        self.showSideNav = true;
        self.showModalBkgrnd = true;

        self.hideSideNavbar();
        expect( self.showSideNav ).toBe( false );
        expect( self.showModalBkgrnd ).toBe( false );
      });
    });

    // -------------------------
    describe( 'showSecondaryNavbar tests ', function(){

      it( 'should have a function showSecondaryNavbar', function(){
        expect( angular.isFunction( self.showSecondaryNavbar )).toBe( true );
      });

      it( 'should know what to do showSecondaryNavbar', function(){
        self.showSecondaryNav = false;
        self.showModalBkgrnd = false;

        self.showSecondaryNavbar();
        expect( self.showSecondaryNav ).toBe( true );
        expect( self.showModalBkgrnd ).toBe( true );
      });
    });

    // -------------------------
    describe( 'hideSecondaryNavbar tests ', function(){

      it( 'should have a function hideSecondaryNavbar', function(){
        expect( angular.isFunction( self.hideSecondaryNavbar )).toBe( true );
      });

      it( 'should know what to do hideSecondaryNavbar', function(){
        self.showSecondaryNav = true;
        self.showModalBkgrnd = true;

        self.hideSecondaryNavbar();
        expect( self.showSecondaryNav ).toBe( false );
        expect( self.showModalBkgrnd ).toBe( false );
      });
    });

    // -------------------------
    describe( 'showSecondaryNavbar event tests ', function(){

      it( 'should respond correctly to showSecondaryNavbar events', function(){
        spyOn( self, 'showSecondaryNavbar' );
        spyOn( self, 'hideSecondaryNavbar' );

        rootScope.$broadcast( NAV_EVENTS.showSecondaryNav );
        expect( self.showSecondaryNavbar ).toHaveBeenCalled();
        expect( self.hideSecondaryNavbar ).not.toHaveBeenCalled();
      });
    });

    // -------------------------
    describe( 'hideSecondaryNav event tests ', function(){

      it( 'should respond correctly to hideSecondaryNav events', function(){
        spyOn( self, 'showSecondaryNavbar' );
        spyOn( self, 'hideSecondaryNavbar' );

        rootScope.$broadcast( NAV_EVENTS.hideSecondaryNav );
        expect( self.showSecondaryNavbar).not.toHaveBeenCalled();
        expect( self.hideSecondaryNavbar ).toHaveBeenCalled();
      });
    });

    // -------------------------
    describe( 'onContinueSession tests ', function(){

      it( 'should have a function onContinueSession', function(){
        expect( angular.isFunction( self.onContinueSession )).toBe( true );
      });

      it( 'should know what to do onContinueSession', function(){
        spyOn( rootScope, '$broadcast' );
        self.onContinueSession();
        expect( rootScope.$broadcast ).toHaveBeenCalledWith( AUTH_EVENTS.sessionTimeoutReset );
      });
    });

    // -------------------------
    describe( 'onCancelSession tests ', function(){

      it( 'should have a function onCancelSession', function(){
        expect( angular.isFunction( self.onCancelSession )).toBe( true );
      });

      it( 'should know what to do onCancelSession', function(){
        spyOn( rootScope, '$broadcast' );
        self.onCancelSession();
        expect( rootScope.$broadcast ).toHaveBeenCalledWith( AUTH_EVENTS.sessionTimeoutConfirm );
      });
    });

  });
})();

