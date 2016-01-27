hs-core-ui-ddp
==================

HealthShare UI infrastructure that is intended for use across projects

Note that if you are creating a modified build of your application, you should not modify these files. If you do, you risk them being overwritten on routine updates.

To use:

    clone the github repository in a sibling directory
    The folder structure should be similar to this:
        gulp (contains all the build tasks, including common.json)
            common.json
            app.json    //application specific
            build.js
            test-unit.js
        gulpfile.js
        package.json
        src
            common
                assets
                modules
                    bower.json
            app    //application specific
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
                app    //application specific
        
Run application:

    npm install -g bower gulp
    npm install     //from project root folder
    cd src/common
    bower install
    cd src/app      //application specific
    bower install   //application specific
    gulp serve
    
Run tests:

    gulp test        //only available as part of app specific task
    gulp test:common
    gulp test:app    //application specific
