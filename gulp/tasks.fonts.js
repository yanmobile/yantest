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
  gulp.task('fonts', function () {
    var typography = []
      .concat(config.common.vendor.fonts)
      .concat(config.component.vendor.fonts)
      .concat(config.app.vendor.fonts);

    return gulp.src(typography)
      .pipe(gulp.dest(plugins.path.join(config.app.dest.folder, 'fonts')));
  });
}