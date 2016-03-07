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
  gulp.task('templates', function () {

    var tplCacheOpts = {
      module: 'isc.common'
    };

    plugins.streamqueue({ objectMode: true },
      gulp.src(config.common.module.html).pipe(plugins.templateCache(tplCacheOpts)),
      gulp.src(config.component.module.html).pipe(plugins.templateCache(tplCacheOpts)),
      gulp.src(config.app.module.html).pipe(plugins.templateCache(tplCacheOpts))
    )
      .pipe(plugins.filelog())
      .pipe(plugins.concat('templates.min.js'))
      .pipe(gulp.dest(plugins.path.join(config.app.dest.folder, 'js')));
  });
}