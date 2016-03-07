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
  gulp.task('favicon', function () {
    return gulp.src(['src/favicon.ico', 'src/favicon-16x16.png', 'src/cmc.ico'])
      .pipe(gulp.dest(config.app.dest.folder));
  });
}