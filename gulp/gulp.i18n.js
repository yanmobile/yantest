/**
 * Created by hzou on 3/3/16.
 */


/*==================================
 =            Copy fonts            =
 ==================================*/
module.exports = {
  init: init
};

function init(gulp, plugins, config, _) {
  gulp.task('i18n', function () {
    return gulp.src(config.app.module.assets.i18n)
      .pipe(gulp.dest(plugins.path.join(config.app.dest.folder, 'assets/i18n')));
  });

  gulp.task('mocks', function () {
    return gulp.src(config.app.module.assets.mocks)
      .pipe(gulp.dest(plugins.path.join(config.app.dest.folder, 'assets/mockData')));
  });

  gulp.task('assets', function (done) {
    var tasks = ['i18n', 'mocks'];
    plugins.seq(tasks, done);
  });
}