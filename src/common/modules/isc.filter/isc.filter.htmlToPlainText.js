/**
 * Created by douglasgoodman on 12/8/14.
 */

(function(){
  'use strict';

  /* @ngInject */
  function iscHtmlToPlainText( devlog ){//jshint ignore:line
    var channel = devlog.channel('iscHtmlToPlainText');
    channel.debug( 'iscHtmlToPlainText LOADED');


    // ----------------------------
    // class factory
    // ----------------------------

    return convert;

    // ----------------------------
    // functions
    // ----------------------------

    /**
     * returns plain text from an html string
     */
    function convert( text ){
      return String( text ).replace(/<[^>]+>/gm, '');
    }


  }//END CLASS

  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'isc.filters' )
      .filter( 'iscHtmlToPlainText', iscHtmlToPlainText );

})();
