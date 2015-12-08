/**
 * Created by douglasgoodman on 11/18/14.
 */

(function(){
  'use strict';

  iscSessionModel.$inject = [ '$log', '$rootScope', '$interval', 'iscSessionStorageHelper', 'AUTH_EVENTS' ];

  function iscSessionModel( $log, $rootScope, $interval, iscSessionStorageHelper, AUTH_EVENTS ){
//    //$log.debug( 'iscSessionModel LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    var credentials = null;
    var currentUser = null;

    // contains a list of states with restricted permission
    // and what those permissions are
    // anything not forbidden is presumed to be allowed
    //var statePermissions = null;
    var permittedStates;

    var sessionTimeoutInSeconds = 0;
    var sessionTimeoutCounter = 0;
    var sessionTimeoutWarning = 0;
    var intervalPromise;

    // dont require login for these views
    var noLoginRequiredList = [ 'index', 'index.login' ];
    var noLoginRequiredWildcardList = [];

    // ----------------------------
    // class factory
    // ----------------------------

    var model = {
      create: create,
      destroy: destroy,

      initSessionTimeout: initSessionTimeout,
      stopSessionTimeout: stopSessionTimeout,
      resetSessionTimeout: resetSessionTimeout,
      getRemainingTime: getRemainingTime,

      getCredentials: getCredentials,

      getCurrentUser: getCurrentUser,
      setCurrentUser: setCurrentUser,

      getPermittedStates: getPermittedStates,
      setPermittedStates: setPermittedStates,

      isAuthorized: isAuthorized,
      isAuthenticated: isAuthenticated,
      isWhiteListed: isWhiteListed,

      setNoLoginRequiredList: setNoLoginRequiredList,

      getFullName: getFullName
    };

    return model;

    // ----------------------------
    // functions
    // ----------------------------

    function create( sessionData, isSessionNew ){
      //$log.debug( 'iscSessionModel.create');
      // $log.debug( '...sessionData: ' + JSON.stringify( sessionData  ));

      // store the login response for page refreshes
      iscSessionStorageHelper.setLoginResponse( sessionData );

      credentials = {}; // for now we arent using credentials
      setCurrentUser( sessionData.UserData );

      // set the timeout
      //sessionTimeoutInSeconds = 10; // DEV ONLY
      sessionTimeoutInSeconds = sessionData.SessionTimeout;

      if (isSessionNew) {
        //$log.debug( '...new ' );
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      }
      else{
        // $log.debug( '...resumed ' );
        $rootScope.$broadcast( AUTH_EVENTS.sessionResumedSuccess );
      }
    }

    function destroy(){
      //$log.debug( 'iscSessionModel.destroy');

      // create a session with null data
      currentUser = null;
      credentials = null;

      // remove the user data so that the user
      // WONT stay logged in on page refresh
      iscSessionStorageHelper.destroy();
      stopSessionTimeout();

      $rootScope.$broadcast( AUTH_EVENTS.logoutSuccess );
    }

    // --------------
    function initSessionTimeout( timeoutCounter ){
      //$log.debug( 'iscSessionModel.initSessionTimeout');
      //$log.debug( '...timeoutCounter: ' + timeoutCounter );

      // on page refresh we get this from sessionStorage and pass it in
      // otherwise assume it to be 0
      sessionTimeoutCounter = (timeoutCounter > 0) ? timeoutCounter : 0;
      //$log.debug( '...sessionTimeoutCounter: ' + sessionTimeoutCounter );
      //$log.debug( '...sessionTimeoutInSeconds: ' + sessionTimeoutInSeconds );

      sessionTimeoutWarning = parseInt( sessionTimeoutInSeconds *0.75 );
      //$log.debug( '...sessionTimeoutWarning: ' + sessionTimeoutWarning );

      doSessionTimeout();
    }

    /**
     * private
     */
    function doSessionTimeout(){
      //$log.debug( 'iscSessionModel.doSessionTimeout');

      if( intervalPromise ){
        //$log.debug( '...already there' );
        return;
      }

      intervalPromise = $interval( function(){
        sessionTimeoutCounter++;

        iscSessionStorageHelper.setSessionTimeoutCounter( sessionTimeoutCounter );
        //$log.debug( '...TICK ' );
        //$log.debug( '...sessionTimeoutInSeconds ' + sessionTimeoutInSeconds );
        //$log.debug( '...sessionTimeoutCounter ' + sessionTimeoutCounter );
        //$log.debug( '...sessionTimeoutWarning ' + sessionTimeoutWarning );
        //$log.debug( '...remainingTime ' + remainingTime );

        if( sessionTimeoutCounter >= sessionTimeoutWarning && sessionTimeoutCounter < sessionTimeoutInSeconds ){
          // warn
          //$log.debug( '...WARN ' + sessionTimeoutCounter );
          $rootScope.$broadcast( AUTH_EVENTS.sessionTimeoutWarning );
        }
        else if( sessionTimeoutCounter >= sessionTimeoutInSeconds ){
          //$log.debug( '...TIMEOUT ' + sessionTimeoutCounter );
          // logout
          $rootScope.$broadcast( AUTH_EVENTS.sessionTimeout );
          iscSessionStorageHelper.setShowTimedOutAlert( true );
          stopSessionTimeout();
        }
      }, 1000);
    }

    function stopSessionTimeout() {
      //$log.debug( 'iscSessionModel.stopSessionTimeout');
      if( angular.isDefined( intervalPromise )){
        //$log.debug( '...cancelling');
        $interval.cancel( intervalPromise );
        intervalPromise = null;
      }

      //$log.debug( '...intervalPromise',intervalPromise);
    }

    function resetSessionTimeout(){
      //$log.debug( 'iscSessionModel.resetSessionTimeout');
      sessionTimeoutCounter = 0;
      iscSessionStorageHelper.setSessionTimeoutCounter( sessionTimeoutCounter );
      //stopSessionTimeout();
      //doSessionTimeout();
    }

    function getRemainingTime(){
      var remaining = sessionTimeoutInSeconds - sessionTimeoutCounter;
      return remaining;
    }

    // --------------
    function getCredentials(){
      return credentials;
    }

    // --------------
    function getCurrentUser(){
      return currentUser;
    }

    function setCurrentUser( user ){
      //$log.debug( 'iscSessionModel.setCurrentUser');
      //$log.debug( '...user: ' + angular.toJson( user ));
      currentUser = user;
    }


    // --------------
    function getPermittedStates(){
      return permittedStates;
    }

    function setPermittedStates( val ){
      permittedStates = val;
    }

    // --------------
    function isAuthenticated(){
      //$log.debug( 'iscSessionModel.isAuthenticated', currentUser );
      return !_.isEmpty( currentUser );
    }

    function isAuthorized( stateName ){
      //$log.debug( 'iscSessionModel.isAuthorized' );
      //$log.debug( '...stateName: ' + stateName  );

      // everything permitted
      if (_.contains( permittedStates, '*')) {
        //$log.debug('...allowing everything');
        //turn everything on
        return true;
      }

      // otherwise check for wild cards or existence
      var wildCardSuperState = getWildCardStateForState( stateName );
      //$log.debug('...wildCardSuperState: ' + wildCardSuperState);

      if (wildCardSuperState) {
        //$log.debug('...stateName.indexOf( wildCardSuperState ): ' + stateName.indexOf( wildCardSuperState ));
        // weird bug in lodash where if the stateName === wildCardSuperState, _.indexOf returns -1
        // so using this other form for checking
        return stateName.indexOf( wildCardSuperState ) > -1;
      }
      else {
        return _.indexOf(permittedStates, stateName) > -1;
      }
    }

    /**
     * private
     * @param stateName String
     * @returns String wildCardSuperState || undefined
     */
    function getWildCardStateForState( stateName ){
      //$log.debug('...getWildCardStateForState, stateName', stateName);

      var wildCardSuperState;
      var stateToCheck;

      _.forEach( permittedStates, function (permittedState) {
        var starIdx = permittedState.indexOf('.*');
        if (starIdx > -1) {
          // got a wildcard
          stateToCheck = permittedState.substr(0, starIdx);
          //$log.debug('...stateToCheck: ' + stateToCheck);
          if( stateName.indexOf( stateToCheck ) >-1 || stateName === stateToCheck ){
            //$log.debug('...gotcha');
            wildCardSuperState = stateToCheck;
          }
        }
      });

      return wildCardSuperState;
    }

    /**
     * Returns whether a state is whitelisted
     * Also accepts wildcards in the form of 'index.stateName.*'
     * NOTE: for wildcards, the wildcard is assumed to be the last state and 'index' the first state
     * ie 'index.*.stateName' will fail
     *
     * @param stateName {string}
     * @returns {boolean}
     */
    function isWhiteListed( stateName ){
      //$log.debug( 'iscSessionModel.isWhiteListed' );
      //$log.debug( '...noLoginRequiredList: ' + JSON.stringify(noLoginRequiredList) );
      //$log.debug( '...stateName: ' + stateName );

      var whitelisted = false;

      if( _.indexOf( noLoginRequiredList, stateName ) !== -1 ){
        whitelisted = true;
      }
      else{
        // create a map of values that shows
        // whether the stateName matches anything in the wildcard list
        var map =_.map( noLoginRequiredWildcardList, function( state ){
          return _.contains( stateName, state );
        });

        // is anything in the map true?
        whitelisted = _.some( map );
      }

      //$log.debug( '...whitelisted: ' + whitelisted );
      return whitelisted;
    }

    // --------------
    function setNoLoginRequiredList( val ){
      //$log.debug( 'iscSessionModel.setNoLoginRequiredList: ' + JSON.stringify( val ));

      // reset the lists
      noLoginRequiredList = [];
      noLoginRequiredWildcardList = [];

      // then populate wildcard states and non-wildcard states
      _.forEach( val, function( state ){
        if( state.indexOf( '.*' ) !== -1 ){
          noLoginRequiredWildcardList.push( state.slice( 0, -2 ));
        }
        else{
          noLoginRequiredList.push( state );
        }
      });

      //$log.debug( '...noLoginRequiredList: ' + JSON.stringify( noLoginRequiredList ));
      //$log.debug( '...noLoginRequiredWildcardList: ' + JSON.stringify( noLoginRequiredWildcardList ));
    }

    // --------------
    function getFullName(){
      //$log.debug( 'iscSessionModel.getFullName');
      return !!currentUser ? currentUser.FullName : '';
    }


  }// END CLASS


  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'isc.common' )
      .factory( 'iscSessionModel', iscSessionModel );

})();

