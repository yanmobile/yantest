'use strict';

let _       = require( 'lodash' );
let gutil   = require( 'gulp-util' );
let JSON5   = require( 'json5' );
let path    = require( 'path' );
let through = require( 'through2' );


module.exports = function extractTranslatedFdnProperties( opts ) {
  // These are properties in FDN which are automatically translated by the forms engine

  // Form-level properties
  const extractedFormProperties = [
    'name'
  ];

  // Section-level properties
  const extractedSectionProperties = [
    'name'
  ];

  // Field-level properties
  const extractedFieldProperties = [
    'templateOptions.label',
    'templateOptions.placeholder',
    'data.content',
    'data.details',
    'data.embeddedLabel'
    // omitting helpText for now because it often contains marked up text
    // also, helpText and other longer strings should probably be refactored into server-side resources delivered via an API
    // 'data.helpText'
  ];

  const _JSON = _.get( opts, 'json5', false ) ? JSON5 : JSON;

  let fdnI18n = {};

  function parseAndMergeFdnProps( json, properties ) {
    // Merge any properties to extract into the i18n object
    _.forEach( properties, function( property ) {
      let value = _.get( json, property );
      if ( value ) {
        fdnI18n[value] = value;
      }
    } );

    // If this fragment contains fields or is a fieldGroup, recursively extract field properties
    let children = json.fields || json.fieldGroup;
    if ( children ) {
      _.forEach( children, function( child ) {
        parseAndMergeFdnProps( child, extractedFieldProperties );
      } );
    }
  }

  return through.obj(
    function extract( file, enc, callback ) {
      let json = _JSON.parse( file.contents.toString( 'utf8' ) );

      // json may be a form or only a section (if using abbreviated FDN syntax)
      if ( json.sections ) {
        // If a form, extract any form-level properties
        parseAndMergeFdnProps( json, extractedFormProperties );

        // Then extract each section's properties
        _.forEach( json.sections, function( section ) {
          parseAndMergeFdnProps( section, extractedSectionProperties );
        } );
      }
      else {
        // Otherwise extract the single section's properties
        parseAndMergeFdnProps( json, extractedSectionProperties );
      }

      callback();
    },
    function writeFile( callback ) {
      let self = this;

      self.push( new gutil.File( {
          path    : path.join( opts.lang + (opts.suffix || '.fdn.json') ),
          contents: new Buffer( _JSON.stringify( fdnI18n, null, 2 ) )
        } )
      );

      callback();
    } );
};
