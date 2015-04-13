/**
 * Created by douglasgoodman on 11/18/14.
 */

(function(){
  'use strict';

  iscRankHelper.$inject = [ '$log' ];

  function iscRankHelper( $log ){

    //$log.debug( 'iscRankHelper LOADED');

    var self = this;

    var helper = {

      rank: function( data ){
        //$log.debug( 'iscRankHelper.rank');

        angular.forEach( data, function( thing ){
          thing.rank = Math.random();
        });
      }
    };

    return helper;
  };


  angular.module( 'iscHome' )
      .factory( 'iscRankHelper', iscRankHelper );

})();
