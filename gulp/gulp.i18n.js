/**
 * Created by hzou on 3/3/16.
 */


module.exports = {
  init: init
};

var filelog   = require( "gulp-filelog" );
var fs        = require( 'fs' );
var mergeJson = require( './plugins/merge-json' );
var convert   = require( './i18n.xml.converter' );
var filter    = require( 'gulp-filter' );

function init( gulp, plugins, config, _ ) {

  /**
   * @description handles i18n source files. This will merge all i18n files with the same name into 1 output file to be consumed by the application.
   *
   * This is the order of file overrides: App overrides Components which overrides Common => _.merge({}, common, components, app);
   */
  gulp.task( 'i18n', ['i18nExtract'], function( done ) {

    var domain = _.get( config, "app.module.assets.i18nDomain" );
    var file   = "en-us.json";

    gulp
      .src( file, { cwd: config.app.dest.i18nExtract } )
      .pipe( convert( { domain: domain } ) )
      .pipe( gulp.dest( config.app.dest.i18nXml ) )
      .pipe( filelog() );

  } );
}
