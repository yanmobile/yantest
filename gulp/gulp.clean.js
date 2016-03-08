/**
 * Created by hzou on 3/3/16.
 */


module.exports = {
  init: init
};

function init(gulp, plugins, config, _) {
  gulp.task('clean', function (done) {
    return plugins.del(['./www/**'], done);
  });
}