/**
 * Created by hzou on 3/3/16.
 */


module.exports = {
  init: init
};

var filelog   = require( "gulp-filelog" );
var fs        = require( 'fs' );
var mergeJson = require( './plugins/merge-json' );
var filter    = require( 'gulp-filter' );

function init( gulp, plugins, config, _ ) {

  /**
   * @description handles FDN source files. This will merge all FDN files with the same name into 1 output file to be consumed by the application.
   *
   * This is the order of file overrides: App overrides Components which overrides Common => _.merge({}, common, components, app);
   */
  gulp.task( 'fdn', function( done ) {
    var componentsFDN = _.get( config, "component.module.assets.FDN" );
    var appFDN        = _.get( config, "app.module.assets.FDN" );
    //
    // //get files in each of these two folders
    var componentsFDNFiles = readdirSync( componentsFDN );
    var appFDNFiles        = readdirSync( appFDN );

    // unique files
    var uniqFDNFiles = _.chain( componentsFDNFiles ).concat( appFDNFiles ).uniq().filter( isJsonFile ).value();

    // for each file merge all 3 files from each section
    _.forEach( uniqFDNFiles, function mergeConfigs( file ) {
      gulp
        .src( getSrcFiles( file ) )
        .pipe( plugins.plumber() )
        .pipe( filelog() )
        .pipe( mergeJson( file, {
          parsers: {
            // "#": function() {
            //   console.log( 'no op' );
            // }
          }
        } ) )
        .pipe( filelog() )
        .pipe( gulp.dest( config.app.dest.fdn ) )
        .pipe( filelog() );
    } );

    /**
     * dynamically add the src file if FDN section is specified
     * This is the order of file overrides: App overrides Components which overrides Common => _.merge({}, common, components, app);
     * @param file
     * @returns {Array}
     */
    function getSrcFiles( file ) {
      var srcFiles = [];
      if ( componentsFDN ) {
        srcFiles.push( componentsFDN + "/" + file );
      }
      if ( appFDN ) {
        srcFiles.push( appFDN + "/" + file );
      }
      return srcFiles;
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

  } );
}
