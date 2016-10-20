/**
 * Created by hzou on 12/8/15.
 */

( function() {
  'use strict';

  var _appConfig;

  angular
    .module( 'devtools', ['httpbackup'] )
    .config( config )
    .run( run );

  function config( $httpProvider, httpBackupCacheProvider, appConfig ) {
    _appConfig = appConfig;
    if ( _appConfig.useCachedHttpResponses ) {
      $httpProvider.interceptors.push( 'httpBackupInterceptor' );
      httpBackupCacheProvider.setCachingRules( [
        new RegExp( "^(?!.*[.]html$).*$" )  //ignore file ending with "*.html"
      ] );
    }
  }

  function run( $rootScope, AUTH_EVENTS, iscNotificationService, httpBackupCache ) {

    if ( _appConfig.useCachedHttpResponses ) {
      $rootScope.$on( 'HttpBackup_activated', function( response, data ) {
        iscNotificationService.showAlert( {
          title  : "Ajax failed. Switching to backup",
          content: "Using Cached for: " + data.url
        } );
      } );

      // ------------------------
      // sessionTimeout event
      $rootScope.$on( AUTH_EVENTS.logout, function() {
        httpBackupCache.clear();
      } );
    }
  }

} )();
