/**
 * Created by hzou on 3/3/16.
 */


/*==================================
 =            Copy fonts            =
 ==================================*/
module.exports = {
  init: init
};

function init(gulp, plugins, config) {
  gulp.task('deploy', function (done) {
    plugins.seq('build', done);
  });
}