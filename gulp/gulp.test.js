/**
 * Created by hzou on 3/3/16.
 */


module.exports = {
  init: init
};

function init(gulp, plugins, config, _, util) {
  
  var tasks = ["test:common", "test:components"];
  if (config.app.modulePath) {
    tasks.push("test:app");
  }

  gulp.task('test', tasks);
}