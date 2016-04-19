/**
 * Created by douglasgoodman on 12/8/14.
 */

(function(){
  'use strict';
  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'isc.filters' )
    .filter( 'arrayString', iscArrayStringFilter );

  /* @ngInject */
  function iscArrayStringFilter( devlog, $filter ){//jshint ignore:line
    var channel = devlog.channel('iscArrayStringFilter');
    channel.debug( 'iscArrayStringFilter LOADED');

    // ----------------------------
    // vars
    // ----------------------------


    // ----------------------------
    // class factory
    // ----------------------------

    return getArrayString;

    // ----------------------------
    // functions
    // ----------------------------


    function getArrayString( array ){
      channel.debug('iscArrayStringFilter.getArrayString');
      channel.debug('...array', array);
      channel.debug('...array', typeof array);

      if( Object.prototype.toString.call( array ) !== '[object Array]' ){
        return '';
      }

      array.sort();

      var string = '';
      var len = array.length;
      array.forEach( function( item, idx ){
        string += item.toString();
        if( idx < (len-1) ){
          string += ', ';
        }

      });

      return string;
    }


  }//END CLASS

})();
