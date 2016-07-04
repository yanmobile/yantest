(function() {
  'use strict';
  //console.log( 'iscNavContainerModel Tests' );


  describe( 'iscNavContainerModel', function() {
    var suite;
    window.useDefaultModuleConfig();

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
      $timeout,
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
        $timeout              : $timeout
      } );
    } ) );

    describe( 'navigateToUserLandingPage not anonymous user', function() {
      it( 'should navigate to landing page', function() {
        spyOn( suite.iscSessionModel, "getCurrentUserRole" ).and.returnValue( "patient" );
        suite.iscCustomConfigService.getConfigSection( 'landingPages' )["patient"] = "patientLanding.html";
        spyOn( suite.$state, 'go' );
        suite.iscNavContainerModel.navigateToUserLandingPage();
        suite.$scope.$digest();
        expect( suite.$state.go ).toHaveBeenCalledWith( 'patientLanding.html' );
      } );

      it( 'should NOT have caused full page refresh', function() {
        spyOn( suite.$window.location, 'reload' ); //full page refresh

        spyOn( suite.iscSessionModel, "getCurrentUserRole" ).and.returnValue( "patient" );
        suite.iscCustomConfigService.getConfigSection( 'landingPages' )["patient"] = "patientLanding.html";
        spyOn( suite.$state, 'go' );
        suite.iscNavContainerModel.navigateToUserLandingPage();
        suite.$timeout.flush();
        expect( suite.$window.location.reload ).not.toHaveBeenCalled();
      } );
    } );

    describe( 'navigateToUserLandingPage anonymous user', function() {
      it( 'should navigate to landing page', function() {
        spyOn( suite.iscSessionModel, "getCurrentUserRole" ).and.returnValue( "*" );
        suite.iscCustomConfigService.getConfigSection( 'landingPages' )["*"] = "login.html";
        spyOn( suite.$state, 'go' );
        suite.iscNavContainerModel.navigateToUserLandingPage();
        suite.$scope.$digest();
        expect( suite.$state.go ).toHaveBeenCalledWith( 'login.html' );
      } );

      it( 'should have set isAutoLogOut sessionStorage and caused full page refresh', function() {
        spyOn( suite.$window.location, 'reload' ); //full page refresh
        spyOn( suite.$window.sessionStorage, 'setItem' ); //save auto logout state

        spyOn( suite.iscSessionModel, "getCurrentUserRole" ).and.returnValue( "*" );
        suite.iscCustomConfigService.getConfigSection( 'landingPages' )["*"] = "login.html";
        spyOn( suite.$state, 'go' );
        suite.iscNavContainerModel.navigateToUserLandingPage();
        suite.$timeout.flush();
        expect( suite.$window.location.reload ).toHaveBeenCalled();
        expect( suite.$window.sessionStorage.setItem ).toHaveBeenCalledWith( "isAutoLogOut", true );
      } );
    } );


  } );
})();

