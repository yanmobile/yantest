/**
 * Created by douglasgoodman on 11/18/14.
 *
 * the user needs a role for authentication, but that doesnt exist on the server
 * this sets the role according to whether one is a proxy or not
 */

(function(){
  'use strict';

  iscUserRoleHelper.$inject = [ '$log' ];

  function iscUserRoleHelper( $log ){
//    //$log.debug( 'iscUserRoleHelper LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------
    var service = {
      setRoleForUser: setRoleForUser
    };

    return service;

    // ----------------------------
    // functions
    // ----------------------------

    function setRoleForUser( currentUser ){
      //$log.debug( 'iscUserRoleHelper.setRoleForUser',currentUser.ProxyOnly );
      if( !currentUser) return;

      currentUser.userRole = (currentUser.hasOwnProperty('ProxyOnly') && currentUser.ProxyOnly === 0) ? 'user' : 'proxy';
    }

  }// END CLASS

  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'iscHsCommunityAngular' )
    .factory( 'iscUserRoleHelper', iscUserRoleHelper );

})();
