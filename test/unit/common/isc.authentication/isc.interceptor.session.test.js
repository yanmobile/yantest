(function() {
  'use strict';

  var url = '/fake/url';

  describe( 'iscSessionInterceptor test', function() {

    var suite;

    useDefaultModules( 'isc.http' );

    beforeEach( inject( function( iscSessionInterceptor, iscSessionModel ) {
      suite                       = {};
      suite.iscSessionInterceptor = iscSessionInterceptor;
      suite.iscSessionModel       = iscSessionModel;
    } ) );


    /**
     *  tests
     */
    describe(
      'sanity check',
      function() {
        it( 'should have interceptor defined', function() {
          expect( suite.interceptor ).toBeDefined();
        } );
      } );

    describe(
      'response tests',
      function() {

        it( 'should reset for successful authenticated calls', function() {
          spyOn( suite.iscSessionModel, 'isAuthenticated' ).and.returnValue( true );
          spyOn( suite.iscSessionModel, 'resetSessionTimeout' );
          var response = {};

          suite.iscSessionInterceptor.response( response );

          expect( suite.iscSessionModel.isAuthenticated ).toHaveBeenCalled();
          expect( suite.iscSessionModel.resetSessionTimeout ).toHaveBeenCalled();
        } );

        it( 'should not reset when the call is to the templateCache', function() {
          spyOn( suite.iscSessionModel, 'isAuthenticated' ).and.returnValue( true );
          spyOn( suite.iscSessionModel, 'resetSessionTimeout' );
          var response = {};
          _.set( response, 'config.cache.foo', 'bar' );

          suite.iscSessionInterceptor.response( response );

          expect( suite.iscSessionModel.isAuthenticated ).toHaveBeenCalled();
          expect( suite.iscSessionModel.resetSessionTimeout ).not.toHaveBeenCalled();
        } );

        it( 'should not reset when the user is not authenticated', function() {
          spyOn( suite.iscSessionModel, 'isAuthenticated' ).and.returnValue( false );
          spyOn( suite.iscSessionModel, 'resetSessionTimeout' );
          var response = {};

          suite.iscSessionInterceptor.response( response );

          expect( suite.iscSessionModel.isAuthenticated ).toHaveBeenCalled();
          expect( suite.iscSessionModel.resetSessionTimeout ).not.toHaveBeenCalled();
        } );
      } );


  } );
}());
