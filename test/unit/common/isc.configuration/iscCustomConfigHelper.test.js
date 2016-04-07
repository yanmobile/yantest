(function () {
  'use strict';
  //console.log( 'iscCustomConfigHelper Tests' );

  describe ('iscCustomConfigHelper', function () {
    var scope,
        mockConfig,
        log,
        httpBackend,
        helper;


    // setup devlog
    beforeEach (module ('isc.core', 'ui.router', function (devlogProvider, $stateProvider) {
      devlogProvider.loadConfig (customConfig);

      $stateProvider
          .state (
              'library', {
                translationKey: 'ONE'
              }
          )
          .state (
              'library.pageOne', {
                translationKey: 'ONE'
              }
          )
          .state (
              'library.pageTwo', {
                translationKey: 'TWO'
              }
          )
          .state (
              'library.pageThree', {
                translationKey: 'THREE'
              }
          );
    }));

    beforeEach (module ('isc.configuration'), function ($provide) {
      $provide.value ('$log', console);
    });

    beforeEach (inject (function ($log, $rootScope, $httpBackend, iscCustomConfigHelper) {
      scope = $rootScope.$new ();
      log   = $log;


      mockConfig = angular.copy (customConfig);
      helper     = iscCustomConfigHelper;

      httpBackend = $httpBackend;
    }));

    describe (
        'getSectionTranslationKeyFromName tests',
        function () {

          it ('should have a function getSectionTranslationKeyFromName', function () {
            expect (angular.isFunction (helper.getSectionTranslationKeyFromName)).toBe (true);
          });

          it ('should getSectionTranslationKeyFromName', function () {
            var expected = helper.getSectionTranslationKeyFromName ('library.pageTwo');
            expect (expected).toBe ('TWO');

            expected = helper.getSectionTranslationKeyFromName ('library.pageOne');
            expect (expected).toBe ('ONE');
          });
        }
    )

  });
}) ();

