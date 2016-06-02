/**
 * Created by hzou on 3/3/16.
 */


module.exports = {
  init: init
};

var filelog   = require( "gulp-filelog" );
var fs        = require( 'fs' );
var mergeJson = require( 'gulp-merge-json' );
var convert   = require( './i18n.xml.converter' );

function init( gulp, plugins, config, _ ) {

  /**
   * @description handles i18n source files. This will merge all i18n files with the same name into 1 output file to be consumed by the application.
   *
   * This is the order of file overrides: App overrides Components which overrides Common => _.merge({}, common, components, app);
   */
  gulp.task( 'i18n', function( done ) {
    var commonI18n     = _.get( config, "common.module.assets.i18nDir" );
    var componentsI18n = _.get( config, "component.module.assets.i18nDir" );
    var appI18n        = _.get( config, "app.module.assets.i18nDir" );
    var domain         = _.get( config, "app.module.assets.i18nDomain" );

    //get files in each of these three folders
    var commonI18nFiles     = readdirSync( commonI18n );
    var componentsI18nFiles = readdirSync( componentsI18n );
    var appI18nFiles        = readdirSync( appI18n );

    // unique files
    var uniqI18nFiles = _.chain( commonI18nFiles ).concat( componentsI18nFiles, appI18nFiles ).uniq().filter( isJsonFile ).value();

    // for each file merge all 3 files from each section
    _.forEach( uniqI18nFiles, function mergeConfigs( file ) {
      gulp
        .src( getSrcFiles( file ) )
        .pipe( mergeJson( file, removeComments ) )
        .pipe( filelog() )
        .pipe( gulp.dest( plugins.path.join( config.app.dest.folder, 'assets/i18n' ) ) )
        .pipe( convert( { domain: domain } ) )
        .pipe( gulp.dest( plugins.path.join( config.app.dest.i18nXml ) ) );
    } );

    done(); //NOTE: Due to the fact the actual task is asynchronous, this done() invoked before the actual task is finished.

    /**
     * Remove comments from i18n JSON files
     * @param parsedJson
     * @returns {*}
     */
    function removeComments( parsedJson ) {
      if ( parsedJson.COMMENTS ) {
        delete parsedJson.COMMENTS;
      }

      return parsedJson;
    }

    /**
     * used by lodash to return files with .json extension in the name
     * @param filename
     * @returns true/false
     */
    function isJsonFile( filename ) {
      return filename.endsWith( '.json' );
    }

    /**
     * dynamically add the src file if i18n section is specified
     * This is the order of file overrides: App overrides Components which overrides Common => _.merge({}, common, components, app);
     * @param file
     * @returns {Array}
     */
    function getSrcFiles( file ) {
      var srcFiles = [];
      if ( commonI18n ) {
        srcFiles.push( commonI18n + "/" + file );
      }
      if ( componentsI18n ) {
        srcFiles.push( componentsI18n + "/" + file );
      }
      if ( appI18n ) {
        srcFiles.push( appI18n + "/" + file );
      }
      return srcFiles;
    }

  } );
}

/**
 * @description returns all files inside of a specific folder.
 * @param path
 * @param defaults
 * @returns {*}
 */
function readdirSync( path, defaults ) {
  var files;
  try {
    if ( path ) {
      files = fs.readdirSync( process.cwd() + '/' + path );
    } else {
      files = defaults || [];
    }
  } catch ( e ) {
    files = defaults || [];
  }
  return files;
}