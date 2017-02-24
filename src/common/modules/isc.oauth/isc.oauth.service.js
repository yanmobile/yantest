( function() {
  'use strict';

  angular.module( 'isc.oauth' ).service( 'iscOauthService', iscOauthService );

  function iscOauthService( $window, md5, iscSessionStorageHelper ) {

    var oauthConfig = {
      'client'          : null,
      'redirectUrl'     : null,
      'scope'           : "user/*.read",
      'responseType'    : 'code',
      'responseMode'    : 'query',
      'oauthBaseUrl'    : null,
      'aud'             : null,
      'requestGrantType': 'authorization_code',
      'refreshGrantType': 'refresh_token'
    };

    var service = {

      get: get,

      configure: configure,

      getAuthorizationUrl: getAuthorizationUrl,
      getRequestTokenUrl : getRequestTokenUrl,
      getRevocationUrl   : getRevocationUrl,
      getUserInfoUrl     : getUserInfoUrl,
      getIntrospectionUrl: getIntrospectionUrl,

      isOuathConfigured: isOuathConfigured,

      getOauthConfig  : getOauthConfig,
      saveOauthConfig : saveOauthConfig,
      clearOauthConfig: clearOauthConfig
    };

    // initialize
    checkOauthState();

    // functions

    function configure( config ) {
      oauthConfig = _.assignIn( {}, oauthConfig, config );
    }

    function isOuathConfigured() {

      return !!_.get( getOauthConfig(), "oauthBaseUrl", false );
    }

    function checkOauthState() {
      var state = iscSessionStorageHelper.getValFromSessionStorage( 'oauthState' );
      if ( !state ) {
        var text = ( ( Date.now() + Math.random() ) * Math.random() ).toString().replace( ".", "" );
        state    = md5.createHash( text );
        iscSessionStorageHelper.setSessionStorageValue( 'oauthState', state );
      }
    }

    function get( key ) {
      return _.get( getOauthConfig(), key, '' );
    }

    function getAuthorizationUrl() {
      var config = getOauthConfig();
      var state  = iscSessionStorageHelper.getValFromSessionStorage( 'oauthState' );

      var clientId = $window.atob( config.client ).split( ":" )[0];

      return config.oauthBaseUrl + '/authorize' + '?' +
        'client_id=' + encodeURIComponent( clientId ) + '&' +
        'redirect_uri=' + encodeURIComponent( config.redirectUrl ) + '&' +
        'response_type=' + encodeURIComponent( config.responseType ) + '&' +
        'response_mode=' + encodeURIComponent( config.responseMode ) + '&' +
        'scope=' + encodeURIComponent( config.scope ) + '&' +
        'aud=' + encodeURIComponent( config.aud ) + '&' +
        'state=' + encodeURIComponent( state );
    }

    function getRevocationUrl() {
      return _.get( getOauthConfig(), 'oauthBaseUrl', '' ) + '/revocation';
    }

    function getUserInfoUrl() {
      return _.get( getOauthConfig(), 'oauthBaseUrl', '' ) + '/userinfo';
    }

    function getIntrospectionUrl() {
      return _.get( getOauthConfig(), 'oauthBaseUrl', '' ) + '/introspection';
    }

    function getRequestTokenUrl() {
      return _.get( getOauthConfig(), 'oauthBaseUrl', '' ) + '/token';
    }

    function saveOauthConfig( config ) {
      config = _.isObject( config ) ? config : {};
      checkOauthState();
      var storedConfig = getOauthConfig();
      var mergedConfig = _.assignIn( {}, storedConfig, config );
      var state        = iscSessionStorageHelper.getValFromSessionStorage( 'oauthState' );
      iscSessionStorageHelper.setSessionStorageValue( state, encodeURIComponent( JSON.stringify( mergedConfig ) ) );

    }

    function getOauthConfig() {
      var state     = iscSessionStorageHelper.getValFromSessionStorage( 'oauthState' );
      var configStr = iscSessionStorageHelper.getValFromSessionStorage( state );
      return configStr ? JSON.parse( decodeURIComponent( configStr ) ) : oauthConfig;
    }

    function clearOauthConfig() {
      var state = iscSessionStorageHelper.getValFromSessionStorage( 'oauthState' );
      iscSessionStorageHelper.removeFromSessionStorage( state );
      iscSessionStorageHelper.removeFromSessionStorage( 'oauthState' );
    }

    return service;
  }

} )();
