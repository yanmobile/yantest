/**
 * Created by douglasgoodman on 11/19/14.
 */

(function(){
  'use strict';

  iscUiHelper.$inject = [ '$log' ];

  function iscUiHelper( $log ){
//    //$log.debug( 'iscUiHelper LOADED' );

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------

    var service  = {
      displayOrder: displayOrder,
      setTabActiveState: setTabActiveState
    };

    return service;

    // ----------------------------
    // functions
    // ----------------------------

    // ----------------------------
    // all configurations

    // each tab is assumed to have a displayOrder property
    function displayOrder ( tab ){
      return tab.displayOrder;
    }

    function setTabActiveState( state, allTabs ) {
      //$log.debug( 'iscShared.setTabActiveState');
      //$log.debug( '...allTabs',allTabs);

      _.forEach( allTabs, function( tab ){
        if( _.contains( state, tab.state )){
          tab.$$active = true;
        }
        else{
          tab.$$active = false;
        }
      });
    }


  }// END CLASS

  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'isc.common' )
      .factory( 'iscUiHelper', iscUiHelper );
})();
