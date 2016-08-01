(function() {
  'use strict';

  describe( 'iscStateInit', function() {
    var suite;

    useDefaultModules( 'isc.states' );


    beforeEach( inject( function( $q, $timeout, iscStateInit ) {
      suite = window.createSuite();

      suite.$q           = $q;
      suite.$timeout     = $timeout;
      suite.iscStateInit = iscStateInit;
    } ) );


    describe( 'iscFormApi', function() {
      it( 'should have revealed functions', function() {
        expect( _.isFunction( suite.iscStateInit.config ) ).toBe( true );
        expect( _.isFunction( suite.iscStateInit.run ) ).toBe( true );
      } );

      it( 'should configure functions to be run', function() {
        var testFunctions = {};

        // Create 10 test promises
        for ( var i = 0; i < 10; i++ ) {
          testFunctions[i] = function() {
            return suite.$q.when( {} );
          };
          spyOn( testFunctions, i.toString() ).and.callThrough();
        }

        spyOn( suite.iscStateInit, 'config' ).and.callThrough();
        spyOn( suite.iscStateInit, 'run' ).and.callThrough();

        // Configure for one array-based function
        suite.iscStateInit.config( {
          initFunctions: [
            testFunctions['0']
          ]
        } );
        suite.iscStateInit.run();

        expect( testFunctions['0'] ).toHaveBeenCalled();
        expect( testFunctions['1'] ).not.toHaveBeenCalled();

        // Add additional functions to run as object config
        suite.iscStateInit.config( {
          initFunctions: {
            'foo1': testFunctions['1']
          }
        } );

        // If not forcing the init to run, the function just added will not have run
        suite.iscStateInit.run();
        expect( testFunctions['1'] ).not.toHaveBeenCalled();

        // So run with force run = true
        suite.iscStateInit.run( true );
        expect( testFunctions['0'] ).toHaveBeenCalled();
        expect( testFunctions['1'] ).toHaveBeenCalled();
        expect( testFunctions['2'] ).not.toHaveBeenCalled();


        // Functions configured after the initial configuration
        // should append their functions to the run collection. 
        suite.iscStateInit.config( {
          initFunctions: [
            testFunctions['2'],
            testFunctions['3']
          ]
        } );

        suite.iscStateInit.config( {
          initFunctions: {
            'foo4': testFunctions['4'],
            'bar5': testFunctions['5']
          }
        } );

        suite.iscStateInit.run( true ).then( function( results ) {
          // All init functions are resolved at once, with the results of all calls
          expect( results ).toEqual( {
            '0'   : {},
            'foo1': {},
            '1'   : {}, // array-specified functions are auto-incremented
            '2'   : {},
            'foo4': {},
            'bar5': {}
          } );
        } );
        suite.$timeout.flush();

        expect( testFunctions['0'] ).toHaveBeenCalled();
        expect( testFunctions['1'] ).toHaveBeenCalled();
        expect( testFunctions['2'] ).toHaveBeenCalled();
        expect( testFunctions['3'] ).toHaveBeenCalled();
        expect( testFunctions['4'] ).toHaveBeenCalled();
        expect( testFunctions['5'] ).toHaveBeenCalled();
        expect( testFunctions['6'] ).not.toHaveBeenCalled();
        expect( testFunctions['7'] ).not.toHaveBeenCalled();
        expect( testFunctions['8'] ).not.toHaveBeenCalled();
        expect( testFunctions['9'] ).not.toHaveBeenCalled();
      } );
    } );


  } );

})();