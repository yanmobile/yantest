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

    var jsSrc = plugins._.concat(
      config.common.vendor.js,
      config.component.vendor.js,
      config.app.vendor.js,
      plugins._.get(config.common, 'module.assets.vendor.js', []),
      plugins._.get(config.component, 'module.assets.vendor.js', []),
      plugins._.get(config.app, 'module.assets.vendor.js', []),
      config.common.module.js,
      config.component.module.js,
      config.app.module.js);

    plugins.streamqueue({ objectMode: true },
      gulp.src(jsSrc),
      gulp.src(config.common.module.html).pipe(plugins.templateCache(commonOpts)),
      gulp.src(config.app.module.html).pipe(plugins.templateCache(customOpts))
    )
      .pipe(plugins.filelog())
      .pipe(plugins.ngAnnotate())
      //.pipe(plugins.uglify())
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.concat('app.js'))
      .pipe(plugins.rename({ suffix: '.min' }))
      .pipe(plugins.sourcemaps.write('.'))
      .pipe(gulp.dest(plugins.path.join(config.app.dest.folder, 'js')));
  });
}