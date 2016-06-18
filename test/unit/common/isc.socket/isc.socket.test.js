/**
 * Created by hzou on 6/18/16.
 */

(function() {

  describe( "isc.socket", function() {
    var suite;

    // setup devlog
    beforeEach( module( 'isc.core', function( devlogProvider ) {
      devlogProvider.loadConfig( customConfig );
    } ) );

    beforeEach( module( 'isc.socket' ) );

    beforeEach( inject( function( $rootScope, socket ) {
      suite            = {};
      suite.$rootScope = $rootScope;
      suite.socket     = socket;
      suite.io         = io; //global
      suite.fakeIO     = {
        on  : function( name, cb ) {
          cb();
        },
        emit: function( name, data, cb ) {
          cb();
        }
      };
      spyOn( suite.io, "connect" ).and.returnValue( suite.fakeIO );
    } ) );

    describe( 'test setup', function() {
      it( 'should have bound the injections correctly', function() {
        expect( suite.$rootScope ).toBeDefined();
        expect( suite.socket ).toBeDefined();
        expect( suite.io ).toBeDefined();
      } );
    } );

    describe( 'isc.socket connect', function() {
      it( 'should take an url', function() {
        suite.socket.connect( "/myUrl" );
        expect( suite.io.connect ).toHaveBeenCalledWith( '/myUrl', jasmine.objectContaining( { 'forceNew': true } ) );
      } );
    } );

    describe( 'isc.socket emit', function() {
      it( 'should call io.emit', function() {

        suite.socket.connect( "/myUrl" );
        spyOn( suite.fakeIO, "emit" ).and.callThrough();
        var responseCb = _.noop;

        suite.socket.emit( "sendMessage", "Code blue", responseCb );
        expect( suite.fakeIO.emit ).toHaveBeenCalledWith( "sendMessage", "Code blue", jasmine.anything() );
      } );

      it( 'should invoke $rootscope.$evalAsync', function() {
        suite.socket.connect( "/myUrl" );
        spyOn( suite.fakeIO, "emit" ).and.callThrough();
        spyOn( suite.$rootScope, "$evalAsync" );

        suite.socket.emit( "sendMessage", "Code blue" );
        expect( suite.$rootScope.$evalAsync ).toHaveBeenCalled();

      } );

      it( 'should invoke passed callback with response data', function() {
        suite.socket.connect( "/myUrl" );
        suite.responseCb = _.noop;
        spyOn( suite, "responseCb" );
        spyOn( suite.$rootScope, "$evalAsync" ).and.callFake( function( cb ) {
          cb();
        } );
        spyOn( suite.fakeIO, "emit" ).and.callThrough();
        suite.socket.emit( "sendMessage", "Code blue", suite.responseCb );
        expect( suite.responseCb ).toHaveBeenCalled();
      } );
    } );

    describe( 'isc.socket on', function() {
      it( 'should call io.on', function() {

        suite.socket.connect( "/myUrl" );
        spyOn( suite.fakeIO, "on" ).and.callThrough();
        var responseCb = _.noop;

        suite.socket.on( "sendMessage", responseCb );
        expect( suite.fakeIO.on ).toHaveBeenCalledWith( "sendMessage", jasmine.anything() );
      } );

      it( 'should invoke $rootscope.$evalAsync', function() {
        suite.socket.connect( "/myUrl" );
        spyOn( suite.fakeIO, "on" ).and.callThrough();
        spyOn( suite.$rootScope, "$evalAsync" );

        suite.socket.on( "sendMessage" );
        expect( suite.$rootScope.$evalAsync ).toHaveBeenCalled();

      } );

      it( 'should invoke passed callback with response data', function() {
        suite.socket.connect( "/myUrl" );
        suite.responseCb = _.noop;
        spyOn( suite, "responseCb" );
        spyOn( suite.$rootScope, "$evalAsync" ).and.callFake( function( cb ) {
          cb();
        } );
        spyOn( suite.fakeIO, "on" ).and.callThrough();
        suite.socket.on( "sendMessage", suite.responseCb );
        expect( suite.responseCb ).toHaveBeenCalled();
      } );
    } );
  } );

})();
