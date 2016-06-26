/**
 * Created by hzou on 3/3/16.
 */

module.exports = {
  init: init
};

function init(gulp, plugins, config, _, util) {
  var configOverride = util.getArg( '--config' );

  gulp.task('scripts:vendor', function () {
    var vendors = _.concat(config.common.vendor.js,
      config.component.vendor.js,
      config.app.vendor.js,
      config.common.module.assets.vendor.js,
      config.component.module.assets.vendor.js,
      config.app.module.assets.vendor.js);

    return gulp.src(vendors)
      .pipe(plugins.plumber())
      //.pipe(plugins.filelog())
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.concat('1.vendor.min.js'))
      .pipe(plugins.sourcemaps.write('.'))
      // .pipe(plugins.bytediff.start())
      // .pipe(plugins.uglify())
      // .pipe(plugins.bytediff.stop())
      .pipe(gulp.dest(plugins.path.join(config.app.dest.folder, 'js')));
  });

  gulp.task('scripts:common', function () {
    var src = _.concat(config.common.module.modules,
      config.common.module.js,
      config.masterConfig.overrides.js.common);

    return gulp.src(src)
      .pipe(plugins.plumber())
      //.pipe(plugins.filelog())
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.ngAnnotate())
      .pipe(plugins.concat('3.common.min.js'))
      // .pipe(plugins.bytediff.start())
      // .pipe(plugins.uglify())
      // .pipe(plugins.bytediff.stop())
      .pipe(plugins.sourcemaps.write('.'))
      .pipe(gulp.dest(plugins.path.join(config.app.dest.folder, 'js')));
  });

  gulp.task('scripts:components', function () {
    var src = _.concat(
      config.component.module.modules,
      config.component.module.js,
      config.masterConfig.overrides.js.components);

    return gulp.src(src)
      .pipe(plugins.plumber())
      //.pipe(plugins.filelog())
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.ngAnnotate())
      .pipe(plugins.concat('5.components.min.js'))
      // .pipe(plugins.bytediff.start())
      // .pipe(plugins.uglify())
      // .pipe(plugins.bytediff.stop())
      .pipe(plugins.sourcemaps.write('.'))
      .pipe(gulp.dest(plugins.path.join(config.app.dest.folder, 'js')));
  });

  gulp.task('scripts:app', function () {
    var src = _.concat(config.app.module.modules, config.app.module.js);

    if (configOverride) {
      src.push(configOverride);
      src.push(config.app.excludeConfig);
    }

    return gulp.src(src)
      .pipe(plugins.plumber())
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.ngAnnotate())
      .pipe(plugins.concat('7.app.min.js', { newLine: ';' }))
      // .pipe(plugins.bytediff.start())
      // .pipe(plugins.uglify())
      // .pipe(plugins.bytediff.stop())
      .pipe(plugins.sourcemaps.write('./'))
      .pipe(gulp.dest(plugins.path.join(config.app.dest.folder, 'js')));
  });

  gulp.task('scripts', ["scripts:vendor", "scripts:common", "scripts:components", "scripts:app"]);
}