/**
 * Created by hzou on 3/3/16.
 */


/*==================================
 =            Copy fonts            =
 ==================================*/
module.exports = {
  init: init
};

function init(gulp, plugins, config) {
  gulp.task('images', function () {
    var srcImages = []
      .concat(config.common.module.assets.images)
      .concat(config.app.module.assets.images);
    var stream    = gulp.src(srcImages);

    if (config.app.minifyImages) {
      // note that we must ensure the files are writable before minifying
      stream = stream
        .pipe(plugins.chmod(755))
        .pipe(plugins.imagemin({
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          use        : [plugins.pngcrush()]
        }));
    }

    return stream.pipe(gulp.dest(plugins.path.join(config.app.dest.folder, 'assets/images')));
  });
}