/**
 * Created by douglasgoodman on 12/8/14.
 */

(function() {
  'use strict';
  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'isc.filters' )
    .filter( 'iscHighlight', iscHighlightFilter );

  /* @ngInject */
  function iscHighlightFilter( devlog, $sce ) {
    var channel = devlog.channel( 'iscHighlightFilter' );
    channel.logFn( 'iscHighlightFilter' );

    return setHighlight;

    // ----------------------------
    // functions
    // ----------------------------
    function setHighlight( text, phrase ) {
      channel.logFn( 'setHighlight' );
      if ( phrase && text ) {
        channel.debug( '...text', text );

        text = text.replace( new RegExp( '(' + phrase + ')', 'gi' ),
          '<span class="isc-highlighted">$1</span>' );
      }

      return $sce.trustAsHtml( text );
    }

  }//END CLASS

} )();
