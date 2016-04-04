/**
 * Created by hzou on 3/3/16.
 */


module.exports = {
  init: init
};

function init(gulp, plugins, config, _) {
  var appconfig = 'src/app/modules/app.config.js',
      configOverride = getArg('--config'),
      cwd = process.cwd();

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

    if(configOverride){
      jsSrc.push(configOverride);
      jsSrc.push("!src/app/modules/app.config.js");
    }

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

  /**
   * @description
   * This function finds the value of command line parameters regardless their location or their appearance order
   * for example: gulp script --config /tmp/app.config.js
   * getArg("--config") // => /tmp/app.config.js
   * @param key
   * @returns {*}
   */
  function getArg(key){
    var index = process.argv.indexOf(key);
    var next = process.argv[index + 1];
    return (index < 0) ? null : (!next || next[0] === "-") ? true : next;
  }
}