
(function(){
  'use strict';
  //console.log( 'iscCustomConfigHelper Tests' );

  describe('iscCustomConfigHelper', function(){
    var scope,
        mockConfig,
        log,
        httpBackend,
        helper;


    // setup devlog
    beforeEach(module('isc.core', function (devlogProvider) {
      devlogProvider.loadConfig(customConfig);
    }));

    beforeEach( module('isc.configuration'), function( $provide ){
      $provide.value('$log', console);
    });

    beforeEach( inject( function( $log, $rootScope, $httpBackend, iscCustomConfigHelper ){
      scope = $rootScope.$new();
      log = $log;

      mockConfig = angular.copy( customConfig );
      helper = iscCustomConfigHelper;

      httpBackend = $httpBackend;
    }));
  });
})();

