
( function() {
  'use strict';

  angular.module( 'isc.oauth' )
    .controller( 'iscOauthController', iscOauthController );

  /* @ngInject */
  function iscOauthController ( token, user, iscSessionModel, $state ) {
    if ( !_.isEmpty( token ) && !_.isEmpty( user ) ) {
      var loginResponse = _.assignIn( {}, {
        "SessionTimeout" : _.get( token , "expiresIn" , 300 )
      }, {
        "UserData": _.assignIn( {}, user , { userRole : 'provider' } )
      } );

      iscSessionModel.create( loginResponse, true );
      return _.defer( function(  ) {
        $state.go( "authenticated.home", { reload: true } );
      }, 0 );

    } else {
      return _.defer( function(  ) {
        $state.go( "unauthenticated.login", { reload: true } );
      } );
    }
  }// END CLASS

} )();
