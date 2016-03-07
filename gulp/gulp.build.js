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
  gulp.task('build', function (done) {
    var tasks = ['html', 'fonts', 'images', 'scripts', 'templates', 'assets', 'sass', 'favicon', 'version'];
    plugins.seq('clean', tasks, done);
  });
}