/**
 * Created by hzou on 3/3/16.
 */


module.exports = {
  init: init
};

function init(gulp, plugins, config, _) {
  gulp.task('build', function (done) {
    var tasks = ['fonts', 'images', 'scripts', 'templates', 'i18n', 'mocks', 'sass', 'favicon', 'version'];
    return plugins.seq('clean', tasks, 'html', ['test', 'jshint'], done);
  });
}