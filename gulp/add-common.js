/**
 * Created by douglas goodman on 1/16/15.
 */

/*===================================================
 =    copy hs-ui-angular-core files into project    =
 ===================================================*/

(function(){
  'use strict';

  /*==============================
   =          require            =
   ===============================*/

  var gulp        = require('gulp'),
      seq         = require('run-sequence'),
      del         = require('del');


  /*==============================
   =           clean             =
   ===============================*/

  // desktop
  gulp.task('clean-common', function (done) {
    del([ 'src/js/common/*', 'src/templates/common/*' ], done );
  });

  //// phonegap
  //gulp.task('clean-common:phonegap', function (done) {
  //  del([ 'src/js/common/*', 'src/templates/phonegap/common/*' ], done );
  //});
  //


  /*==============================
   =   inject gulp and configs   =
   ===============================*/
  gulp.task('inject-gulp', function () {
    var src = ['../hs-ui-angular-core/gulp/**/*'];
    var dest = 'gulp/';

    return gulp.src( src )
      .pipe( gulp.dest( dest ));
  });

  gulp.task('inject-main-configs', function () {
    var src = [
      '../hs-ui-angular-core/bower.json',
      '../hs-ui-angular-core/gulpfile.js',
      '../hs-ui-angular-core/package.json'
    ];
    var dest = '';

    return gulp.src( src )
      .pipe( gulp.dest( dest ));
  });

  gulp.task('inject-test-configs', function () {
    var src = [
      '../hs-ui-angular-core/karma.conf.js',
      '../hs-ui-angular-core/protractor.conf.js'
    ];

    var dest = 'test/';

    return gulp.src( src )
      .pipe( gulp.dest( dest ));
  });

  gulp.task('inject-phonegap-config', function () {
    var src = ['../hs-ui-angular-core/src/config.xml'];

    var dest = 'src/';

    return gulp.src( src )
      .pipe( gulp.dest( dest ));
  });


  /*==============================
   =     inject js and assets    =
   ===============================*/

  gulp.task('inject-common-js', function () {
    var js = ['../hs-ui-angular-core/src/js/common/**/*'];
    var dest = 'src/js/common/';

    return gulp.src( js )
      .pipe( gulp.dest( dest ));
  });


  /*==============================
   =       inject templates      =
   ===============================*/

  gulp.task('inject-common-templates', function () {
    var html = ['../hs-ui-angular-core/src/templates/common/**/*'];
    var dest = 'src/templates/common/';

    return gulp.src( html )
      .pipe( gulp.dest( dest ));
  });

  //gulp.task('inject-common-templates:phonegap', function () {
  //  var html = ['../hs-ui-angular-core/src/templates/**/*'];
  //  var dest = 'src/templates/phonegap/';
  //
  //  return gulp.src( html )
  //    .pipe( gulp.dest( dest ));
  //});

  /*==============================
   =           copy              =
   ===============================*/

  gulp.task('add-configs', function(done) {
    var tasks = [
      'inject-gulp',
      'inject-main-configs',
      'inject-test-configs',
      'inject-phonegap-config'
    ];

    seq( tasks, done);
  });


  // js only
  gulp.task('add-common:js', function(done) {
    var tasks = ['inject-common-js' ];
    seq('clean-common', tasks, done);
  });

  // js + desktop html
  gulp.task('add-common', function(done) {
    var tasks = ['inject-common-js','inject-common-templates' ];
    seq('clean-common', tasks, done);
  });

  //// js + phonegap html
  //gulp.task('add-common:phonegap', function(done) {
  //  var tasks = ['inject-common-js','inject-common-templates:phonegap' ];
  //  seq('clean-common:phonegap', tasks, done);
  //});
  //
  //// all
  //gulp.task('add-common:all', function(done) {
  //  var tasks = ['inject-common-js','inject-common-templates','inject-common-templates:phonegap' ];
  //  seq('clean-common', tasks, done);
  //});

})();
