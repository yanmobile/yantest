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

    return gulp
      .src( "*.json", { cwd: config.app.module.assets.i18nDir } )
      .pipe( gulp.dest( config.app.dest.i18n ) )
      .pipe( plugins.filelog() );

  } );
}
