/**
 * Created by hzou on 3/3/16.
 */


module.exports = {
  init: init
};

function init(gulp, plugins, config, _, util) {

  gulp.task('jsformat:common', function () {
    return gulp.src(_.concat(config.common.module.modules, config.common.module.js))
      .pipe(plugins.jscs({ fix: true }))// enforce style guide
      .pipe(gulp.dest(config.common.modulePath));
  });

  gulp.task('jsformat:components', function () {
    return gulp.src(_.concat(config.component.module.modules, config.component.module.js))
      .pipe(plugins.jscs({ fix: true }))// enforce style guide
      .pipe(gulp.dest(config.component.modulePath));
  });

  gulp.task('jsformat:app', function () {
    return gulp.src(_.concat(config.app.module.modules, config.app.module.js))
      .pipe(plugins.jscs({ fix: true }))// enforce style guide
      .pipe(gulp.dest(config.app.modulePath)); //this causes gulp watch to loop infinitely
  });

  var tasks = ["jsformat:common", "jsformat:components"];
  if (config.app.modulePath) {
    tasks.push("jsformat:app");
  }

  gulp.task('jsformat', tasks);
}