/**
 * Created by hzou on 3/3/16.
 */


module.exports = {
  init: init
};

function init( gulp, plugins, config, _ ) {
  gulp.task( 'templates', function() {

    var tplCacheOpts = {
      module    : 'isc.templates',
      standalone: true
    };

    var templates = _.concat(
      config.common.module.html,
      config.component.module.html,
      config.app.module.html,
      config.masterConfig.overrides.html.common,
      config.masterConfig.overrides.html.components
    );

    return gulp
      .src( templates )
      .pipe( plugins.plumber() )
      // // .pipe( plugins.filelog() )
      .pipe( plugins.simpleRename( function( path, file ) {

        var moduleLength      = 'modules/'.length;
        var lastIndexOfModule = file.base.lastIndexOf( 'module' );
        if ( lastIndexOfModule !== -1 && !file.base.endsWith('modules/') ) {
          path = file.base.substr( lastIndexOfModule + moduleLength ) + path;
        }
        return path;

      } ) )
      .pipe( plugins.templateCache( tplCacheOpts ) )
      .pipe( plugins.concat( 'templates.min.js' ) )
      .pipe( gulp.dest( plugins.path.join( config.app.dest.folder, 'js' ) ) );
  } );
}