
(function(){
  'use strict';
  //console.log( 'iscCustomConfigHelper Tests' );


  describe('iscCustomConfigHelper', function(){
    var scope,
        mockConfig,
        log,
        httpBackend,
        sessionModel,
        helper;


    beforeEach( module('isc.configuration'), function( $provide ){
      $provide.value('$log', console);
    });

    beforeEach( inject( function( $log, $rootScope, $httpBackend, iscCustomConfigHelper, iscSessionModel ){
      scope = $rootScope.$new();
      log = $log;

      mockConfig = angular.copy( customConfig );
      sessionModel = iscSessionModel;
      helper = iscCustomConfigHelper;

      httpBackend = $httpBackend;
      // mock calls to the config
      httpBackend.when( 'GET', 'assets/configuration/configFile.json' )
        .respond( 200, mockConfig );
    }));

    // -------------------------
    describe( 'add, get, reset tests ', function(){

      it( 'should have a function addStates', function(){
        expect( angular.isFunction( helper.addStates )).toBe( true );
      });

      it( 'should have a function getAllStates', function(){
        expect( angular.isFunction( helper.getAllStates )).toBe( true );
      });

      it( 'should have a function resetStates', function(){
        expect( angular.isFunction( helper.resetStates )).toBe( true );
      });

      it( 'should have a function getStateObj', function(){
        expect( angular.isFunction( helper.getStateObj )).toBe( true );
      });

      it( 'should add the states', function(){
        helper.addStates( mockConfig.topTabs );
        var result = helper.getAllStates();

        _.forEach( result, function( state ){
          var configObj = mockConfig.topTabs[ state.state ];
          expect( angular.equals( configObj, state) ).toBe( true );
        });
      });

      it( 'should reset the states', function(){
        helper.addStates( mockConfig.topTabs );
        var result = helper.getAllStates();

        _.forEach( result, function( state ){
          var configObj = mockConfig.topTabs[ state.state ];
          expect( angular.equals( configObj, state) ).toBe( true );
        });

        helper.resetStates();
        result = helper.getAllStates();
        expect( result ).toEqual( {} );
      });

      it( 'should find a particular state ', function(){
        helper.addStates( mockConfig.topTabs );

        var expected = helper.getStateObj();
        expect( expected ).toBe( undefined );

        var expected = helper.getStateObj('foobar');
        expect( expected ).toBe( undefined );

        var expected = helper.getStateObj('index.home');
        expect( expected ).toEqual( mockConfig.topTabs['index.home'] );
      });
    });

    // -------------------------
    describe( 'stateIsExcluded tests ', function(){

      it( 'should have a function stateIsExcluded', function(){
        expect( angular.isFunction( helper.stateIsExcluded )).toBe( true );
      });

      it( 'should know if a state is excluded', function(){
        mockConfig.topTabs['index.home'].exclude = true;
        mockConfig.topTabs['index.wellness'].exclude = false;

        helper.addStates( mockConfig.topTabs );

        var expected = helper.stateIsExcluded( 'index.home' );
        expect( expected ).toBe( true );

        var expected = helper.stateIsExcluded( 'index.wellness' );
        expect( expected ).toBe( false );
      });
    });



  });
})();

