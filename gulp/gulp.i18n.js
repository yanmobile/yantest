/**
 * Created by hzou on 3/3/16.
 */

module.exports = {
  init: init
};

function init( gulp, plugins, config, _ ) {

  /**
   * @description handles i18n source files. This will merge all i18n files with the same name into 1 output file to be consumed by the application.
   *
   * This is the order of file overrides: App overrides Components which overrides Common => _.merge({}, common, components, app);
   */
  gulp.task( 'i18n', function( done ) {
    var jsonMerger     = require( './plugins/merge-json-merger' );
    var groupAggregate = require( 'gulp-group-aggregate' );

    var sources = _.concat( config.app.module.assets.i18n, config.app.customer.assets.i18n );

    gulp.src( sources )
      .pipe( groupAggregate( {
        group    : ( file ) => plugins.path.basename( file.path ),
        aggregate: ( group, files ) => {
          return {
            path    : group,
            contents: new Buffer( processFiles( group, files ) )
          };
        }
      } ) )
      .pipe( plugins.filelog() )
      .pipe( gulp.dest( config.app.dest.i18nExtract ) );

    function processFiles( group, files ) {
      var response = _.reduce( files, ( result, file ) => {
        var json = JSON.parse( _.get( file, "_contents", "{}" ) );
        switch ( json.UifwMergeAlgorithm ) {
          case "replace":
            result = json;
            break;
          default:
            jsonMerger.merge( result, json );
            break;
        }
        return result;
      }, {} );

      delete response.UifwMergeAlgorithm;
      return JSON.stringify( response, null, '\t' );
    }

  } );
}
