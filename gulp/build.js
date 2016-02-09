/**
 * Created by douglasgoodman on 1/16/15.
 */

(function () {
  'use strict';

  /*=====================================
   ------    Configuration      ------- */

  var common = require('./common.json');
  var app    = require('./app.json');

  var srcFiles = []
    .concat(common.module.js)
    .concat(app.module.js);


  var config = {
    dest        : app.dest.folder,
    minifyImages: true,
    unitTestDir : 'test/karma.conf.js'
  };

  /*-------  End of Configuration  --------
   ========================================*/


  /*========================================
   =                 require                =
   ========================================*/

  //require('require-dir')('./gulp');

  var gulp          = require('gulp'),
      chmod         = require('gulp-chmod'),
      concat        = require('gulp-concat'),
      cssmin        = require('gulp-cssmin'),
      dateFormat    = require('dateformat'),
      del           = require('del'),
      es            = require('event-stream'),
      exec          = require('child_process').exec,
      execSync      = require('child_process').execSync,
      fs            = require('fs'),
      imagemin      = require('gulp-imagemin'),
      jshint        = require('gulp-jshint'),
      karma         = require('karma').server,
      mobilizer     = require('gulp-mobilizer'),
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
      jscs          = require('gulp-jscs'),
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
    var argName = '--' + name;
    _.forEach(process.argv, function (arg) {
      var re = new RegExp('^' + argName);
      if (re.test(arg)) {
        argValue = arg.replace(argName + '=', '').replace('"', '');
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
    return gulp.src(srcFiles)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jscs({ fix: true }))
      .pipe(jscs.reporter())
      .pipe(size());
  });

  /*==================================
   =            Copy fonts            =
   ==================================*/

  gulp.task('fonts', function () {
    var typography = []
      .concat(common.vendor.fonts)
      .concat(app.vendor.fonts);

    return gulp.src(typography)
      .pipe(gulp.dest(path.join(config.dest, 'fonts')));
  });


  /*==================================
   =            Copy css            =
   ==================================*/

  gulp.task('vendor:css', function () {
    return gulp.src(common.vendor.css)
      .pipe(gulp.dest(path.join(config.dest, 'css')));
  });

  /*==================================
   =           Copy assets           =
   ==================================*/

  gulp.task('i18n', function () {
    return gulp.src(app.module.assets.i18n)
      .pipe(gulp.dest(path.join(config.dest, 'assets/i18n')));
  });

  gulp.task('mocks', function () {
    return gulp.src(app.module.assets.mocks)
      .pipe(gulp.dest(path.join(config.dest, 'assets/mockData')));
  });

  gulp.task('assets', function (done) {
    var tasks = ['i18n', 'mocks'];
    seq(tasks, done);
  });

  /*=====================================
   =            Minify images           =
   =                                    =
   this will pull in images from src/assets and src/js/common/assets
   as well as any images in the plugins directory
   =====================================*/

  gulp.task('images', function () {
    var srcImages = []
      .concat(common.module.assets.images)
      .concat(app.module.assets.images);
    var stream    = gulp.src(srcImages);

    if (config.minifyImages) {
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
    return gulp
      .src(app.module.scss)
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
      .pipe(rename({ basename: 'main', suffix: '.min' }))
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
      module: 'isc.common',
      strip : 'app/modules/'
    };

    streamqueue({ objectMode: true },
      gulp.src(common.vendor.js),
      gulp.src(app.vendor.js),
      gulp.src(_.get(common, 'module.assets.vendor.js', [])),
      gulp.src(_.get(app, 'module.assets.vendor.js', [])),
      gulp.src(app.module.js),

      gulp.src(common.module.js).pipe(ngFilesort()),
      gulp.src(common.module.html).pipe(templateCache(commonOpts)),

      gulp.src(app.module.js).pipe(ngFilesort()),
      gulp.src(app.module.html).pipe(templateCache(customOpts))
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

    if (app.cordova) {
      inject.push('<script src="cordova.js"></script>');
    }

    gulp.src(['src/index.html'])
      .pipe(replace('<!-- inject:js -->', inject.join('\n')))
      .pipe(gulp.dest(config.dest));

    gulp.src(['src/config.xml'])
      .pipe(gulp.dest(config.dest));
  });


  /*======================================
   =   Determine version info from git   =
   =======================================*/

  var today            = new Date();
  var todayISO         = dateFormat(today, 'yyyy-mm-dd') + 'T00:00:00.000';
  var suffix           = '';
  var outputDateFormat = 'yyyymmdd';
  var syncEncoding     = { encoding: 'utf-8' };
  var upstreamUpdated  = false;

  var appBuildno, appCodeno,
      coreBuildno, coreBuildCount, coreCodeno,
      coreSHA = '';

  gulp.task('gitFetch', function (callback) {
    exec('git fetch --multiple origin upstream',
      function (err, stdout) {
        upstreamUpdated = !err;
        callback();
      });
  });

  // Looks through local and remote:upstream history for the most recent shared commit
  gulp.task('gitCoreInfo', function (callback) {
    if (!upstreamUpdated) {
      console.log('Warning: Unable to update remote "upstream" for version system')
    }
    else {
      // Get all merged commits for this repo
      var commits = execSync('git log origin/master --merges --pretty="%H|%ci" ', syncEncoding);

      var lines = _.compact(commits.split('\n'));
      var done  = false;

      // Check each merged commit against upstream/master for a match
      _.forEach(lines, function (commitLine) {
        var commitInfo = _.compact(commitLine.split('|')),
            commitSHA  = commitInfo[0],
            commitDate = new Date(commitInfo[1]),
            sinceDate  = new Date(commitDate).toISOString();

        // Look at all merges from upstream/master since the local SHA we are checking against
        var cmd = 'git log upstream/master --merges --pretty="%H|%ci" --since=\'' + sinceDate + '\'';

        var upstream      = execSync(cmd, syncEncoding).trim();
        var upstreamLines = _.compact(upstream.split('\n'));

        _.forEach(upstreamLines, function (upstreamLine) {
          var upstreamInfo = _.compact(upstreamLine.split('|')),
              upstreamSHA  = upstreamInfo[0],
              upstreamDate = new Date(upstreamInfo[1]);

          // If the commit SHA matches, this is the most recent commit that is shared between core and this app
          if (upstreamSHA === commitSHA) {
            // Count up the number of builds from core on that date
            coreBuildno = dateFormat(upstreamDate, outputDateFormat);
            coreSHA     = upstreamSHA;
            coreCodeno  = coreSHA.substr(0, 6);

            // Get the build count for upstream/master on the date of the commit
            var sinceDate = dateFormat(upstreamDate.toISOString(), 'yyyy-mm-dd') + 'T00:00:00.000',
                untilDate = new Date(upstreamDate).toISOString();

            var countCmd = 'git rev-list upstream/master --count --merges '
              + ' --since=\'' + sinceDate + '\''
              + ' --until=\'' + untilDate + '\'';

            coreBuildCount = execSync(countCmd, syncEncoding).trim();

            done = true;
            return false; // break _.forEach
          }
        });

        // Short-circuit for outer _.forEach
        if (done) {
          return false;
        }
      });

      if (!coreCodeno) {
        console.log('Warning: No commits matching remote "upstream/master" were found');
        coreBuildno = coreCodeno = 'unavailable';
      }
      else {
        coreBuildno += ('.' + coreBuildCount);
      }
    }

    callback();
  });

  gulp.task('gitLocalInfo', function (callback) {
    var branchName = '';

    // Get branch name
    var branchList = execSync('git branch --list', syncEncoding);
    var lines      = branchList.split('\n');
    _.forEach(lines, function (line) {
      if (line.match(/^\*/)) {
        var split  = _.compact(line.split(/[ \t]/g));
        branchName = split[_.indexOf(split, "*") + 1];

        if (branchName != 'master') {
          suffix = '|' + branchName.substr(0, 10);
        }
      }
    });

    // Get latest commit for this branch
    var sha   = execSync('git log -n 1 --pretty=format:"%H" --branches=' + branchName + "*", syncEncoding);
    appCodeno = sha.substr(0, 6);

    // Get commit count for the current branch for today
    var commitCount = execSync(
      'git rev-list HEAD --count --since=\'' + todayISO + '\'' + ' --branches=' + branchName + "*",
      syncEncoding
    );

    var count  = parseInt(commitCount) + 1;
    appBuildno = dateFormat(today, outputDateFormat) + "." + count;

    callback();
  });

  // Merge the results into the version.json template
  gulp.task('setVersion', function () {
    gulp.src('version.json')
      .pipe(replace('{{appBuildno}}', appBuildno + suffix))
      .pipe(replace('{{appCodeno}}', appCodeno + suffix))
      .pipe(replace('{{coreBuildno}}', coreBuildno))
      .pipe(replace('{{coreCodeno}}', coreCodeno))
      .pipe(gulp.dest(config.dest));
  });

  // Sequence tasks
  gulp.task('version', function (done) {
    seq('gitFetch', 'gitCoreInfo', 'gitLocalInfo', 'setVersion', done);
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
    seq('build', done);
  });

})();
