/**
 * Created by hzou on 3/3/16.
 */


module.exports = {
  init: init
};

function init(gulp, plugins, config, _) {

  gulp.task('html', function () {
    return plugins.seq(["html:index", "html:config"]);
  });

  gulp.task('html:index', function () {
    var inject = ['<!-- inject:js -->'];

    if (config.app.cordova) {
      inject.unshift('<script src="cordova.js"></script>');
    }

    var cwd = process.cwd();
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    process.chdir(cwd + "/www");
    var jsFiles = gulp
      .src(['js/*.js'], { read: false })
      .pipe(plugins.filelog());
    process.chdir(cwd);

    return gulp.src(['src/index.html'])
      .pipe(plugins.plumber())
      .pipe(plugins.replace('<!-- inject:js -->', inject.join('\n')))
      .pipe(plugins.inject(jsFiles, { transform: createScriptHtml }))
      .pipe(gulp.dest(config.app.dest.folder));
  });

  gulp.task('html:config', function () {
    return gulp.src(['src/config.xml'])
      .pipe(gulp.dest(config.app.dest.folder));
  });

  //used by gulp-inject to remove the leading "/"
  function createScriptHtml(filepath, file, i, length) {
    return ['<script src="', filepath.substr(1), '"></script>'].join('');
  }
}