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

/**
 * default supported parsers, can be overridden and extended by passing in options:
 * {
 *   parsers: {}
 * }
 *
 * @type {{#: updateArrayItem, !: deleteObjectProperty}}
 */
var parsers = {
  "#": updateArrayItem,
  "!": deleteObjectProperty
};

//breadth first merge
function merge( source, replacer, key, sourceParent, replacerParent ) {
  if ( _.isNil( replacer ) ) {
    // no op
  } else if ( _.isNil( source ) || !_.isObject( replacer ) ) {
    _.set( sourceParent, key, replacer );

  } else if ( _.isArray( replacer ) ) { //merge arrays

    if ( _.isArray( source ) ) {
      sourceParent[key].push.apply( sourceParent[key], replacer );
    } else {
      sourceParent[key] = replacer;
    }

  } else if ( _.isObject( replacer ) ) {

    _.forEach( replacer, function( val, key ) {
      var symbol = key[0];

      if ( parsers[symbol] ) {
        parsers[symbol]( source, replacer, key, sourceParent, replacerParent );
      } else {
        merge( _.get( source, key ), _.get( replacer, key ), key, source, replacer );
      }

    } );
  }
}

/**
 * Finds find an item in the source array by index and by criteria (_.find()) and then
 * update the found object
 *
 * usage:
 * {
 *   "#key@id,age" : {id: 123, age: 44, property: "to update the orig object with" }
 * }
 * @param source
 * @param replacer
 * @param key
 * @param sourceParent
 * @param replacerParent
 */
function updateArrayItem( source, replacer, key, sourceParent, replacerParent ) {
  // syntax: {"#one@id,age": {id: 2, age: 34, nest: 2}};
  var arrayItem, firstChar, lastChar, criteria;
  var origKey = key; // "#one@id"
  key         = key.substr( 1 ); //one
  var parts   = key.split( '@' ); //[one, "id,age"]
  key         = parts[0];  //one
  criteria    = parts[1];  //"id,age" or "[0]"
  firstChar   = criteria[0];
  lastChar    = criteria[criteria.length - 1];

  //support for finding array item by index "[1]"
  var isIndexBased = firstChar === "[" && lastChar === "]";
  if ( isIndexBased ) {
    var arrIndex = criteria.substr( 1, criteria.length - 2 );//assumes its an int
    arrayItem    = source[key][arrIndex];

  } else {

    // {id: 2, age: 34}
    criteria  = _.reduce( criteria.split( ',' ), function( whole, criterion ) {
      whole[criterion] = replacer[origKey][criterion];
      return whole;
    }, {} );
    arrayItem = _.find( source[key], criteria );
  }
  merge( arrayItem, replacer[origKey], key, source, replacer );
}

/**
 * function for deleting key from an object. If value is ignored
 *
 * usage:
 * {
 *   "!prop": "ignored"
 * }
 *
 * @param source
 * @param replacer
 * @param key
 * @param sourceParent
 * @param replacerParent
 */
function deleteObjectProperty( source, replacer, key, sourceParent, replacerParent ) {
  key = key.substr( 1 );
  delete source[key];
}

module.exports = function( fileName, opts ) {
  var jsonReplacer = null;
  var jsonSpace    = '\t';
  var json5        = false;
  var startObj;

  if ( _.isObject( opts ) ) {
    startObj = opts.startObj;
    json5    = opts.json5;
    _.extend( parsers, opts.parsers );
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
      merge( merged, parsed );
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