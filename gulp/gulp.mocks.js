/**
 * Created by hzou on 3/3/16.
 */


module.exports = {
  init: init
};

function init(gulp, plugins, config, _) {

  gulp.task('mocks', function () {
    return gulp.src(config.app.module.assets.mocks)
      .pipe(gulp.dest(plugins.path.join(config.app.dest.folder, 'assets/mockData')));
  });

}