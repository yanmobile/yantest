/**
 * Created by hzou on 3/3/16.
 */


module.exports = {
  init: init
};

function init(gulp, plugins, config, _) {

  var srcFiles = []
    .concat(config.common.module.modules)
    .concat(config.components.module.modules)
    .concat(config.app.module.modules)
    .concat(config.common.module.js)
    .concat(config.components.module.js)
    .concat(config.app.module.js);

  gulp.task('jshint', function () {
    return gulp.src(srcFiles)
      .pipe(plugins.jshint())
      .pipe(plugins.jshint.reporter('jshint-stylish'))
      .pipe(plugins.jscs({ fix: true }))
      .pipe(plugins.jscs.reporter())
      .pipe(plugins.size());
  });
}