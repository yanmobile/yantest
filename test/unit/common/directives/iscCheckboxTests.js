
(function(){
  'use strict';
  //console.log( 'iscCheckbox Tests' );

  describe('iscCheckbox', function(){
    var scope,
      rootScope,
      isolateScope,
      httpBackend,
      element;

    var html = '<isc-check-box data-ng-model="provider.isFavorite"></isc-check-box>';

    beforeEach( module('isc.common'));


    // this loads all the external templates used in directives etc
    // eg, everything in templates/**/*.html
    beforeEach( module('isc.templates') );

    // show $log statements
    beforeEach( module(  function( $provide ){
      $provide.value('$log', console);
    }));

    beforeEach( inject( function( $rootScope, $compile, $httpBackend  ){
      rootScope = $rootScope;
      scope = $rootScope.$new();

      httpBackend = $httpBackend;

      // dont worry about calls to assets
      httpBackend.when( 'GET', 'assets/i18n/en_US.json' )
        .respond( 200, {} );

      element = $compile( html )( scope );
      scope.$digest();

      isolateScope = element.isolateScope();
    }));


    // -------------------------
    describe( 'selected tests ', function(){

      it("should update selected based on the model, selected true", function() {
        scope.provider =  {
          isFavorite: true
        };

        scope.$digest();
        expect( isolateScope.selected ).toBe( true );
      });

      it("should update selected based on the model, selected true", function() {
        scope.provider =  {
          isFavorite: false
        };

        scope.$digest();
        expect( isolateScope.selected ).toBe( false );
      });
    });

  });
})();

