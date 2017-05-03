/**
 * Created by douglas goodman on 10/30/15.
 */

( function() {
  'use strict';

  angular
    .module( 'isc.localization' )
    .factory( 'iscLocalizationService', iscLocalizationService );

  /**
   * @ngdoc factory
   * @memberOf isc.localization
   * @param devlog
   * @param $rootScope
   * @param $locale
   * @param $translate
   * @param $q
   * @param tmhDynamicLocale
   * @param iscCustomConfigService
   * @param iscCookieManager
   * @param LOCALIZATION_EVENTS
   * @returns { }
   */
  /* @ngInject */
  function iscLocalizationService( devlog,
    $rootScope, $locale, $translate, $q,
    tmhDynamicLocale,
    iscCustomConfigService, iscCookieManager,
    LOCALIZATION_EVENTS ) {


    var log = devlog.channel( 'iscLocalizationService' );

    var appLanguages    = [];
    var rtlLanguages    = [];
    var currentLanguage = null;

    var localizationConfig = {
      // function called if the language change needs to be communicated to a server or API
      languageChangeApi   : $q.when,
      // function called after the language has been successfully changed
      afterLanguageChanged: _.noop
    };

    var service = {
      configure: configure,
      init     : init,

      hasMultipleLanguages       : false,
      isCurrentLanguageRtl       : isCurrentLanguageRtl,
      getCurrentLanguage         : getCurrentLanguage,
      getCurrentLanguageShortName: getCurrentLanguageShortName,
      getLanguages               : getLanguages,
      getRtlLanguages            : getRtlLanguages,
      setCurrentLanguage         : setCurrentLanguage
    };

    init();

    return service;

    function init() {
      log.logFn( 'init' );

      // get the all the languages specified in the config
      appLanguages = _.get( iscCustomConfigService.getConfig(), 'languages', [] );
      log.debug( '...appLanguages', appLanguages );

      // get the list of rtl languages
      rtlLanguages = _.get( iscCustomConfigService.getConfig(), 'rtlLanguages', [] );
      log.debug( '...rtlLanguages', rtlLanguages );

      // get the language stored on the session
      var storedLang = iscCookieManager.get( 'language' );
      log.debug( '...storedLang', storedLang );

      // find if the stored language exists in the config
      var actualStoredLang = _.find( appLanguages,
        function( lang ) {
          // we need to do it this way because
          // storedLang !== {the one in the array}
          return _.isEqual( lang, storedLang );
        } );
      log.debug( '...actualStoredLang', actualStoredLang );

      var enUsLang = _.find( appLanguages, ['fileName', 'en-us'] );
      log.debug( '...enUsLang', enUsLang );

      // find the preferred language if any
      // this will return the first one if more than one is specified
      var preferredLang = _.find( appLanguages, ['isPreferredLanguage', true] );
      log.debug( '...preferredLang', preferredLang );

      var languageToUse;

      if ( !_.get( appLanguages, 'length' ) ) {
        // if no languages are set, use the default
        log.debug( '...no languages set' );
        languageToUse = getDefaultLangObj();
        appLanguages.push( languageToUse );
      }
      else if ( appLanguages.length === 1 ) {
        // if you only have one language, use that
        log.debug( '...only one language available' );
        languageToUse = appLanguages[0];
      }
      else if ( actualStoredLang ) {
        // if the stored language exists in the array, use that
        log.debug( '...storedLanguage exists' );
        languageToUse = actualStoredLang;
      }
      else if ( preferredLang ) {
        // if no stored language exists but one of the configured languages is preferred, use that
        log.debug( '...preferredLang exists' );
        languageToUse = preferredLang;
      }
      else if ( enUsLang ) {
        // if no configured language is preferred, and en-us is in the array, use that
        log.debug( '...enUsLang exists' );
        languageToUse = enUsLang;
      }
      else {
        // if none of the previous conditions are met, use the default
        // this is purely defensive coding - an app should never hit this
        log.debug( '...cant find anything, use default' );
        languageToUse = getDefaultLangObj();
        appLanguages.push( languageToUse );
      }

      log.debug( '...languageToUse', languageToUse );

      service.setCurrentLanguage( languageToUse );
      service.hasMultipleLanguages = _.get( appLanguages, 'length', -1 ) > 1; // there should always be one;

      log.debug( '...hasMultipleLanguages', service.hasMultipleLanguages );
      log.debug( '...currentLanguage', currentLanguage );

      /**
       * return an "artificial" language object in case no other is supplied
       * this is so the app doesn't fail to load if the specified language isn't in the i18n folder
       * @returns {{displayName: string, fileName: string}}
       */
      function getDefaultLangObj() {
        log.debug( '...getDefaultLangObj' );
        return {
          displayName: 'English',
          fileName   : 'en-us'
        };
      }
    }

    // ----------------------------

    function configure( config ) {
      _.merge( localizationConfig, config );
    }

    function getLanguages() {
      return appLanguages;
    }

    function getRtlLanguages() {
      return rtlLanguages || [];
    }

    function isCurrentLanguageRtl() {
      var rtlLanguageArray = service.getRtlLanguages() || [],
          currentLanguage  = service.getCurrentLanguage().fileName;

      return _.findIndex( rtlLanguageArray, function( lang ) {
          return lang === currentLanguage;
        } ) > -1;
    }

    function getCurrentLanguage() {
      return currentLanguage;
    }

    function setCurrentLanguage( language ) {
      log.logFn( 'setCurrentLanguage' );
      log.debug( '...fileName', language.fileName );

      currentLanguage = language;
      iscCookieManager.set( 'language', language );

      log.logFn( 'localizationConfig.languageChangeApi' );
      localizationConfig.languageChangeApi( language )
        .then( function onSuccess() {
          log.debug( '...success' );
          $translate.use( language.fileName );

          var newLanCode = language.fileName.toLowerCase().replace( /_/g, '-' );
          log.debug( '...newLanCode', newLanCode );

          // set global moment locale
          moment.locale( newLanCode );

          $locale.id = language.fileName;

          return tmhDynamicLocale.set( newLanCode ) // load Angular locale (async)
            .then( function() {
              localizationConfig.afterLanguageChanged( language );
              $rootScope.$emit( LOCALIZATION_EVENTS.languageChanged, language );
              return true;
            } );
        } );
    }

    function getCurrentLanguageShortName() {
      if ( !_.get( currentLanguage, 'fileName' ) ) {
        return;
      }
      var lang      = currentLanguage.fileName;
      var shortName = lang.split( '-' )[0];
      return shortName;
    }

  }//END CLASS

} )();
