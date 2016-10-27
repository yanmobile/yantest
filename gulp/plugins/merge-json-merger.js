/**
 * Created by hzou on 10/17/16.
 */


var _ = require( 'lodash' );

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
      } else if ( parsers["*"] ) {
        parsers["*"]( _.get( source, key ), _.get( replacer, key ), key, source, replacer );
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

module.exports.merge   = merge;
module.exports.parsers = parsers;
