( function() {
  'use strict';

  angular.module( 'isc.states' )
    .factory( 'iscStateInit', iscStateInit );

  /* @ngInject */
  function iscStateInit( $q ) {
    var initFunctions = {},
        hasRun        = false;

    return {
      run   : run,
      config: config
    };

    /**
     * Configures this service by passing in a configuration object.
     *
     * @param {Object} configuration - Include an initFunction property as an object or array,
     * containing the asynchronous functions that should be resolved during app initialization.
     */
    function config( configuration ) {
      var functions = configuration.initFunctions;
      if ( functions ) {
        if ( _.isArray( functions ) ) {
          _.forEach( functions, function( fn ) {
            initFunctions[( getNextKey() ).toString()] = fn;
          } );
        }
        else if ( _.isObject( functions ) ) {
          _.forEach( functions, function( fn, name ) {
            _.set( initFunctions, name, fn );
          } );
        }
      }

      // Fills in an auto-index key
      function getNextKey( startKey ) {
        var key = parseInt( startKey );
        key     = _.isNaN( key ) ? 0 : key;

        if ( !initFunctions.hasOwnProperty( key.toString() ) ) {
          return key;
        }
        else {
          return getNextKey( ++key );
        }
      }
    }

    /**
     * Executes all functions provided to config and returns a promise with all the resolutions.
     * @param forceRun - If truthy, forces the init functions to run even if they
     * have already been run
     * @returns {Promise}
     */
    function run( forceRun ) {
      var promises    = {};
      var initPromise = $q.defer();

      if ( !hasRun || forceRun ) {
        hasRun = true;
        _.forEach( initFunctions, function( fn, name ) {
          if ( _.isFunction( fn ) ) {
            var deferred   = $q.defer();
            promises[name] = deferred.promise;
            fn().then( function( results ) {
              deferred.resolve( results );
            } );
          }
        } );
      }

      $q.all( promises ).then( function( results ) {
        initPromise.resolve( results );
      } );

      return initPromise.promise;
    }
  }//END CLASS

} )();

