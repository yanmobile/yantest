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
  gulp.task('js', function () {

    var commonOpts = {
      module: 'isc.common',
      strip : 'common/modules/'
    };

    var customOpts = {
      module: 'isc.common',
      strip : 'app/modules/'
    };

    plugins.streamqueue({ objectMode: true },
      gulp.src(config.common.vendor.js),
      gulp.src(config.app.vendor.js),
      gulp.src(plugins._.get(config.common, 'module.assets.vendor.js', [])),
      gulp.src(plugins._.get(config.app, 'module.assets.vendor.js', [])),
      gulp.src(config.app.module.js),

      gulp.src(config.common.module.js).pipe(plugins.ngFilesort()),
      gulp.src(config.common.module.html).pipe(plugins.templateCache(commonOpts)),

      gulp.src(config.app.module.js).pipe(plugins.ngFilesort()),
      gulp.src(config.app.module.html).pipe(plugins.templateCache(customOpts))
    )
      .pipe(plugins.ngAnnotate())
      //.pipe(uglify())
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.concat('app.js'))
      .pipe(plugins.rename({ suffix: '.min' }))
      .pipe(plugins.sourcemaps.write('.'))
      .pipe(gulp.dest(plugins.path.join(config.app.dest.folder, 'js')));
  });
}