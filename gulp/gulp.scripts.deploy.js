/**
 * Created by hzou on 3/3/16.
 */


var inject = require('gulp-inject');

module.exports = {
  init: init
};

function init(gulp, plugins, config, _, util) {
  "use strict";

  var configOverride = util.getArg('--config');

  gulp.task('scripts:deploy', function () {

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

    if (configOverride) {
      jsSrc.push(configOverride);
      jsSrc.push(config.app.excludeConfig);
    }

    jsSrc = _.flatten(jsSrc);

    return gulp.src(jsSrc)
      //.pipe(plugins.filelog())
      .pipe(plugins.ngAnnotate())
      .pipe(plugins.concat('app.min.js'))
      .pipe(plugins.uglify())
      .pipe(gulp.dest(plugins.path.join(config.app.dest.folder, 'js')));


  });

}