/**
 * Created by douglasgoodman on 11/21/14.
 */
(function(){
  'use strict';

  iscProgressLoader.$inject = [ '$log' ];

  function iscProgressLoader( $log ){

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------

    var service  = {
      start: start,
      set: set,
      end: end,
      get: get,
      inch: inch
    };

    return service;

    // ----------------------------
    // functions
    // ----------------------------

    function start () {
      $(document).skylo('start');
    }

    function set (position) {
      $(document).skylo('set', position);
    }

    function end () {
      $(document).skylo('end');
    }

    function get () {
      return $(document).skylo('get');
    }

    function inch (amount) {
      $(document).skylo('show',function(){
        $(document).skylo('inch', amount);
      });
    }

  }// END CLASS



  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'isc.common' )
      .factory( 'iscProgressLoader', iscProgressLoader );

})();
