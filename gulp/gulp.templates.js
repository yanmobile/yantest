/**
 * Created by hzou on 3/3/16.
 */


module.exports = {
  init: init
};

function init(gulp, plugins, config, _) {
  gulp.task('templates', function () {

    var tplCacheOpts = {
      module    : 'isc.templates',
      standalone: true
    };

    var templates    = _.concat(config.common.module.html,
      config.component.module.html,
      config.app.module.html);

    gulp
      .src(templates)
      //.pipe(plugins.filelog())
      .pipe(plugins.templateCache(tplCacheOpts))
      .pipe(plugins.concat('templates.min.js'))
      .pipe(gulp.dest(plugins.path.join(config.app.dest.folder, 'js')));
  });
}