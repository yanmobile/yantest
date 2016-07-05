/**
 * Created by hzou on 6/18/16.
 */

(function() {

  describe( 'iscNavContainer iscRouterDefaultEventService', function() {
    var suite;

    window.useDefaultModules('iscNavContainer');

    beforeEach( function() {
      suite = window.createSuite();
    } );

    beforeEach( inject( function( $rootScope, $compile, iscRouterDefaultEventService, $state ) {
      suite.iscRouterDefaultEventService = iscRouterDefaultEventService;
      suite.$state                       = $state;
    } ) );

    describe( 'set setup', function() {
      it( 'should have right dependencies', function() {
        expect( suite.iscRouterDefaultEventService ).toBeDefined();
      } );
    } );

    describe( "registerDefaultEvents", function() {
      it( 'should have invoked other 4 event registrations', function() {
        spyOn( suite.iscRouterDefaultEventService, "registerStateChangeStart" );
        spyOn( suite.iscRouterDefaultEventService, "registerStateChangeError" );
        spyOn( suite.iscRouterDefaultEventService, "registerStateChangeRejected" );
        spyOn( suite.iscRouterDefaultEventService, "registerStateChangeSuccess" );
        suite.iscRouterDefaultEventService.registerDefaultEvents();
        expect( suite.iscRouterDefaultEventService.registerStateChangeStart ).toHaveBeenCalled();
        expect( suite.iscRouterDefaultEventService.registerStateChangeError ).toHaveBeenCalled();
        expect( suite.iscRouterDefaultEventService.registerStateChangeRejected ).toHaveBeenCalled();
        expect( suite.iscRouterDefaultEventService.registerStateChangeSuccess ).toHaveBeenCalled();
      } );
    } );
    //
    // fdescribe( 'registerStateChangeSuccess', function() {
    //   it( 'should have console logged the success message', function() {
    //     suite.$state.go( 'index.login' );
    //   } );
    // } )
  } );
})();