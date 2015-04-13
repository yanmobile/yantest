/**
 * Created by douglas goodman on 3/17/15.
 */

(function(){
  'use strict';

  iscLookupProvider.$inject = [ '$log'];

  function iscLookupProvider( $log ){
//    //$log.debug( 'iscLookupProvider LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------
    var directive = {
      restrict: 'EA',
      replace: true,
      scope: {
        listData: '='
      },
      link: link,
      templateUrl: 'messages/workflows/directives/lookupProvider/iscLookupProvider.html'
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------

    function link( scope, elem, attr ){
      //$log.debug( 'iscLookupProvider.link, listData', scope.listData);
      //$log.debug( '...favoritesList', scope.favoritesList);

      var defaultProvider = {label:"ISC_NO_PROVIDER_SELECTED", data: 0};

    if( !scope.listData.selectedProvider ){
      scope.listData.selectedProvider = defaultProvider;
    }

      scope.hideSelectedProvider = false;

      scope.searchProviders = function(){
        scope.hideSelectedProvider = true;
      };

      scope.closeSearchProviders = function(){
        scope.hideSelectedProvider = false;
      };

      scope.onSelectFavorite = function( provider ){
        scope.listData.selectedProvider = provider;
        scope.doValidation();

        //$log.debug( 'iscLookupProvider.onSelectFavorite', scope.listData);
      };

      scope.doValidation = function(){
        scope.listData.isComplete = scope.isValid();
      };

      scope.isValid = function(){
        return !!scope.listData.selectedProvider && !_.isEqual( scope.listData.selectedProvider, defaultProvider );
      };

      scope.doValidation();
    }


  }//END CLASS


  // ----------------------------
  // injection
  // ----------------------------

  angular.module( 'iscMessages' )
      .directive( 'iscLookupProvider', iscLookupProvider );

})();
