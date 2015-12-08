/**
 * Created by douglas goodman on 10/30/15.
 */

(function () {
  'use strict';

  iscLanguageService.$inject = [ '$log', '$window', '$translate', 'iscCustomConfigService', 'iscSessionStorageHelper' ];

  function iscLanguageService ($log, $window, $translate, iscCustomConfigService, iscSessionStorageHelper) {
    //$log.debug( 'iscLanguageService LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    var languages;
    var showLanguageDropDown = false;
    var selectedLanguage = null;
    var initIsDone = false;

    // ----------------------------
    // class factory
    // ----------------------------
    var service = {
      showDropDown: showDropDown,
      getLanguages: getLanguages,
      getSelectedLanguage: getSelectedLanguage
    };


    return service;

    // ----------------------------
    // functions
    // ----------------------------

    function getLanguages () {
      if (!initIsDone) {
        doInit ();
      }
      return languages;
    }

    function showDropDown () {
      if (!initIsDone) {
        doInit ();
      }

      return showLanguageDropDown;
    }

    function getSelectedLanguage () {
      if (!initIsDone) {
        doInit ();
      }

      return selectedLanguage;
    }

    function doInit () {

      languages = iscCustomConfigService.getLanguageConfig ();

      if (languages) {

        if (languages.length > 1) {
          showLanguageDropDown = true;

          var currentLanguage = iscSessionStorageHelper.getValFromSessionStorage ('currentLanguage');

          if (!!currentLanguage) {
            selectedLanguage = currentLanguage;
          }
          else {

            var lang = $window.navigator.language || $window.navigator.userLanguage;
            selectedLanguage = languages[ 0 ];

            _.forEach (languages, function (language) {

              var myFileName = language.fileName.toUpperCase ();
              var myLang = lang.toUpperCase ();

              if (myFileName === myLang) {
                selectedLanguage = language;
                //console.log('selected full match ', selectedLanguage);
                return false;
              }
              else if (myFileName.indexOf (myLang) !== -1) {
                selectedLanguage = language;
                //console.log('selected partial match ', selectedLanguage);
                return false;
              }
            });
          }

          $translate.use (selectedLanguage.fileName);

          initIsDone = true;
        }
      }
    }
    // ----------------------------

  }//END CLASS


  // ----------------------------
  // injection
  // ----------------------------

  angular.module ('iscNavContainer')
      .factory ('iscLanguageService', iscLanguageService);

}) ();
