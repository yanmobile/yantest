
(function(){
  'use strict';
  //console.log( 'iscTextAreaAutoExpand Tests' );

  describe('iscTextAreaAutoExpand', function(){
    var scope,
      rootScope,
      isolateScope,
      httpBackend,
      element;

    var html = '<textarea isc-text-area-auto-expand ng-model="theText"></textarea>';

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
      scope.theText = '';

      httpBackend = $httpBackend;

      // dont worry about calls to assets
      httpBackend.when( 'GET', 'assets/i18n/en-us.json' )
        .respond( 200, {} );

      httpBackend.when( 'GET', 'assets/configuration/configFile.json' )
        .respond( 200, {} );

      element = $compile( html )( scope );
      scope.$digest();

      isolateScope = element.isolateScope();
    }));

    // -------------------------
    describe( 'autoExpand tests ', function(){

      it("should start the directive with the default height", function() {
        scope.$digest();
        var height = parseInt( element.css( 'height' ), 10 );
        expect( height ).toBe( 45 );
      });

      it("should change the height on update", inject( function( $compile ) {
        scope.theText = 'foo \n bar \n baz';
        element = $compile( html )( scope );
        scope.$digest();

        var height = parseInt( element.css( 'height' ), 10 );
        expect( height ).toBeGreaterThan( 45 );
      }));

    });

  });
})();

