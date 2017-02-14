
( function() {
  'use strict';

  angular.module( 'isc.oauth' , ['isc.common', 'angular-md5'] )
    .config( function( iscStateProvider ) {
      iscStateProvider.state( getStates() );
    } );

  /**
   * @description this is where module specific states are defined.
   *  Be sure not to make any method name or the structural changes; any changes may prevent ```slush isc:page``` from working properly
   *
   * @returns {} -- UI router states
   */
  function getStates() {
    return {
      'unauthenticated.launch': {
        url            : 'launch?code&state&iss&launch',
        template       : '',
        state          : 'unauthenticated.launch',
        layout         : "layout/tpls/blank.html",
        roles          : ["*"],
        landingPageFor : ["*"],
        excludeAuthUser: true,
        displayOrder   : 1,
        controller     : "iscOauthController as oauthCtrl",
        resolve        : {
          /* @ngInject */
          baseUri    : function( $stateParams, appConfig, iscOauthService, iscHttpapi, iscSessionStorageHelper ) {
            var storedConfig = iscOauthService.getOauthConfig() || {};
            // return if baseUrl available in stored config
            if ( storedConfig.oauthBaseUrl ) {
              return storedConfig.oauthBaseUrl;
            }

            // return if baseUrl available in appconfig
            if ( _.get( appConfig, "oauth.oauthBaseUrl", "" ) ) {
              iscOauthService.saveOauthConfig( appConfig.oauth );
              return appConfig.oauth.oauthBaseUrl;
            }

            var params = _.pickBy( $stateParams, _.identity );

            var fhirServerUrl;

            if ( params.iss ) {
              fhirServerUrl = params.iss;
            } else {
              fhirServerUrl = _.get( appConfig, 'oauth.iss', '' );
            }

            if ( fhirServerUrl ) {

              if ( !_.endsWith( fhirServerUrl, 'metadata' ) ) {
                fhirServerUrl += ( ( fhirServerUrl.substr( -1 ) !== '/' ) ? "/metadata" : "metadata" ) ;
              }
              return iscHttpapi.get( fhirServerUrl ).then( function( response ) {

                var smartExtension = response.rest[0].security.extension.filter( function( e ) {
                  return ( e.url === "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris" );
                } );

                var oauthUri = _.get( smartExtension[0].extension[0], "valueUri", "" );
                var baseUri  = oauthUri.slice( 0, oauthUri.lastIndexOf( "/" ) );
                var config = _.assignIn( {}, appConfig.oauth, params, { "oauthBaseUrl": baseUri } );


                iscOauthService.saveOauthConfig( config );
                iscSessionStorageHelper.setSessionStorageValue( "fhirMetaData", response );
                return baseUri;

              } );
            }
          },
          /* @ngInject */
          token  : function( $stateParams, iscOauthApi, iscSessionStorageHelper ) {

            var params = _.pickBy( $stateParams, _.identity );

            var isSameState = params.state === iscSessionStorageHelper.getValFromSessionStorage( 'oauthState' ) ;

            if ( params.code && isSameState ) {

              return iscOauthApi.requestToken( params.code );
            }
            return {};

          },

          /* @ngInject */
          user : function( token, iscOauthApi ) {

            if ( !_.isEmpty( token ) ) {
              return iscOauthApi.getUserInfo();
            }
            return {};
          }
        }

      }
    };
  }

} )();

