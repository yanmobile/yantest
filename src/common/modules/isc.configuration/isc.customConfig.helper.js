/**
 * Created by douglasgoodman on 11/19/14.
 */

(function() {
  'use strict';

  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'isc.configuration' )
    .factory( 'iscCustomConfigHelper', iscCustomConfigHelper );

  /* @ngInject */
  function iscCustomConfigHelper( devlog, $state ) {
    devlog.channel( 'iscCustomConfigHelper' ).debug( 'iscCustomConfigHelper LOADED' );

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------

    var factory = {
      getSectionTranslationKeyFromName: getSectionTranslationKeyFromName
    };

    return factory;

    // ----------------------------
    // functions
    // ----------------------------

    // get the top level section's translation key from the state name
    function getSectionTranslationKeyFromName( stateName ) {
      devlog.channel( 'iscCustomConfigHelper' ).debug(
        'iscCustomConfigHelper.getSectionTranslationKeyFromName: ' + stateName );

      var arr         = stateName.split( '.' );
      var sectArr     = arr.splice( 0, 2 ); // the first two values are the section
      var sectionName = sectArr.join( '.' );
      var state       = $state.get( sectionName );

      devlog.channel( 'iscCustomConfigHelper' ).debug( '...sectArr: ', sectArr );
      devlog.channel( 'iscCustomConfigHelper' ).debug( '...sectionName: ', sectionName );
      devlog.channel( 'iscCustomConfigHelper' ).debug( '...state: ', state );

      return state ? state.translationKey : '';
    }

  }// END CLASS

})();
