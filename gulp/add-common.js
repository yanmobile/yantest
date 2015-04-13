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
  gulp.task('clean-common:desktop', function (done) {
    del([ 'src/js/common/*', 'src/templates/desktop/common/*' ], done );
  });

  // phonegap
  gulp.task('clean-common:phonegap', function (done) {
    del([ 'src/js/common/*', 'src/templates/phonegap/common/*' ], done );
  });

  // both
  gulp.task('clean-common', function (done) {
    del([ 'src/js/common/*', 'src/templates/desktop/common/*', 'src/templates/phonegap/common/*' ], done );
  });

  /*==============================
   =     inject js and assets    =
   ===============================*/

  gulp.task('inject-common-js', function () {
    var js = ['../hs-ui-angular-core/src/app/common/**/*'];
    var dest = 'src/js/common/';

    return gulp.src( js )
        .pipe( gulp.dest( dest ));
  });

  /*==============================
   =       inject templates      =
   ===============================*/

  gulp.task('inject-common-templates:desktop', function () {
    var html = ['../hs-ui-angular-core/src/templates/**/*'];
    var dest = 'src/templates/desktop/';

    return gulp.src( html )
      .pipe( gulp.dest( dest ));
  });

  gulp.task('inject-common-templates:phonegap', function () {
    var html = ['../hs-ui-angular-core/src/templates/**/*'];
    var dest = 'src/templates/phonegap/';

    return gulp.src( html )
      .pipe( gulp.dest( dest ));
  });

  /*==============================
   =           copy              =
   ===============================*/

  // js only
  gulp.task('add-common:js', function(done) {
    var tasks = ['inject-common-js' ];
    seq('clean-common', tasks, done);
  });

  // js + desktop html
  gulp.task('add-common:desktop', function(done) {
    var tasks = ['inject-common-js','inject-common-templates:desktop' ];
    seq('clean-common:desktop', tasks, done);
  });

  // js + phonegap html
  gulp.task('add-common:phonegap', function(done) {
    var tasks = ['inject-common-js','inject-common-templates:phonegap' ];
    seq('clean-common:phonegap', tasks, done);
  });

  // all
  gulp.task('add-common:all', function(done) {
    var tasks = ['inject-common-js','inject-common-templates:desktop','inject-common-templates:phonegap' ];
    seq('clean-common', tasks, done);
  });

})();
