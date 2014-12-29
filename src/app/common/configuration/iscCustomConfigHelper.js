/**
 * Created by douglasgoodman on 11/19/14.
 */

(function(){
  'use strict';

  iscCustomConfigHelper.$inject = [ '$log' ];

  function iscCustomConfigHelper( $log ){
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
      stateIsExcluded: stateIsExcluded
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

    // used to check if a top nav element is excluded
    // the interceptor uses this to disallow navigation to that state
    // see iscCustomConfigInterceptor.request()
    function stateIsExcluded( stateName ){
//      //$log.debug( 'iscCustomConfigHelper.stateIsExcluded' );
      if( !allStates[ stateName ] ){
        return;
      }

      return allStates[ stateName ].exclude;
    }


  }// END CLASS

  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'isc.common' )
      .factory( 'iscCustomConfigHelper', iscCustomConfigHelper );
})();
