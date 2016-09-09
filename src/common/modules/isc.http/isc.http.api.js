/**
 * Created by ryan jarvis on 6/3/15
 */

/**
 * This is a wrapper for angular's $http service
 * @param $http
 * @returns {{get: get, put: put, post: post}}
 *
 * Since any additional properties that's not part of the built-in Angular's config
 * will not be passed as part of the ajax request.
 * We are leveraging fact to pass in any custom attributes we want. E.g. responseAsObject
 *
 * see Angular's $http doc: https://docs.angularjs.org/api/ng/service/$http#usage
 */
( function() {
  'use strict';

  angular.module( 'isc.http' )
    .factory( 'iscHttpapi', iscHttpapi );

  /* @ngInject */
  function iscHttpapi( $http ) {

    return {
      get     : get,
      put     : put,
      post    : post,
      formPost: formPost,
      delete  : deleteApi
    };

    /**
     * Methods: get(url, [config]);
     */
    function get( url, config ) {
      var partialReturnedResponseData = _.partial( returnResponseData, config );
      return $http.get( url, config ).then( partialReturnedResponseData );
    }

    /**
     * Methods: put(url, data, [config]);
     */
    function put( url, data, config ) {
      var partialReturnedResponseData = _.partial( returnResponseData, config );
      return $http.put( url, data, config ).then( partialReturnedResponseData );
    }

    /**
     * Methods: post(url, data, [config]);
     */
    function post( url, data, config ) {
      var partialReturnedResponseData = _.partial( returnResponseData, config );
      return $http.post( url, data, config ).then( partialReturnedResponseData );
    }

    /**
     * Utility function for making FORM POST requests
     * @param url
     * @param data
     * @param config
     * @returns {promise}
     */
    function formPost( url, data, config ) {
      config = _.extend( {
        headers: {
          'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }, config );
      return post( url, data, config );
    }

    /**
     * Methods: delete(url, [config]);
     */
    function deleteApi( url, config ) {
      var partialReturnedResponseData = _.partial( returnResponseData, config );
      return $http.delete( url, config ).then( partialReturnedResponseData );
    }

    /**
     * Private function used to unwrap response and return response.data
     * If config.responseAsObject exists, the entire response object will be returned
     * instead of just the response.data
     *
     * @param config
     * @param response
     * @returns {*} - response.data
     */
    function returnResponseData( config, response ) {
      config = config || {};

      if ( config.responseAsObject ) {
        return response;
      } else {
        return response.data;
      }

    }

  }
} )();

