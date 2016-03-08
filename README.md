hs-core-ui-ddp
==================

HealthShare UI infrastructure that is intended for use across projects

Note that if you are creating a modified build of your application, you should not modify these files. If you do, you risk them being overwritten on routine updates.

To use:

    clone the github repository in a sibling directory
    The folder structure should be similar to this:
    
    |-- src //source code
    |   |-- common  //should not contain any UI Components / CSS styles
    |   |   |-- assets
    |   |   |-- modules
    |   |   |-- bower.json    
    |   |-- components
    |   |   |-- foundation
    |   |   |   |-- base //default edition
    |   |   |   |   |-- assets
    |   |   |   |   |-- modules
    |   |   |   |   |-- bower.json
    |   |   |   |   |-- components.json //if this edition is picked, this file will be copied to "gulp/components.json"
    |   |-- app     //application specific
    |   |   |-- assets
    |   |   |-- modules
    |   |   |-- bower.json  
    |   |   |-- bower.json
    |   |-- test
    |   |   |-- unit
    |   |   |   |-- common
    |   |   |   |-- component
    |   |   |   |-- app     //application specific

        
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
