(function() {
  'use strict';
  //console.log( 'iscNavContainerModel Tests' );


  describe( 'iscNavContainerModel', function() {
    var suite;
    window.useDefaultModules();

    // setup devlog
    beforeEach( module( 'isc.configuration', 'isc.authorization', 'iscNavContainer', function( iscCustomConfigServiceProvider ) {
      iscCustomConfigServiceProvider.loadConfig( customConfig );
    } ) );

    beforeEach( inject( function( $rootScope,
      $controller,
      $state,
      iscCustomConfigService,
      iscCustomConfigHelper,
      iscUiHelper,
      iscSessionModel,
      iscNavContainerModel,
      $window,
      $q,
      AUTH_EVENTS ) {

      suite = createSuite( {
        iscNavContainerModel  : iscNavContainerModel,
        $rootScope            : $rootScope,
        $scope                : $rootScope.$new(),
        AUTH_EVENTS           : AUTH_EVENTS,
        $state                : $state,
        iscCustomConfigHelper : iscCustomConfigHelper,
        iscCustomConfigService: iscCustomConfigService,
        iscUiHelper           : iscUiHelper,
        iscSessionModel       : iscSessionModel,
        $window               : $window,
        $q                    : $q
      } );
      spyOn( suite.$state, 'go' ).and.returnValue( suite.$q.when( {} ) );
      suite.$state.go.calls.reset();
      spyOn( suite.$window.location, 'reload' ).and.callFake( function() {
      } ); //avoid full page refresh for phantomjs
      suite.$window.location.reload.calls.reset();

    } ) );

    describe( 'navigateToUserLandingPage not anonymous user and should NOT have caused full page refresh', function() {
      it( 'should navigate to landing page', function() {
        spyOn( suite.iscSessionModel, "getCurrentUserRole" ).and.returnValue( "patient" );
        suite.iscCustomConfigService.getConfigSection( 'landingPages' )["patient"] = "patientLanding.html";

        suite.iscNavContainerModel.navigateToUserLandingPage();
        suite.$scope.$digest();
        expect( suite.$state.go ).toHaveBeenCalledWith( 'patientLanding.html' );
        expect( suite.$window.location.reload ).not.toHaveBeenCalled();
      } );

    } );

    describe( 'navigateToUserLandingPage anonymous user and should have caused full page refresh', function() {
      it( 'should navigate to landing page', function() {
        spyOn( suite.iscSessionModel, "getCurrentUserRole" ).and.returnValue( "*" );
        spyOn( suite.$state, 'get' ).and.returnValue( { url: 'login' } );
        suite.iscCustomConfigService.getConfigSection( 'landingPages' )["*"] = "login.html";
        suite.iscNavContainerModel.navigateToUserLandingPage();
        suite.$scope.$digest();
        expect( suite.$state.go ).not.toHaveBeenCalled();
        expect( suite.$window.location.hash ).toBe( '#/login' );
        expect( suite.$window.location.reload ).toHaveBeenCalled();
      } );
    } );


  } );
})();

