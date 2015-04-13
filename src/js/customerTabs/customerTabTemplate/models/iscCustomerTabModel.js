/**
 * Created by douglasgoodman on 11/18/14.
 */

(function(){
  'use strict';

  iscCustomerTabModel.$inject = [ '$log'];

  function iscCustomerTabModel( $log ){
//    //$log.debug( 'iscCustomerTabModel LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    var data = {};


    // ----------------------------
    // class factory
    // ----------------------------
    var model = {
      getData: getData,
      setData: setData
    };

    return model;

    // ----------------------------
    // functions
    // ----------------------------

    // -------------
    function getData(){
      //$log.debug( 'GETTING DATA: ' + JSON.stringify( data ));
      return data;
    }

    function setData( val ){
      //$log.debug( 'SETTING DATA: ' + JSON.stringify( val ));
      data  = val;
    }

  }//END CLASS

  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'iscCustomerTab' )
      .factory( 'iscCustomerTabModel', iscCustomerTabModel );

})();
