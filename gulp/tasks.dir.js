/**
 * Created by hzou on 3/3/16.
 */

const fs    = require('fs');
const path  = require('path');
const gutil = require('gulp-util');
/*==================================
 =            Copy fonts            =
 ==================================*/
module.exports = {
  init: init
};

function init(gulp, plugins, config, _) {
  gulp.task('dir', function (done) {
    config.folderModules = {
      components: path.join("src/components/modules/"),
      common    : path.join("src/common/modules/"),
      app       : path.join("src/app/modules/")
    };

    var components = {};

    _.forEach(config.folderModules, function (modulePath, pathName) {
      components[pathName] = getDirectories(modulePath);
    });

    gutil.log("components", components);
  });

  function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function (file) {
      return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
  }
}