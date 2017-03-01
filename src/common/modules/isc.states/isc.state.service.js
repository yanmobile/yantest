/**
 * Created by douglas goodman on 3/9/15.
 */

( function() {
  'use strict';

  // ----------------------------
  // injection
  // ----------------------------

  angular.module( 'isc.states' )
    .provider( 'iscState', iscState );

  /* @ngInject */
  function iscState( $stateProvider, $urlRouterProvider, iscCustomConfigServiceProvider ) {

    // ----------------------------
    // class factory
    // ----------------------------
    var service = {
      state     : state,
      rewriteUrl: rewriteUrl,
      $get      : _.noop
    };

    return service;

    /**
     * Format:
     *
     * @param tabs
     * {
      'index.home': {
        url           : 'home',
        templateUrl   : 'home/home.html',
        controller    : 'homeController',
        state         : 'index.home',
        translationKey: 'My Home',
        roles         : ['*'],
        displayOrder  : 1
      }
     */
    function state( tabs ) {

      _.forEach( tabs, function( config, state ) {

        if ( config.roles ) {
          addPermissions();
          addLandingPages();
        }

        function addPermissions() {
          var permissions = _.makeObj( state, config.roles );
          iscCustomConfigServiceProvider.addRolePermissions( permissions );
        }

        function addLandingPages() {
          var landingPageRoles = _.get( config, 'landingPageFor', [] );
          if ( landingPageRoles.length > 0 ) {
            _.forEach( landingPageRoles, function( role ) {
              iscCustomConfigServiceProvider.setLandingPageFor( role, config.state );
            } );
          }
        }

        // ----------------------------
        // state management
        // ----------------------------
        $stateProvider.state( state, config );
      } );
    }

    /**
     * re-writes the url based on the regexp with the .replace() callback

     * ui-router: https://github.com/angular-ui/ui-router/wiki/URL-Routing#rule-for-custom-url-handling
     *
     * @param regexp - the url pattern to match
     * @param replace - string value use as replacement or callback to handle replacement
     * @param setup - to pass $inject and $location to the calling method
     */
    function rewriteUrl( regexp, replace, setup ) {

      //ui-router doc: https://github.com/angular-ui/ui-router/wiki/URL-Routing#rule-for-custom-url-handling
      $urlRouterProvider.rule( function( $injector, $location ) {
        setup = setup || _.noop;
        setup( $injector, $location );

        //what this function returns will be set as the $location.url
        var path       = $location.path();
        var normalized = path.replace( regexp, replace );

        if ( path !== normalized ) {
          //instead of returning a new url string, I'll just change the $location.path directly
          //so I don't have to worry about constructing a new url string and so a new state change is not triggered
          $location.replace().path( normalized );
        }

        // because we've returned nothing, no state change occurs
      } );

    }
  }

} )();

