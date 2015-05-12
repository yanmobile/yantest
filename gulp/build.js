/**
 * Created by douglasgoodman on 1/16/15.
 */

(function(){
  'use strict';

  /*=====================================
   ------    Configuration      ------- */

// Please use config.js to override these selectively:
  var config = {
    dest: 'www',
    cordova: true,
    minify_images: true,

    unit_test_dir: 'test/karma.conf.js',

    vendor: {
      js: [
        './bower_components/jquery/dist/jquery.js',

        './bower_components/lodash/dist/lodash.js',
        './bower_components/greensock/src/minified/TweenMax.min.js',

        './bower_components/angular/angular.js',

        './bower_components/angular-ui-calendar/src/calendar.js',
        './bower_components/fullcalendar/fullcalendar.js',
        './bower_components/angular-utils-pagination/dirPagination.js',

        './bower_components/angular-ui-router/release/angular-ui-router.js',
        './bower_components/angular-animate/angular-animate.js',
        './bower_components/angular-filter/dist/angular-filter.js',
        './bower_components/angular-sanitize/angular-sanitize.js',

        './bower_components/angular-translate/angular-translate.js',
        './bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',

        './bower_components/mobile-angular-ui/dist/js/mobile-angular-ui.gestures.js',
        './bower_components/mobile-angular-ui/dist/js/mobile-angular-ui.migrate.js',
        './bower_components/mobile-angular-ui/dist/js/mobile-angular-ui.js',

        './bower_components/moment/moment.js',
        './src/assets/plugins/progress-skylo/skylo.js',
        './src/assets/plugins/plugins.js'
      ],

      fonts: [
        './bower_components/font-awesome/fonts/fontawesome-webfont.*'
      ],

      css: [
        './bower_components/bootstrap/dist/css/bootstrap.min.css'
      ]
    }
  };

  /*-------  End of Configuration  --------
  ========================================*/


  /*========================================
   =                 require                =
   ========================================*/

  //require('require-dir')('./gulp');

  var gulp         = require('gulp'),
    connect        = require('gulp-connect'),
    concat         = require('gulp-concat'),
    cssmin         = require('gulp-cssmin'),
    ignore         = require('gulp-ignore'),
    imagemin       = require('gulp-imagemin'),
    karma          = require('karma').server,
    mobilizer      = require('gulp-mobilizer'),
    order          = require('gulp-order'),
    path           = require('path'),
    pngcrush       = require('imagemin-pngcrush'),
    ngAnnotate     = require('gulp-ng-annotate'),
    ngFilesort     = require('gulp-angular-filesort'),
    rename         = require('gulp-rename'),
    replace        = require('gulp-replace'),
    sass           = require('gulp-sass'),
    seq            = require('run-sequence'),
    sourcemaps     = require('gulp-sourcemaps'),
    streamqueue    = require('streamqueue'),
    templateCache  = require('gulp-angular-templatecache'),
    uglify         = require('gulp-uglify'),
    wiredep        = require('wiredep');

  var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'del', 'path']
  });

  /*================================================
   =            Report Errors to Console           =
   ================================================*/

  gulp.on('err', function(e) {
    console.log(e.err.stack);
  });

  function handleError(err) {
    console.error(err.toString());
    this.emit('end');
  }

  /*=========================================
   =            Clean dest folder            =
   =========================================*/

  gulp.task('clean', function( done ){
    $.del([ 'www/**', '.tmp-css/**'], done );
  });

  /*=========================================
   =            jshint            =
   =========================================*/

  gulp.task('jshint', function () {
    return gulp.src('src/js/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.size());
  });

  /*==================================
   =            Copy fonts            =
   ==================================*/

  gulp.task('fonts', function() {
    return gulp.src( config.vendor.fonts )
      .pipe( gulp.dest( path.join( config.dest, 'fonts' )));
  });


  /*==================================
   =            Copy css            =
   ==================================*/

  gulp.task('vendor:css', function() {
    return gulp.src( config.vendor.css )
      .pipe( gulp.dest( path.join( config.dest, 'css' )));
  });

  /*==================================
   =           Copy assets           =
   ==================================*/

  gulp.task('i18n', function() {
    return gulp.src( ['./src/assets/i18n/**'] )
        .pipe(gulp.dest(path.join(config.dest, 'assets/i18n')));
  });

  gulp.task('configuration', function() {
    return gulp.src( ['./src/assets/configuration/**'] )
        .pipe(gulp.dest(path.join(config.dest, 'assets/configuration')));
  });

  gulp.task('mocks', function() {
    return gulp.src( ['./src/assets/mockData/**'] )
        .pipe(gulp.dest(path.join(config.dest, 'assets/mockData')));
  });

  gulp.task('assets', function( done ){
    var tasks = ['i18n', 'configuration', 'mocks'];
    seq( tasks, done );
  });

  /*=====================================
   =            Minify images           =
   =                                    =
   this will pull in images from src/assets and src/js/common/assets
   as well as any images in the plugins directory
   =====================================*/

  gulp.task('images', function () {
    var stream = gulp.src(['./src/assets/images/**/*.{jpg,png,gif}', './src/js/common/assets/images/**/*.{jpg,png,gif}', '.src/assets/plugins/**/*.{jpg,png,gif}']);

    if (config.minify_images) {
      stream = stream.pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngcrush()]
      }))
    }

    return stream.pipe(gulp.dest(path.join(config.dest, 'assets/images')));
  });

  /*=========================================
   =               styles                   =
   =========================================*/

  gulp.task('sass', ['wiredep'],  function () {
    return gulp.src(
      ['./src/assets/sass/main.scss'] )
      .pipe($.sass() )
      .on('error', handleError)
      .pipe(mobilizer('app.css', {
        'app.css': {
          hover: 'exclude',
          screens: ['0px']
        },
        'hover.css': {
          hover: 'only',
          screens: ['0px']
        }
      }))
      .pipe(cssmin())
      .pipe(gulp.dest('.tmp-css'))
      .pipe(concat('app.css'))
      .pipe(rename({basename: "main", suffix: '.min'}))
      .pipe(gulp.dest(path.join(config.dest, 'css')))
      .pipe($.size());
  });

  /*====================================================================
   =            Compile and minify js generating source maps            =
   ====================================================================*/
