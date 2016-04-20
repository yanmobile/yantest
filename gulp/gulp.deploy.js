/**
 * Created by hzou on 3/3/16.
 */


module.exports = {
  init: init
};

function init(gulp, plugins, config, _) {
  return gulp.task('deploy', ["clean"], function () {
    return plugins.seq(['fonts', 'images', 'scripts:deploy', 'templates', 'i18n', 'sass', 'favicon', 'version'], 'html');
  });
}