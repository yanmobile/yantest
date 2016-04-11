/**
 * Created by hzou on 3/3/16.
 */

const fs    = require('fs');
const path  = require('path');
const gutil = require('gulp-util');

module.exports = {
  init: init
};

function init(gulp, plugins, config, _) {

  gulp.task('component.json', function (done) {
    return gulp.src(['src/components/foundation/default/component.json']).
      pipe(gulp.dest('gulp'));
  });
}

