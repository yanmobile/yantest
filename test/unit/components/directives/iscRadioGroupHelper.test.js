
(function(){
  'use strict';
  //console.log( 'iscRadioGroupHelper Tests' );

  describe('iscRadioGroupHelper', function(){
    var rootScope,
      window,
      helper;

    var group = [
      { foo:'bar' },
      { foo:'baz' },
      { foo:'qux' },
      { foo:'norf' }
    ];

    var item = group[1];

    // setup devlog
    beforeEach(module('isc.core', function (devlogProvider) {
      devlogProvider.loadConfig(customConfig);
    }));

    beforeEach (module ('isc.directives'));
    // show $log statements
    beforeEach( module( function( $provide ){
      $provide.value('$log', mock$log);
    }));

    beforeEach( inject( function( $rootScope, $window, iscRadioGroupHelper ){
      rootScope = $rootScope; //NOTE when spying on $rootScope.$broadcast, you cant use $rootScope.$new()
      window = $window;
      helper = iscRadioGroupHelper;
    }));

    // -------------------------
    describe( 'radioSelect tests ', function(){

      it( 'should have a function radioSelect', function(){
        expect( angular.isFunction( helper.radioSelect )).toBe( true );
      });

      it( 'should do the right thing on radioSelect, undefined', function(){
        group[2].$$selected = true;
        helper.radioSelect( item, group );
        expect( item.$$selected ).toBe( true );

        group.forEach( function( i, idx ){
          if( item.foo !== i.foo ){
            expect( i.$$selected ).toBe( false );
          }
        })
      });

      it( 'should do the right thing on radioSelect, true', function(){
        item.$$selected = true;
        group[2].$$selected = true;

        helper.radioSelect( item, group );
        expect( item.$$selected ).toBe( false );

        group.forEach( function( i, idx ){
          if( item.foo !== i.foo ){
            expect( i.$$selected ).toBe( false );
          }
        })
      });

      it( 'should do the right thing on radioSelect, false', function(){
        item.$$selected = false;
        group[2].$$selected = true;

        helper.radioSelect( item, group );
        expect( item.$$selected ).toBe( true );

        group.forEach( function( i, idx ){
          if( item.foo !== i.foo ){
            expect( i.$$selected ).toBe( false );
          }
        })
      });
    });


  });

})();

