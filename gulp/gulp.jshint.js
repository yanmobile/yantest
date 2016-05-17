/**
 * Created by hzou on 3/3/16.
 */


module.exports = {
  init: init
};

function init(gulp, plugins, config, _, util) {

  gulp.task('jshint:common', function () {
    return gulp.src(_.concat(config.common.module.modules, config.common.module.js))
      .pipe(plugins.jshint())
      .pipe(plugins.jscs())// enforce style guide
      .pipe(plugins.stylish.combineWithHintResults())   // combine with jshint results
      .pipe(plugins.jshint.reporter('jshint-stylish'));
  });

  gulp.task('jshint:components', function () {
    return gulp.src(_.concat(config.component.module.modules, config.component.module.js))
      .pipe(plugins.jshint())
      .pipe(plugins.jscs())// enforce style guide
      .pipe(plugins.stylish.combineWithHintResults())   // combine with jshint results
      .pipe(plugins.jshint.reporter('jshint-stylish'));
  });

  gulp.task('jshint:app', function () {
    return gulp.src(_.concat(config.app.module.modules, config.app.module.js))
      .pipe(plugins.jshint())
      .pipe(plugins.jscs())// enforce style guide
      .pipe(plugins.stylish.combineWithHintResults())   // combine with jshint results
      .pipe(plugins.jshint.reporter('jshint-stylish'));
  });


  gulp.task('jshint', ["jshint:common", "jshint:components", "jshint:app"]);

}