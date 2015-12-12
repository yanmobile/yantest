/**
 * Created by douglasgoodman on 1/16/15.
 */

(function () {
  'use strict';

  /*=====================================
   ------    Configuration      ------- */

  var common = require('./common.json');
  var config = {
    dest         : 'www',
    cordova      : false,
    minify_images: true,

    unit_test_dir: 'test/karma.conf.js',

    vendor: common.vendor,
    custom: {
      js: [],

      fonts: [
        "./src/custom/assets/fonts/opensans*.*"
      ]
    }
  };

  /*-------  End of Configuration  --------
   ========================================*/


  /*========================================
   =                 require                =
   ========================================*/

  //require('require-dir')('./gulp');

  var gulp          = require('gulp'),
      chmod         = require('gulp-chmod'),
      connect       = require('gulp-connect'),
      concat        = require('gulp-concat'),
      cssmin        = require('gulp-cssmin'),
      dateFormat    = require('dateformat'),
      del           = require('del'),
      es            = require('event-stream'),
      exec          = require('child_process').exec,
      fs            = require('fs'),
      ignore        = require('gulp-ignore'),
      imagemin      = require('gulp-imagemin'),
      jshint        = require('gulp-jshint'),
      karma         = require('karma').server,
      mobilizer     = require('gulp-mobilizer'),
      order         = require('gulp-order'),
      path          = require('path'),
      pngcrush      = require('imagemin-pngcrush'),
      ngAnnotate    = require('gulp-ng-annotate'),
      ngFilesort    = require('gulp-angular-filesort'),
      rename        = require('gulp-rename'),
      replace       = require('gulp-replace'),
      sass          = require('gulp-sass'),
      seq           = require('run-sequence'),
      size          = require('gulp-size'),
      sourcemaps    = require('gulp-sourcemaps'),
      streamqueue   = require('streamqueue'),
      templateCache = require('gulp-angular-templatecache'),
      uglify        = require('gulp-uglify'),
      wiredep       = require('wiredep'),
      _             = require('lodash');


  /*================================================
   =            Report Errors to Console           =
   ================================================*/

  gulp.on('err', function (e) {
    console.log(e.err.stack);
  });

  function handleError(err) {
    console.error(err.toString());
    this.emit('end');
  }

  /*================================================
   =            Process Arguments                  =
   ================================================*/

  function getArg(name) {
    var argValue;
    var argName = "--" + name;
    _.forEach(process.argv, function (arg) {
      var re = new RegExp("^" + argName);
      if (re.test(arg)) {
        argValue = arg.replace(argName + "=", "").replace("\"", "");
      }
    });
    return argValue;
  }


  /*=========================================
   =            Clean dest folder            =
   =========================================*/

  gulp.task('clean', function (done) {
    del(['./www/**', './.tmp-css/**'], done);
  });

  /*=========================================
   =            jshint            =
   =========================================*/

  gulp.task('jshint', function () {
    return gulp.src('src/*/modules/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(size());
  });

  /*==================================
   =            Copy fonts            =
   ==================================*/

  gulp.task('fonts', function () {
    var typography = config.vendor.fonts.concat(config.custom.fonts);

    return gulp.src(typography)
      .pipe(gulp.dest(path.join(config.dest, 'fonts')));
  });


  /*==================================
   =            Copy css            =
   ==================================*/

  gulp.task('vendor:css', function () {
    return gulp.src(config.vendor.css)
      .pipe(gulp.dest(path.join(config.dest, 'css')));
  });

  /*==================================
   =           Copy assets           =
   ==================================*/

  gulp.task('i18n', function () {
    return gulp.src(['./src/custom/assets/i18n/**'])
      .pipe(gulp.dest(path.join(config.dest, 'assets/i18n')));
  });

  gulp.task('configuration', function () {
    return gulp.src(['./src/custom/assets/configuration/**'])
      .pipe(gulp.dest(path.join(config.dest, 'assets/configuration')));
  });

  gulp.task('mocks', function () {
    return gulp.src(['./src/custom/assets/mockData/**'])
      .pipe(gulp.dest(path.join(config.dest, 'assets/mockData')));
  });

  gulp.task('assets', function (done) {
    var tasks = ['i18n', 'configuration', 'mocks'];
    seq(tasks, done);
  });

  /*=====================================
   =            Minify images           =
   =                                    =
   this will pull in images from src/assets and src/js/common/assets
   as well as any images in the plugins directory
   =====================================*/

  gulp.task('images', function () {
    var stream = gulp.src(
      [
        './src/custom/assets/images/**/*',
        './src/common/assets/images/**/*'
      ]);

    if (config.minify_images) {
      // note that we must ensure the files are writable before minifying
      stream = stream.pipe(chmod(755))
        .pipe(imagemin({
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          use        : [pngcrush()]
        }));
    }

    return stream.pipe(gulp.dest(path.join(config.dest, 'assets/images')));
  });

  /*=========================================
   =               styles                   =
   =========================================*/

  gulp.task('sass', [], function () {
    return gulp.src(
      ['./src/custom/assets/sass/main.scss'])
      .pipe(sass({ errLogToConsole: true }))
      .on('error', handleError)
      .pipe(mobilizer('app.css', {
        'app.css'  : {
          hover  : 'exclude',
          screens: ['0px']
        },
        'hover.css': {
          hover  : 'only',
          screens: ['0px']
        }
      }))
      //.pipe(cssmin())
      .pipe(gulp.dest('.tmp-css'))
      .pipe(concat('app.css'))
      .pipe(rename({ basename: "main", suffix: '.min' }))
      .pipe(gulp.dest(path.join(config.dest, 'css')))
      .pipe(size());
  });

  /*====================================================================
   =            Compile and minify js generating source maps            =
   ====================================================================*/
// - Orders ng deps automatically
// - Precompile templates to ng templateCache

  gulp.task('js', function () {

    var commonOpts = {
      module: 'isc.common',
      strip : 'common/modules/'
    };

    var customOpts = {
      module: 'custom',
      strip : 'custom/modules/'
    };

    streamqueue({ objectMode: true },
      gulp.src(config.vendor.js),
      gulp.src(config.custom.js),

      gulp.src([
        'src/common/modules/**/*.module.js',
        'src/common/modules/**/*.js',
        'src/common/assets/plugins/**/*.js']).pipe(ngFilesort()),
      gulp.src('src/common/modules/**/*.html').pipe(templateCache(commonOpts)),

      gulp.src([
        'src/custom/modules/**/*.module.js',
        'src/custom/modules/**/*.js',
        'src/custom/assets/plugins/**/*.js']).pipe(ngFilesort()),
      gulp.src('src/custom/modules/**/*.html').pipe(templateCache(customOpts))
    )
      .pipe(ngAnnotate())
      //.pipe(uglify())
      .pipe(sourcemaps.init())
      .pipe(concat('app.js'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(path.join(config.dest, 'js')));
  });


  /*=================================================
   =                  Copy favicon                  =
   =================================================*/

  gulp.task('favicon', function () {
    return gulp.src(['src/favicon.ico', 'src/favicon-16x16.png', 'src/cmc.ico'])
      .pipe(gulp.dest(config.dest));
  });

  /*=================================================
   =            Copy html files to dest              =
   =================================================*/

  gulp.task('html', function () {
    var inject = [];

    if (config.cordova) {
      inject.push('<script src="cordova.js"></script>');
    }

    gulp.src(['src/index.html'])
      .pipe(replace('<!-- inject:js -->', inject.join('\n')))
      .pipe(gulp.dest(config.dest));

    gulp.src(['src/config.xml'])
      .pipe(gulp.dest(config.dest));
  });

  /*=================================================
   =   Ensure simpleAPI.prefix uses relative path   =
   =================================================*/

  gulp.task('fixRelativePath', function (done) {
    seq('removeConfigFile', 'useRelativePath', done);
  });

  gulp.task('useRelativePath', function () {
    return gulp.src(['./src/custom/assets/configuration/configFile.json'])
      // replace simpleAPI with "api/v1"
      .pipe(replace('"/csp/healthshare/cmc/cc/api/v1"', '"api/v1"'))
      // set API mode to real
      .pipe(replace(/"mode"\s*:\s"mock"/g, "\"mode\" : \"real\""))
      .pipe(gulp.dest(path.join(config.dest, 'assets/configuration/')));
  });

  gulp.task('removeConfigFile', function (done) {
    del([path.join(config.dest, 'assets/configuration/configFile.json')]);
    done();
  });


  /*======================================================
   =   Process CLI args if copying to local HS install   =
   ======================================================*/

  var pathArg = getArg("path");
  var nsArg   = getArg("ns");

  gulp.task('processArgs', function (done) {
      if (pathArg && nsArg) {
        if (!pathArg.match(/\/$/)) {
          pathArg += "/";
        }
        pathArg += "CSP/healthshare/" + nsArg + "/cc";

        seq('cleanHS', 'copyToHS', done);
      }
      else {
        done();
      }
    }
  );

  gulp.task('cleanHS', function (done) {
    // Need force option to delete outside the cwd
    del([pathArg + "/**"], { force: true }, done);
  });

  gulp.task('copyToHS', function () {
    return gulp.src(config.dest + "/**")
      .pipe(gulp.dest(pathArg));
  });


  /*======================================
   =   Determine version info from git   =
   =======================================*/

  var today    = new Date();
  var todayISO = dateFormat(today, "yyyy-mm-dd") + "T00:00:00.000";
  var suffix   = '';
  var branchName, buildno, codeno;

  // Get branch name
  gulp.task('gitBranchName', function (callback) {
    exec('git branch --list',
      function (err, stdout) {
        var lines = stdout.split('\n');
        _.forEach(lines, function (line) {
          if (line.match(/^\*/)) {
            var split  = _.compact(line.split(/[ \t]/g));
            branchName = split[_.indexOf(split, "*") + 1];

            if (branchName != 'master') {
              suffix = '|' + branchName.substr(0, 10);
            }
          }
        });
        callback();
      });
  });

  // Get SHA hash for most recent commit
  gulp.task('gitCommitSHA', function (callback) {
    exec('git log -n 1 --pretty=format:"%H" --branches=' + branchName + "*",
      function (err, stdout) {
        var sha = stdout;
        codeno  = sha.substr(0, 6);
        callback();
      }
    );
  });

  // Get commit count for the current branch for today
  gulp.task('gitCommitCount', function (callback) {
    // git rev-list for the commit count today
    exec('git rev-list HEAD --count --since=\'' + todayISO + '\'' + ' --branches=' + branchName + "*",
      function (err, stdout) {
        var count = parseInt(stdout) + 1;
        buildno   = dateFormat(today, "yyyymmdd") + "." + count;
        callback();
      }
    )
  });

  // Merge the results into the version.json template
  gulp.task('setVersion', function () {
    gulp.src('version.json')
      .pipe(replace('{{buildno}}', buildno + suffix))
      .pipe(replace('{{codeno}}', codeno + suffix))
      .pipe(gulp.dest(config.dest));
  });

  // Sequence tasks
  gulp.task('version', function (done) {
    seq('gitBranchName', 'gitCommitSHA', 'gitCommitCount', 'setVersion', done);
  });

  /*======================================
   =                BUILD                =
   ======================================*/

  gulp.task('build', function (done) {
    var tasks = ['html', 'fonts', 'images', 'js', 'assets', 'sass', 'favicon', 'version'];
    seq('clean', tasks, done);
  });


  /*======================================
   =               DEPLOY                =
   ======================================*/
  gulp.task('deploy', function (done) {
    seq('build', 'fixRelativePath', 'processArgs', done);
  });

})();
