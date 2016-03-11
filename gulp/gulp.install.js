/**
 * Created by hzou on 3/3/16.
 */

var install    = require('gulp-install');
module.exports = {
  init: init
};

function init(gulp, plugins, config, _) {
  var ignoreSrc = [
    "!**/www/**",
    "!**/bower_components/**",
    "!**/node_modules/**"
  ];
  gulp.task('install', function (cb) {
    var src = ignoreSrc.concat(['package.json', '**/bower.json']);
    return gulp.src(src)
      .pipe(plugins.filelog())
      .pipe(install());

  });
}