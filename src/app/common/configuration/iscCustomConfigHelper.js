/**
 * Created by douglasgoodman on 11/19/14.
 */

(function(){
  'use strict';

  iscCustomConfigHelper.$inject = [ '$log', '$state' ];

  function iscCustomConfigHelper( $log, $state ){
//    //$log.debug( 'iscCustomConfigHelper LOADED' );

    // ----------------------------
    // vars
    // ----------------------------

    var allStates = {};

    // ----------------------------
    // class factory
    // ----------------------------

    var factory  = {
      addStates: addStates,
      resetStates: resetStates,
      getStateObj: getStateObj,
      getAllStates: getAllStates,

      stateIsExcluded: stateIsExcluded,

      getCurrentStateTranslationKey: getCurrentStateTranslationKey,
      getSectionTranslationKeyFromName: getSectionTranslationKeyFromName,
      getTranslationKeyFromName: getTranslationKeyFromName,
      isCurrentState: isCurrentState
    };

    return factory;

    // ----------------------------
    // functions
    // ----------------------------

    function addStates( states ){
      //$log.debug( 'iscCustomConfigHelper.addStates' );
      //$log.debug( '...states: ' + JSON.stringify( states ));

      _.forEach( states, function( state ){
        allStates[ state.state ] = state;
      });

      //$log.debug( '...allStates: ' + JSON.stringify( allStates ));
    }

    function resetStates(){
      allStates = {};
    }

    function getAllStates(){
     return allStates;
    }

    function getStateObj( state ){
//      //$log.debug( 'iscCustomConfigHelper.getStateObj: ' + state );
      var s =  allStates[state];
//      //$log.debug( '...s: ' + JSON.stringify( s ));
      return s;

    }

    // ----------------------------
    // used to check if a top nav element is excluded
    // the interceptor uses this to disallow navigation to that state
    // see iscCustomConfigInterceptor.request()
    function stateIsExcluded( stateName ){
//      //$log.debug( 'iscCustomConfigHelper.stateIsExcluded' );
      if( !allStates[ stateName ] ){
        return true;
      }

      return allStates[ stateName ].exclude;
    }

    // ----------------------------
    function getCurrentStateTranslationKey(){
      var stateName = $state.$current.name;
      //$log.debug( 'iscCustomConfigHelper.getCurrentStateTranslationKey: ' + stateName );

      return getTranslationKeyFromName( stateName );
    }


    // get the translation key from the state name
    function getTranslationKeyFromName( stateName ){
      //$log.debug( 'iscCustomConfigHelper.getTranslationKeyFromName: ' + stateName );
      var state = allStates[ stateName ];
      return state? state.translationKey : 'ISC_NOT_FOUND';
    }

    // get the top level section's translation key from the state name
    function getSectionTranslationKeyFromName( stateName ){
      //$log.debug( 'iscCustomConfigHelper.getSectionTranslationKeyFromName: ' + stateName );
      var arr = stateName.split('.');
      var sectArr = arr.splice(0,2); // the first two values are the section
      var sectionName = sectArr.join( '.' );

      //$log.debug( '...sectArr: ' + sectArr );
      //$log.debug( '...sectionName: ' + sectionName );

      var state = allStates[ sectionName ];

      return state? state.translationKey : '';
    }

    // is the state currently active
    function isCurrentState( stateName ){
      //$log.debug( 'iscCustomConfigHelper.isCurrentState: ', stateName );
      return $state.is( stateName );
    }


  }// END CLASS

  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'isc.common' )
      .factory( 'iscCustomConfigHelper', iscCustomConfigHelper );
})();
