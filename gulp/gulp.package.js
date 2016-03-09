/**
 * Created by hzou on 3/3/16.
 */

const fs    = require('fs');
const path  = require('path');
const gutil = require('gulp-util');

module.exports = {
  init: init
};

function init(gulp, plugins, config, _) {

  gulp.task('package', function (done) {
    config.folderModules = {
      components: path.join("src/components/foundation/default/modules/"),
      common    : path.join("src/common/modules/"),
      app       : path.join("src/app/modules/")
    };

    var components = {};

    _.forEach(config.folderModules, function (modulePath, pathName) {
      components[pathName] = getDirectories(modulePath);
    });

    _.forEach(components, function (component, name) {
      _.forEach(component, function (folder) {
        console.log(folder.path, folder.name);
      });
    });
  });

  function getDirectories(srcpath) {
    return fs.readdirSync(srcpath)
      .filter(function (file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
      }).map(function (file) {
        return {
          name: file,
          path: path.join(srcpath, file)
        };
      });
  }
}

