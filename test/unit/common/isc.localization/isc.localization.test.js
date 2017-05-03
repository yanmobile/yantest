(function() {
  'use strict';

  describe( 'iscLocalizationService', function() {
    var suite,
        configService,
        scope;

    var defaultLangObj = {
      displayName: 'English',
      fileName   : 'en-us'
    };

    var english = {
      displayName: 'English',
      fileName   : 'en-us'
    };

    var arabic = {
      displayName: 'Arabic',
      fileName   : 'ar-ae'
    };

    var config = {};

    beforeEach( module( 'isc.common', 'isc.core', function( $provide, devlogProvider ) {
      $provide.provider( 'iscCustomConfigService', mockConfigProvider );

      devlogProvider.loadConfig( config );

      function mockConfigProvider() {
        this.loadConfig = function( mock ) {
          config = mock;
        };

        this.$get = function() {
          return {
            getConfig: function() {
              return config;
            }
          };
        };
      }
    } ) );

    beforeEach( module( function( iscCustomConfigServiceProvider ) {
      configService = iscCustomConfigServiceProvider;
    } ) );

    beforeEach( inject( function( $rootScope,
        $httpBackend,
        $translate,
        $timeout,
        $q,
        iscLocalizationService,
        tmhDynamicLocale,
        iscCustomConfigHelper,
        iscSessionStorageHelper,
        iscCookieManager,
        iscSessionModel,
        LOCALIZATION_EVENTS ) {

        scope = $rootScope.$new();

        suite = window.createSuite(
          {
            $rootScope            : $rootScope,
            $httpBackend          : $httpBackend,
            $translate            : $translate,
            $timeout              : $timeout,
            $q                    : $q,
            iscLocalizationService: iscLocalizationService,
            tmhDynamicLocale      : tmhDynamicLocale,
            iscCustomConfigHelper : iscCustomConfigHelper,
            iscCookieManager      : iscCookieManager,
            iscSessionModel       : iscSessionModel,
            LOCALIZATION_EVENTS   : LOCALIZATION_EVENTS
          } );
      } )
    );


    // -------------------------
    describe( 'init', function() {
        it( 'should know how to handle no language set', function() {
          spyOn( suite.iscLocalizationService, 'setCurrentLanguage' ).and.callThrough();
          spyOn( suite.iscCookieManager, 'get' ).and.returnValue( '' );

          configService.loadConfig( { languages: [] } );
          suite.iscLocalizationService.init();

          expect( suite.iscLocalizationService.getLanguages() ).toEqual( [defaultLangObj] );
          expect( suite.iscLocalizationService.getCurrentLanguage() ).toEqual( defaultLangObj );
          expect( suite.iscLocalizationService.hasMultipleLanguages ).toBe( false );
          expect( suite.iscLocalizationService.setCurrentLanguage ).toHaveBeenCalledWith( defaultLangObj );
        } );

        it( 'should know how to handle one language set', function() {
          spyOn( suite.iscLocalizationService, 'setCurrentLanguage' ).and.callThrough();
          spyOn( suite.iscCookieManager, 'get' ).and.returnValue( '' );

          configService.loadConfig( { languages: [arabic] } );
          suite.iscLocalizationService.init();

          expect( suite.iscLocalizationService.getLanguages() ).toEqual( [arabic] );
          expect( suite.iscLocalizationService.getCurrentLanguage() ).toEqual( arabic );
          expect( suite.iscLocalizationService.hasMultipleLanguages ).toBe( false );
          expect( suite.iscLocalizationService.setCurrentLanguage ).toHaveBeenCalledWith( arabic );
        } );

        it( 'should know how to handle preferred language set', function() {
          spyOn( suite.iscLocalizationService, 'setCurrentLanguage' ).and.callThrough();
          spyOn( suite.iscCookieManager, 'get' ).and.returnValue( '' );

          var arabicCopy                 = _.clone( arabic );
          arabicCopy.isPreferredLanguage = true;
          configService.loadConfig( { languages: [arabicCopy, english] } );
          suite.iscLocalizationService.init();

          expect( suite.iscLocalizationService.getLanguages() ).toEqual( [arabicCopy, english] );
          expect( suite.iscLocalizationService.getCurrentLanguage() ).toEqual( arabicCopy );
          expect( suite.iscLocalizationService.hasMultipleLanguages ).toBe( true );
          expect( suite.iscLocalizationService.setCurrentLanguage ).toHaveBeenCalledWith( arabicCopy );
        } );

        it( 'should know how to handle stored language set', function() {
          spyOn( suite.iscLocalizationService, 'setCurrentLanguage' ).and.callThrough();
          spyOn( suite.iscCookieManager, 'get' ).and.returnValue( arabic );

          configService.loadConfig( { languages: [arabic, english] } );
          suite.iscLocalizationService.init();

          expect( suite.iscLocalizationService.getLanguages() ).toEqual( [arabic, english] );
          expect( suite.iscLocalizationService.getCurrentLanguage() ).toEqual( arabic );
          expect( suite.iscLocalizationService.hasMultipleLanguages ).toBe( true );
          expect( suite.iscLocalizationService.setCurrentLanguage ).toHaveBeenCalledWith( arabic );
        } );

        it( 'should know how to handle unpreferred en-us', function() {
          spyOn( suite.iscLocalizationService, 'setCurrentLanguage' ).and.callThrough();
          spyOn( suite.iscCookieManager, 'get' ).and.returnValue( '' );

          configService.loadConfig( { languages: [arabic, english] } );
          suite.iscLocalizationService.init();

          expect( suite.iscLocalizationService.getLanguages() ).toEqual( [arabic, english] );
          expect( suite.iscLocalizationService.getCurrentLanguage() ).toEqual( english );
          expect( suite.iscLocalizationService.hasMultipleLanguages ).toBe( true );
          expect( suite.iscLocalizationService.setCurrentLanguage ).toHaveBeenCalledWith( english );
        } );

        it( 'should know how to handle weird edge cases', function() {
          spyOn( suite.iscLocalizationService, 'setCurrentLanguage' ).and.callThrough();
          spyOn( suite.iscCookieManager, 'get' ).and.returnValue( arabic );

          configService.loadConfig( { languages: [] } );
          suite.iscLocalizationService.init();

          expect( suite.iscLocalizationService.getLanguages() ).toEqual( [defaultLangObj] );
          expect( suite.iscLocalizationService.getCurrentLanguage() ).toEqual( defaultLangObj );
          expect( suite.iscLocalizationService.hasMultipleLanguages ).toBe( false );
          expect( suite.iscLocalizationService.setCurrentLanguage ).toHaveBeenCalledWith( defaultLangObj );
        } );
      }
    );


    // -------------------------
    describe( 'configure', function() {
      var mockConfiguration = {
        languageChangeApi   : function( language ) {
          return suite.$q.when( language );
        },
        afterLanguageChanged: _.noop
      };

      it( 'should exist', function() {
        expect( angular.isFunction( suite.iscLocalizationService.configure ) ).toBe( true );
      } );

      it( 'should cause the configured API to be called when the language is set', function() {
        spyOn( mockConfiguration, 'languageChangeApi' ).and.callThrough();

        suite.iscLocalizationService.configure( mockConfiguration );
        suite.iscLocalizationService.setCurrentLanguage( arabic );
        suite.$timeout.flush();

        expect( mockConfiguration.languageChangeApi ).toHaveBeenCalledWith( arabic );
      } );

      it( 'should cause the configured callback to be invoked when the language is set', function() {
        spyOn( mockConfiguration, 'afterLanguageChanged' ).and.callThrough();
        // callback is invoked after tmhDynamicLocale promise has been resolved
        spyOn( suite.tmhDynamicLocale, 'set' ).and.callFake( function() {
          return suite.$q.when( true );
        } );

        suite.iscLocalizationService.configure( mockConfiguration );
        suite.iscLocalizationService.setCurrentLanguage( arabic );
        suite.$timeout.flush();

        expect( mockConfiguration.afterLanguageChanged ).toHaveBeenCalledWith( arabic );
      } );
    } );


    // -------------------------
    describe( 'hasMultipleLanguages', function() {
      it( 'should exist', function() {
        expect( suite.iscLocalizationService.hasMultipleLanguages ).not.toBe( undefined );
      } );

      it( 'should return false for one language', function() {
        var languages = [
          { fileName: 'en-us' }
        ];
        configService.loadConfig( { languages: languages } );
        suite.iscLocalizationService.init();

        expect( suite.iscLocalizationService.hasMultipleLanguages ).toBe( false );
        expect( suite.iscLocalizationService.getCurrentLanguage().fileName ).toBe( 'en-us' );
      } );

      it( 'should return true for more than one language', function() {
        var languages = [
          { fileName: 'en-us' },
          { fileName: 'es-es' }
        ];
        configService.loadConfig( { languages: languages } );
        suite.iscLocalizationService.init();

        expect( suite.iscLocalizationService.hasMultipleLanguages ).toBe( true );
        expect( suite.iscLocalizationService.getCurrentLanguage().fileName ).toBe( 'en-us' );
      } );
    } );


    // -------------------------
    describe( 'getCurrentLanguage and setCurrentLanguage', function() {
      it( 'should exist', function() {
        expect( angular.isFunction( suite.iscLocalizationService.getCurrentLanguage ) ).toBe( true );
        expect( angular.isFunction( suite.iscLocalizationService.getCurrentLanguageShortName ) ).toBe( true );
        expect( angular.isFunction( suite.iscLocalizationService.setCurrentLanguage ) ).toBe( true );
      } );

      it( 'should set the current language', function() {
        spyOn( suite.iscCookieManager, 'set' );
        spyOn( suite.$translate, 'use' );
        spyOn( suite.tmhDynamicLocale, 'set' ).and.callFake( function() {
          return suite.$q.when( true );
        } );
        spyOn( suite.$rootScope, '$emit' );

        var currentLanguage = {
          fileName: 'es-es',
          label   : 'Spanish'
        };
        suite.iscLocalizationService.setCurrentLanguage( currentLanguage );
        suite.$timeout.flush();

        expect( suite.tmhDynamicLocale.set ).toHaveBeenCalledWith( currentLanguage.fileName );
        expect( suite.$translate.use ).toHaveBeenCalledWith( currentLanguage.fileName );
        expect( suite.$rootScope.$emit ).toHaveBeenCalledWith( suite.LOCALIZATION_EVENTS.languageChanged, currentLanguage );

        // getCurrentLanguage should return the language just set
        expect( suite.iscLocalizationService.getCurrentLanguage() ).toEqual( currentLanguage );
        // getCurrentLanguageShortName should return the first part of the locale name only
        expect( suite.iscLocalizationService.getCurrentLanguageShortName() ).toEqual( 'es' );
      } );
    } );


    // -------------------------
    describe( 'getRtlLanguages', function() {
      it( 'should exist', function() {
        expect( _.isFunction( suite.iscLocalizationService.getRtlLanguages ) ).toBe( true );
      } );

      it( 'return the rtl languages from the config', function() {
        spyOn( suite.iscLocalizationService, 'setCurrentLanguage' ).and.callThrough();
        spyOn( suite.iscCookieManager, 'get' ).and.returnValue( '' );

        configService.loadConfig( {
          languages   : [arabic, english],
          rtlLanguages: [arabic]
        } );
        suite.iscLocalizationService.init();

        expect( suite.iscLocalizationService.getLanguages() ).toEqual( [arabic, english] );
        expect( suite.iscLocalizationService.getRtlLanguages() ).toEqual( [arabic] );
      } );
    } );


    // -------------------------
    describe( 'isCurrentLanguageRtl', function() {
      it( 'should exist', function() {
        expect( _.isFunction( suite.iscLocalizationService.isCurrentLanguageRtl ) ).toBe( true );
      } );

      it( 'should return true if the current language is RTL', function() {
        spyOn( suite.iscLocalizationService, 'getRtlLanguages' ).and.returnValue( ['ar-ae'] );
        spyOn( suite.iscLocalizationService, 'getCurrentLanguage' ).and.returnValue( { fileName: 'ar-ae' } );

        var isRtl = suite.iscLocalizationService.isCurrentLanguageRtl();
        expect( isRtl ).toBe( true );
      } );

      it( 'should return false if the current language is not RTL', function() {
        spyOn( suite.iscLocalizationService, 'getRtlLanguages' ).and.returnValue( [] );
        spyOn( suite.iscLocalizationService, 'getCurrentLanguage' ).and.returnValue( { fileName: 'en-us' } );

        var isRtl = suite.iscLocalizationService.isCurrentLanguageRtl();
        expect( isRtl ).toBe( false );
      } );
    } );
  } );

})();

