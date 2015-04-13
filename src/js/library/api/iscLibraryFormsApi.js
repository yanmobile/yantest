/**
 * Created by douglasgoodman on 11/18/14.
 */

(function(){
  'use strict';

  iscLibraryFormsApi.$inject = [ '$log', '$http', '$q','iscLibraryModel' ];

  function iscLibraryFormsApi( $log, $http, $q, iscLibraryModel ){
    //$log.debug( 'iscLibraryFormsApi LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------

    var api = {
      get: get
    };

    return api;

    // ----------------------------
    // functions
    // ----------------------------

    function get(){
      //$log.debug( 'iscLibraryFormsApi.get');

      var deferred = $q.defer();

      $http.get( 'assets/mockData/library/library_forms.json' )

          .success( function( result ){
            iscLibraryModel.setFormData( result.children );
            deferred.resolve( result );
          })

          .error( function( error ){
            //$log.debug( 'iscLibraryFormsApi.ERROR');
            deferred.reject( error );
          });

      return deferred.promise;
    }

  }// END CLASS


  // ----------------------------
  // inject
  // ----------------------------
  angular.module( 'iscLibrary' )
      .factory( 'iscLibraryFormsApi', iscLibraryFormsApi );

})();
