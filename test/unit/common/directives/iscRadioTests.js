
(function(){
  'use strict';

  describe('iscRadio', function(){
    var scope,
      rootScope,
      helper,
      isolateScope,
      httpBackend,
      element;

    var providers = [
      {
        name: 'Prof. Russell Johnson',
        location: 'InterSys Clinic',
        address:'1 Memorial Drive, Cambridge, MA 02140',
        specialty: ['Allergies', 'Chiropracty', 'Crystal Divination'],
        isFavorite: 1
      },
      {
        name: 'Dr. Gilligan Skipper',
        location: 'Mayo Clinic',
        address:'11 Friends St, Watertown, MA 02345',
        specialty: ['Pediatrics'],
        isFavorite: 1
      }
    ];

    var html = '<isc-radio radio-item="provider" radio-group="providers"></isc-radio>';

    beforeEach( module('iscHsCommunityAngular', 'iscMessages') );

    // this loads all the external templates used in directives etc
    // eg, everything in templates/**/*.html
    beforeEach( module('isc.templates') );

    // show $log statements
    beforeEach( module( 'iscHsCommunityAngular', function( $provide ){
      $provide.value('$log', console);
    }));

    beforeEach( inject( function( $rootScope, $compile, $httpBackend, iscRadioGroupHelper  ){
      rootScope = $rootScope;
      helper = iscRadioGroupHelper;

      scope = $rootScope.$new();
      scope.providers = angular.copy( providers );
      scope.provider = scope.providers[0];

      httpBackend = $httpBackend;

      // dont worry about calls to assets
      httpBackend.when( 'GET', 'assets/i18n/en_US.json' )
        .respond( 200, {} );

      element = $compile( html )( scope );
      scope.$digest();

      isolateScope = element.isolateScope();
    }));

    // -------------------------
    describe( 'setup tests ', function(){

      it("should set a default value for radioGroup", function() {
        expect( isolateScope.radioGroup ).toBe( scope.providers );
      });

      it("should set a default value for radioItem", function() {
        expect( isolateScope.radioItem ).toBe( scope.provider );
      });


    });

    // -------------------------
    describe( 'getShowButtonText tests ', function(){

      it("should have a function toggle", function() {
        expect( angular.isFunction( isolateScope.toggle )).toBe( true );
      });

      it("should call the right methods after toggle", function() {
        spyOn( helper, 'radioSelect' );
        isolateScope.toggle();
        expect( helper.radioSelect ).toHaveBeenCalledWith( isolateScope.radioItem, isolateScope.radioGroup );
      });
    });

  });
})();

