/**
 * Created by hzou on 3/3/16.
 */


module.exports = {
  init: init
};

function init( gulp, plugins, config, _, util ) {

  gulp.task('jsformat:common', function () {
    return gulp.src(_.concat(config.common.module.modules, config.common.module.js), { base: "./" })
      .pipe(util.getPlumber())
      .pipe(plugins.jscs({ fix: true }))// enforce style guide
      .pipe(gulp.dest("./"));
  });

  gulp.task('jsformat:components', function () {
    return gulp.src(_.concat(config.component.module.modules, config.component.module.js), { base: "./" })
      .pipe(util.getPlumber())
      .pipe(plugins.jscs({ fix: true }))// enforce style guide
      .pipe(gulp.dest("./"));
  });

  gulp.task('jsformat:app', function () {
    return gulp.src(_.concat(config.app.module.modules, config.app.module.js), { base: "./" })
      .pipe(util.getPlumber())
      .pipe(plugins.jscs({ fix: true }))// enforce style guide
      .pipe(gulp.dest("./"));
  });

  var tasks = ["jsformat:common", "jsformat:components"];
  if (config.app.modulePath) {
    tasks.push("jsformat:app");
  }

  gulp.task('jsformat', tasks);
}