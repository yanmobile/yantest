hs-ui-angular-core
==================

HealthShare UI infrastructure that is intended for use across projects

Note that if you are creating a modified build of your application, you should not modify these files. If you do, you risk them being overwritten on routine updates.

To use:

    clone the github repository in a sibling directory
    The folder structure should be similar to this:
        gulp (contains all the build tasks, including common.json)
        gulpfile.js
        package.json
        src
          common
            assets
            modules
            bower.json
          custom
            assets
            bower.json
            modules
              app
              (other app-specific modules...)
            favicon.ico
            index.html
        test
          unit
            common
            custom
        
        