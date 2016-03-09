/**
 * Created by hzou on 3/3/16.
 */


module.exports = {
  init: init
};

function init(gulp, plugins, config, _) {
  gulp.task('scripts', function () {

    var configPaths = ["vendor.js",
      "module.assets.vendor.js",
      "module.modules",
      "module.js"
    ];

    var jsSrc = [];
    _.forEach(configPaths, function (configPath) {
      jsSrc.push(_.get(config.common, configPath, []));
      jsSrc.push(_.get(config.component, configPath, []));
      jsSrc.push(_.get(config.app, configPath, []));
    });
    jsSrc     = _.flatten(jsSrc);

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