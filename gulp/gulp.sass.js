/**
 * Created by hzou on 3/3/16.
 */


module.exports = {
  init: init
};

function init( gulp, plugins, config, _, util ) {
  gulp.task( 'sass', [], function() {

    // var cssmin       = require( 'gulp-cssmin' );  //minifies css
    var autoprefixer = require( 'gulp-autoprefixer' );
    var inject       = require( 'gulp-inject' );
    var sass         = require( 'gulp-sass' ); //sass => css


    var injectSrc = gulp.src( _.get( config, "app.module.scssInjectSrc", [] ) )// .pipe( plugins.filelog() );

    return gulp
      .src( config.app.module.scss )
      .pipe(util.getPlumber())
      .pipe( plugins.sourcemaps.init() )
      .pipe( inject( injectSrc, {
        starttag : '// <!-- inject:scss -->',
        endtag   : '// <!-- endinject:scss -->',
        transform: function( filepath ) {

          if(filepath.startsWith("/src/app")){
            var importStr = '@import "' + filepath.replace( '/src/app', '../..' ) + '";';
          } else if(filepath.startsWith("/src/uifw-modules")){
            var importStr = '@import "' + filepath.replace( '/src/uifw-modules', '../../../uifw-modules' ) + '";';
          }

          return importStr;
        }
      } ) )
      .pipe( sass.sync( { errLogToConsole: true } ) )
      .pipe( plugins.mobilizer( 'app.css', {
        'app.css'  : {
          hover  : 'exclude',
          screens: ['0px']
        },
        'hover.css': {
          hover  : 'only',
          screens: ['0px']
        }
      } ) )
      .pipe( autoprefixer() )
      .pipe( plugins.concat( 'app.css' ) )
      .pipe( plugins.rename( { basename: 'main', suffix: '.min' } ) )
      .pipe( plugins.sourcemaps.write() )
      .pipe( gulp.dest( plugins.path.join( config.app.dest.folder, 'css' ) ) )
      .pipe( plugins.size() );
  } );
}