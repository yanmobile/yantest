/**
 * Created by douglasgoodman on 11/18/14.
 */

(function(){
  'use strict';

  iscSessionModel.$inject = [ '$log', '$rootScope', '$window', '$interval', '$timeout', 'iscSessionStorageHelper', 'AUTH_EVENTS' ];

  function iscSessionModel( $log, $rootScope, $window, $interval, $timeout, iscSessionStorageHelper, AUTH_EVENTS ){
//    //$log.debug( 'iscSessionModel LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    var credentials = null;
    var currentUser = null;

    // contains a list of states with restricted permission
    // and what those permissions are
    // anything not forbidden is presumed to be allowed
    var statePermissions = null;

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

      getCredentials: getCredentials,

      getCurrentUser: getCurrentUser,
      setCurrentUser: setCurrentUser,

      getStatePermissions: getStatePermissions,
      setStatePermissions: setStatePermissions,

      isAuthorized: isAuthorized,
      isAuthenticated: isAuthenticated,
      isWhiteListed: isWhiteListed,

      setNoLoginRequiredList: setNoLoginRequiredList,

      getFullName: getFullName,

      // private methods that I think still should be unit tested
      getUnitTestPrivate: getUnitTestPrivate
    };

    return model;

    // ----------------------------
    // functions
    // ----------------------------

    function create( sessionData ){
      //$log.debug( 'iscSessionModel.create');
      //$log.debug( '...sessionData: ' + JSON.stringify( sessionData ));

      // store the login response for page refreshes
      iscSessionStorageHelper.setLoginResponse( sessionData );

      credentials = {}; // for now we arent using credentials
      setCurrentUser( sessionData.UserData );

      // set the timeout
      //sessionTimeoutInSeconds = 30;
      sessionTimeoutInSeconds = sessionData.SessionTimeout;

      $rootScope.$broadcast( AUTH_EVENTS.loginSuccess );
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
    }

    // --------------
    function initSessionTimeout( timeoutCounter ){
      //$log.debug( 'iscSessionModel.initSessionTimeout');
      //$log.debug( '...timeoutCounter: ' + timeoutCounter );

      // on page refresh we get this from sessionStorage and pass it in
      // otherwise assume it to be 0
      sessionTimeoutCounter = (timeoutCounter > 0) ? timeoutCounter : 0;
      //$log.debug( '...sessionTimeoutCounter: ' + sessionTimeoutCounter );

      sessionTimeoutWarning = parseInt( sessionTimeoutInSeconds *.75 );

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

        // save off the remaining time so that on page refresh we can start from here
        var remainingTime = sessionTimeoutInSeconds - sessionTimeoutCounter;
        iscSessionStorageHelper.setSessionTimeoutCounter( sessionTimeoutCounter );
        //$log.debug( '...TICK ', remainingTime );
        //$log.debug( '...sessionTimeoutInSeconds ' + sessionTimeoutInSeconds );
        //$log.debug( '...sessionTimeoutCounter ' + sessionTimeoutCounter );
        //$log.debug( '...sessionTimeoutWarning ' + sessionTimeoutWarning );
        //$log.debug( '...remainingTime ' + remainingTime );

        if( sessionTimeoutCounter >= sessionTimeoutWarning && sessionTimeoutCounter < sessionTimeoutInSeconds ){
          // warn
          //$log.debug( '...WARN ' + remainingTime );
          $rootScope.$broadcast( AUTH_EVENTS.sessionTimeoutWarning );
        }
        else if( sessionTimeoutCounter >= sessionTimeoutInSeconds ){
          //$log.debug( '...logging out ' + remainingTime );
          // logout
          $rootScope.$broadcast( AUTH_EVENTS.sessionTimeout );
          stopSessionTimeout();
        }
      }, 1000)
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
      //stopSessionTimeout();
      //doSessionTimeout();
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
    function getStatePermissions(){
      return statePermissions;
    }

    function setStatePermissions( val ){
      //$log.debug( 'iscSessionModel.setStatePermissions');
      //$log.debug( '...val: ' + angular.toJson( val ));
      statePermissions = val;
      iscSessionStorageHelper.setStoredStatePermissions( statePermissions );
    }

    // --------------
    function isAuthenticated(){
      //$log.debug( 'iscSessionModel.isAuthenticated', currentUser );
      return !_.isEmpty( currentUser );
    }

    function isAuthorized( stateName ){
      //$log.debug( 'iscSessionModel.isAuthorized' );
      //$log.debug( '...stateName: ' + stateName  );

      if( !currentUser ){
        //$log.debug( '...no user!' );
        return false;
      }

      var permitted = getPermitted( stateName );
      var authenticated = isAuthenticated();
      //$log.debug( '...permitted: ' + permitted );
      //$log.debug( '...authenticated: ' + authenticated );
      //$log.debug( '...currentUser: ' + JSON.stringify(currentUser) );

      return permitted && authenticated;
    }

    /**
     * private
     */
    function getPermitted( stateName ){
      //$log.debug( 'iscSessionModel.getPermitted' );
      //$log.debug( '...stateName: ' + stateName );
      //$log.debug( '...statePermissions: ' + JSON.stringify( statePermissions ));

      if( !currentUser ){
        //$log.debug( '...no user!' );
        return false;
      }

      var stateToCheck = getStateToCheck( stateName );
      //$log.debug( '...stateToCheck: ' + stateToCheck  );

      return statePermittedToRole( stateToCheck );
    }

    /**
     * private
     * if the stateName is included in the statePermissions, return it,
     * otherwise return the state you passed in
     */
    function getStateToCheck( stateName ){
      var keys = _.keys( statePermissions );
      _.forEach( keys, function( key ){
        //$log.debug( '...key: ' + key  );
        if( stateName.indexOf( key ) !== -1 ){
          return key;
        }
      });

      return stateName;
    }

    /**
     * private
     * with no logged in user, return false
     * if the stateName is included in the statePermissions, return whether the user has that role
     * otherwise return true (not forbidden means allowed)
     */
    function statePermittedToRole( stateName ){
      //$log.debug( 'iscSessionModel.statePermittedToRole' );
      //$log.debug( '...statePermissions: ' + JSON.stringify( statePermissions ));
      //$log.debug( '...stateName: ' + stateName );

      if( !currentUser ){
        return false;
      }

      var role = currentUser.userRole;
      //$log.debug( '...role: ' + role  );

      if(_.has( statePermissions, stateName )){
        var permittedRoles = statePermissions[ stateName ];
        //$log.debug( '...permittedRoles: ' + JSON.stringify( permittedRoles ));
        return _.indexOf( permittedRoles, role ) !== -1;
      }

      //$log.debug( '...not forbidden, ergo permitted');
      return true;
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

    function getNoLoginRequiredList(){
      return noLoginRequiredList;
    }

    // --------------
    function getFullName(){
      //$log.debug( 'iscSessionModel.getFullName');
      return !!currentUser ? currentUser.FullName : '';
    }

    /**
     * PRIVATE, FOR UNIT TESTING ONLY
     * @returns {{statePermittedToRole: statePermittedToRole, doSessionTimeout: doSessionTimeout, getPermitted: getPermitted, getStateToCheck: getStateToCheck}}
     */
    function getUnitTestPrivate() {
      return {
        statePermittedToRole: statePermittedToRole,
        getStateToCheck: getStateToCheck
      }
    }

  }// END CLASS


  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'isc.common' )
    .factory( 'iscSessionModel', iscSessionModel );

})();
