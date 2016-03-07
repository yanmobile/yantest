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
  gulp.task('scripts', function () {

    var jsSrc = _.concat(
      config.common.vendor.js,
      config.component.vendor.js,
      config.app.vendor.js,
      _.get(config.common, 'module.assets.vendor.js', []),
      _.get(config.component, 'module.assets.vendor.js', []),
      _.get(config.app, 'module.assets.vendor.js', []),
      config.common.module.modules,
      config.component.module.modules,
      config.app.module.modules,
      config.common.module.js,
      config.component.module.js,
      config.app.module.js);

    gulp.src(jsSrc)
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