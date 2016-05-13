/**
 * Created by douglasgoodman on 12/8/14.
 */

(function() {
  'use strict';

  angular
    .module( 'isc.filters' )
    .filter( 'iscHtmlToPlainText', iscHtmlToPlainText );

  /**
   * @description converts plain html to plain text by stripping html tags
   *  if the param is non-string, it will convert the param to string and return it
   * @param devlog
   * @returns {convert}
   */
  function iscHtmlToPlainText( devlog ) {
    var channel = devlog.channel( 'iscHtmlToPlainText' );
    channel.debug( 'iscHtmlToPlainText LOADED' );

    return function convert( text ) {
      // * returns plain text from an html string
      return String( text ).replace( /<[^>]+>/gm, '' );
    };

  }//END CLASS

} )();
