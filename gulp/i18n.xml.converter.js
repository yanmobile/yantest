var gutil   = require( 'gulp-util' );
var es      = require( 'event-stream' );
var stream  = require( 'stream' );
var _       = require( "lodash" );

/**
 * @description gulp plugin used to convert i18n json files to i18n xml files
 * JIRA Ticket: https://hsjira.iscinternal.com/browse/HSFW-72
 *
 * Both convert and convertContent are both overridable; simply pass them in the options.
 * e.g. gulp.pipe(convert({convert: ..., convertContent: ...}))
 */
module.exports = function( options ) {
  var defaults = {
    convert       : convert,
    convertContent: convertContent
  };
  var opts     = _.extend( defaults, options );

  function modifyContents( file, cb ) {
    var reader = createReader( [String( file.contents )] );
    var writer = createWriter( function() {
      file.path     = gutil.replaceExtension( file.path, '.xml' );
      var json      = JSON.parse( writer.toString() );
      var output    = opts.convert( json, opts );
      file.contents = new Buffer( output );
      cb( null, file );
    } );

    reader.pipe( writer );
  }

  return es.map( modifyContents );

  function convert( json, opts ) {
    opts.eachPrefix = "    ";   //needed to preserve the format
    return `<?xml version="1.0" encoding="UTF-8"?>
<MsgFile Language="en">
  <MsgDomain Domain="${opts.domain}">
${opts.convertContent( json, opts )}
  </MsgDomain>
</MsgFile>`;
  }

  function convertContent( jsonObj, opts ) {
    var output = [];

    _.forEach( jsonObj, function( value, name ) {
      output.push( `${opts.eachPrefix}<Message Id="${name}">${value}</Message>` );
    } );
    return output.join( '\n' );
  }


  /**
   * gulp plugin code
   * @param lines
   * @returns {"stream".Readable}
   */

  function createReader( lines ) {
    var reader   = new stream.Readable();
    reader._read = function() {
      lines.map( function( line ) {
        reader.push( line );
      } );
      reader.push( null );
    };

    return reader;
  }

  function createWriter( finish ) {
    var buffer    = '';
    var writer    = new stream.Writable();
    writer._write = function( chunk, enc, next ) {
      buffer += chunk;
      next();
    };

    writer.toString = function() {
      return buffer;
    };

    writer.on( 'finish', finish );
    return writer;
  }
};