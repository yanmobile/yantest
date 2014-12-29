/**
 * Created by douglasgoodman on 11/29/14.
 */
/**
 * Created by douglasgoodman on 11/19/14.
 */

(function(){
  'use strict';

  iscHistoryService.$inject = [ '$log', '$rootScope' ];

  function iscHistoryService( $log, $rootScope ){
//    //$log.debug( 'iscHistoryService LOADED' );

    // ----------------------------
    // vars
    // ----------------------------

    var DEFAULT_MAX_HISTORY = 8;
    var history = [];
    var maxHistoryCount = DEFAULT_MAX_HISTORY;
    var currentState;

    // ----------------------------
    // class factory
    // ----------------------------

    var service  = {
      addToHistory: addToHistory,
      resetHistory: resetHistory,

      getHistory: getHistory,
      getCurrentState: getCurrentState,

      getMaxHistoryCount: getMaxHistoryCount,
      setMaxHistoryCount: setMaxHistoryCount,

      currentStateInSameSubsection: currentStateInSameSubsection
    };

    return service;

    // ----------------------------
    // functions
    // ----------------------------

    function addToHistory( stateObj, prevStateObj ){
//      //$log.debug( 'iscHistoryService.addToHistory' );
//      //$log.debug( '...stateObj: ' + JSON.stringify( typeof stateObj ));

      // ng-repeat doesnt allow duplicate objects, so make a copy
      var currentStateObj = angular.copy( stateObj );

      removeLastIfSameSubsection( prevStateObj, currentStateObj );
      addWhenPrevStateIsDifferent( prevStateObj, currentStateObj );
      trimWhenOverMaxHistoryCount();

      currentState = _.last( history).state;
    }

    function removeLastIfSameSubsection( prevStateObj, currentStateObj ){
      if( !!prevStateObj && currentStateInSameSubsection( currentStateObj.state, prevStateObj.state )){
        history.pop();
      }
    }

    function addWhenPrevStateIsDifferent( prevStateObj, currentStateObj ){
      if( !prevStateObj ){
        history.push( currentStateObj );
      }
      else if( prevStateObj.state !== currentStateObj.state ){
        var lastStateObj = _.last( history );
        if( lastStateObj.state !== currentStateObj.state ){
          history.push( currentStateObj );
        }
      }
    }

    function trimWhenOverMaxHistoryCount(){
      if( history.length > maxHistoryCount ){
        history.shift();
      }
    }

    function currentStateInSameSubsection( currentState, prevState ){
      var currArr = currentState.split( '.' );
      var prevArr = prevState.split( '.' );

      // currently the pages have a form of "index.page.subsection"
      // if length < 3 it means theres no subsection
      // and if the two arrays dont have the same length, it means they are different pages or subsections
      if( currArr.length < 3 || currArr.length !== prevArr.length ){
        return false;
      }

      var curSubsection = currArr[ (currArr.length -2) ];
      var lastSubsection = prevArr[ (prevArr.length -2) ];

      return curSubsection === lastSubsection;
    }

    function resetHistory(){
      history = [];
    }

    // -----------------
    function getHistory(){
      return history;
    }

    // -----------------
    function getCurrentState(){
      return currentState;
    }

    // -----------------
    function getMaxHistoryCount(){
      return maxHistoryCount;
    }

    function setMaxHistoryCount( val ) {
      maxHistoryCount = val;
    }

  }// END CLASS

  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'isc.common' )
      .factory( 'iscHistoryService', iscHistoryService );
})();
