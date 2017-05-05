module.exports = {
  init: init
};

var watch    = require( 'gulp-watch' );
var notify   = require( 'gulp-notify' );
var cached   = require( 'gulp-cached' );
var gutil    = require( 'gulp-util' );

function init( gulp, plugins, config, _, util ) {

  var watchlist = {
    'src/common/assets/images/**/*' : ['images'],
    'src/common/assets/sass/**/*'   : ['sass'],
    'src/common/assets/vendors/**/*': ['scripts'],
    'src/common/modules/**/*.js'    : ['test:common', 'jshint:common', 'scripts:common'],
    'src/common/modules/**/*.html'  : ['templates'],
    'test/unit/common/**/*.js'      : ['test:common'],

    'src/components/**/assets/FDN/**/*'    : ['fdn'],
    'src/components/**/assets/images/**/*' : ['images'],
    'src/components/**/assets/sass/**/*'   : ['sass'],
    'src/components/**/assets/vendors/**/*': ['scripts'],
    'src/components/**/modules/**/*.js'    : ['test:components', 'jshint:components', 'scripts:components'],
    'src/components/**/modules/**/*.html'  : ['templates'],
    'test/unit/components/**/*.js'         : ['test:components'],

    'src/app/assets/FDN/**/*'                   : ['fdn'],
    'src/app/assets/i18n/**/*'                  : ['i18n'],
    'src/app/assets/images/**/*'                : ['images'],
    'src/app/assets/sass/**/*.scss'             : ['sass'],
    'src/app/modules/**/*.scss'                 : ['sass'],
    'src/app/assets/mockData/**/*'              : ['mocks', 'scripts'],
    'src/app/assets/vendors/**/*'               : ['scripts'],
    'src/app/modules/**/*.js'                   : ['test:app', 'jshint:app', 'scripts:app'],
    'src/uifw-modules/src/app/modules/**/*.js'  : ['test:app', 'jshint:app', 'scripts:app'],
    'src/uifw-modules/src/app/modules/**/*.html': ['templates'],
    'src/uifw-modules/src/app/modules/**/*.scss': ['sass'],
    'src/app/modules/**/*.html'                 : ['templates'],
    'test/unit/app/**/*.js'                     : ['test:app'],
    'src/app/modules/**/*.spec.js'              : ['test:app'],
    'src/index.html'                            : ['html'],
    'gulp/**/*.js'                              : ['notify-restart'],
    'gulpfile.js'                               : ['notify-restart'],
    'package.json'                              : ['notify-restart']
  };


  // ------------------------------------------------------------------------
  // ----------------------------- notify-restart ---------------------------
  // ------------------------------------------------------------------------
  // This watch will notify the user when changes are made to the gulp files
  gulp   // This is needed in order to initially cache files to prevent multiple non-changed notifications
    .src( [ 'gulp/**/*.js', 'wallaby.config.*.js', 'package.json', 'gulpfile.js' ] )
    .pipe( cached( 'notify-restart' ) )
    .pipe( gutil.noop() );

  gulp.task( 'notify-restart', function() {

    return gulp
      .src( [ 'gulp/**/*.js', 'wallaby.config.*.js', 'package.json', 'gulpfile.js' ] )
      .pipe( cached( 'notify-restart' ) )
      .pipe( notify( {
        templateOptions: {
          date: new Date()
        },
        title  : 'Restart Gulp',
        message: 'You should manually restart Gulp because "<%= file.relative %>" was changed.'
      } ) );

  } );
  // ------------------------------------------------------------------------
  // ----------------------------- END notify-restart -----------------------
  // ------------------------------------------------------------------------

  gulp.task( 'watch', function() {
    _.forEach( watchlist, watchItem );

    function watchItem( task, srcFiles ) {
      return watch( srcFiles, function() {
        gulp
          .src( srcFiles )
          .pipe( watch( srcFiles ) );
        gulp.start( task );
      } );
    }
  } );

}