// - Orders ng deps automatically
// - Precompile templates to ng templateCache

  gulp.task('js', function() {
    streamqueue({ objectMode: true },
      gulp.src(config.vendor.js),
      gulp.src('./src/js/**/*.js').pipe(ngFilesort()),
      gulp.src(['src/js/**/*.html']).pipe(templateCache({ module: 'iscHsCommunityAngular' }))
    )
      .pipe(sourcemaps.init())
      .pipe(concat('app.js'))
      .pipe(ngAnnotate())
      //.pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(path.join(config.dest, 'js')));
  });


  /*=================================================
   =                  Copy favicon                  =
   =================================================*/

  gulp.task('favicon', function() {
    return gulp.src( ['src/favicon.ico', 'src/favicon-16x16.png'] )
      .pipe(gulp.dest( config.dest ));
  });


  /*=================================================
   =            Copy html files to dest              =
   =================================================*/

  gulp.task('html', function() {
    var inject = [];

    if (config.cordova) {
      inject.push('<script src="cordova.js"></script>');
    }

    gulp.src(['src/index.html'])
      .pipe( replace( '<!-- inject:js -->', inject.join('\n') ))
      .pipe(gulp.dest(config.dest));

    gulp.src(['src/config.xml'])
      .pipe(gulp.dest(config.dest));
  });


  /*======================================
   =                BUILD                =
   ======================================*/

  gulp.task('build', function(done) {
    var tasks = ['html', 'fonts', 'images', 'js', 'assets', 'sass', 'favicon'];
    seq('clean', tasks,  done);
  });


})();
