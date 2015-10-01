
(function(){
  'use strict';

  //console.log( 'iscRadioGroupHelper Tests' );


  fdescribe('iscRadioGroupHelper', function(){
    var scope,
        helper;

    var radioGroup = [
      {foo: 'foo'},
      {foo: 'bar'},
      {foo: 'baz'},
      {foo: 'biz'},
      {foo: 'buz'}
      ];

    beforeEach( module('isc.common'));
    beforeEach( module('iscNavContainer'));


    // this loads all the external templates used in directives etc
    // eg, everything in **/partials/*.html
    beforeEach( module('isc.templates') );

    // show $log statements
    beforeEach( module( 'iscHsCommunityAngular', function( $provide ){
      $provide.value('$log', console);
    }));

    beforeEach( inject( function( $rootScope, iscRadioGroupHelper  ){
      scope = $rootScope.$new();
      helper = iscRadioGroupHelper;
    }));

    // -------------------------
    describe( 'radioSelect tests ', function(){

      it( 'should have a function radioSelect', function(){
        expect( angular.isFunction( helper.radioSelect )).toBe( true );
      });

      it( 'should select and deselect', function(){
        var item = radioGroup[0];
        helper.radioSelect( item, radioGroup );

        radioGroup.forEach( function( thing ){
          if( thing.foo === item.foo ){
            expect( thing.$$selected).toBe( true );
          }
          else{
            expect( thing.$$selected).toBe( false );
          }
        })
      });
    });

  });
})();

