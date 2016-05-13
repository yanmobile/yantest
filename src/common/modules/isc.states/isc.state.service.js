/**
 * Created by douglas goodman on 3/9/15.
 */

(function() {
  'use strict';

  // ----------------------------
  // injection
  // ----------------------------

  angular.module( 'isc.states' )
    .provider( 'iscState', iscState );

  /* @ngInject */
  function iscState( $stateProvider, iscCustomConfigServiceProvider ) {

    // ----------------------------
    // class factory
    // ----------------------------
    var service = {
      state: state,
      $get : function() {
      }
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

      //todo: decorate $stateProvider.state
      _.forEach( tabs, function( config, state ) {

        if ( config.roles ) {
          addPermissions();
          addTopLevelTabs();
          addLandingPages();
        }

        function addPermissions() {
          var permissions = _.makeObj( state, config.roles );
          iscCustomConfigServiceProvider.addRolePermissions( permissions );
        }

        function addTopLevelTabs() {
          // displayOrder is a positive number
          if ( _.get( config, 'displayOrder', -1 ) > 0 ) {
            config.roles.forEach(function( role ) {
              var addTopTab = _.makeObj( role, _.makeObj( state, config ) );
              iscCustomConfigServiceProvider.addTopNavTab( addTopTab );
            } );
          }
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
  }

} )();

