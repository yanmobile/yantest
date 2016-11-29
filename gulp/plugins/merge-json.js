//see this for merge algorithm and tests: http://jsbin.com/kusikadaha/edit?js,output

//Requirements:
// 1. override primative values
// 2. recursively override objects by property
// 3. merge arrays
// 4. can delete (!)
// 5. update specific arrayElement (#)
// 6. update specific arrayElement by index #[0]

'use strict';

var _       = require( 'lodash' );
var gutil   = require( 'gulp-util' );
var JSON5   = require( 'json5' );
var path    = require( 'path' );
var through = require( 'through' );

var PLUGIN_NAME = 'gulp-isc-merge-json';
var merger = require('./merge-json-merger');

module.exports = function( fileName, opts ) {
  var jsonReplacer = null;
  var jsonSpace    = '\t';
  var json5        = false;
  var startObj;

  if ( _.isObject( opts ) ) {
    startObj = opts.startObj;
    json5    = opts.json5;
    _.extend( merger.parsers, opts.parsers );
  }

  var _JSON = (json5) ? JSON5 : JSON;

  if ( (startObj && typeof startObj !== 'object') ) {
    throw new gutil.PluginError( PLUGIN_NAME, PLUGIN_NAME + ': Invalid start object!' );
  }

  var merged    = startObj || {};
  var firstFile = null;

  function parseAndMerge( file ) {
    var parsed;

    if ( file.isNull() ) {
      return this.queue( file );
    }

    if ( file.isStream() ) {
      return this.emit( 'error', new gutil.PluginError( PLUGIN_NAME, PLUGIN_NAME + ': Streaming not supported!' ) );
    }

    if ( !firstFile ) {
      firstFile = file;
    }

    try {
      parsed = _JSON.parse( file.contents.toString( 'utf8' ) );
    } catch ( err ) {
      err.message = 'Error while parsing ' + file.path + ': ' + err.message;
      return this.emit( 'error', new gutil.PluginError( PLUGIN_NAME, err ) );
    }

    try {
      merger.merge( merged, parsed );
    } catch ( err ) {
      return this.emit( 'error', new gutil.PluginError( PLUGIN_NAME, err ) );
    }
  }

  function endStream() {
    if ( !firstFile ) {
      return this.emit( 'end' );
    }

    var contents = _JSON.stringify( merged, jsonReplacer, jsonSpace );

    var output = new gutil.File( {
      cwd     : firstFile.cwd,
      base    : firstFile.base,
      path    : path.join( firstFile.base, fileName ),
      contents: new Buffer( contents ),
    } );

    this.emit( 'data', output );
    this.emit( 'end' );
  }

  return through( parseAndMerge, endStream );
};