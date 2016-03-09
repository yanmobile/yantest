/**
 * Created by hzou on 3/3/16.
 */


module.exports = {
  init: init
};

function init(gulp, plugins, config, _) {

  gulp.task('html', function () {
    var inject = [];

    if (config.app.cordova) {
      inject.push('<script src="cordova.js"></script>');
    }

    gulp.src(['src/index.html'])
      .pipe(plugins.replace('<!-- inject:js -->', inject.join('\n')))
      .pipe(gulp.dest(config.app.dest.folder));

    gulp.src(['src/config.xml'])
      .pipe(gulp.dest(config.app.dest.folder));
  });
}