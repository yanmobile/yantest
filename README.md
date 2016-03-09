hs-core-ui
==================

HealthShare UI infrastructure that is intended for use across projects

Note that if you are creating a modified build of your application, you should not modify these files. If you do, you risk them being overwritten on routine updates.

To use:

    clone the github repository in a sibling directory
    The folder structure should be similar to this:
    
    
    |-- gulp.js //utilizes gulp tasks inside of ./gulp folder
    |-- config.xml  //used by cordova
    |-- jsdocs
    |   |-- conf.json   //jsDocs configuration
    |-- src //source code
    |   |-- index.html
    |   |-- common  //should not contain any UI Components / CSS styles
    |   |   |-- assets
    |   |   |-- modules
    |   |   |   |-- isc.common.module.js
    |   |   |-- bower.json    
    |   |-- components
    |   |   |-- foundation
    |   |   |   |-- base //default edition
    |   |   |   |   |-- assets
    |   |   |   |   |-- modules
    |   |   |   |   |   |-- isc.components.module.js
    |   |   |   |   |-- bower.json
    |   |   |   |   |-- components.json //if this edition is picked, this file will be copied to "gulp/components.json"
    |   |-- app     //application specific
    |   |   |-- assets
    |   |   |-- modules
    |   |   |-- bower.json  
    |   |   |-- bower.json
    |-- test
    |   |-- unit
    |   |   |-- common
    |   |   |-- component
    |   |   |-- app     //application specific

        
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

##FAQs
* **This framework looks awesome, how do I create a fully functional application using this framework in a couple of minutes?**
  * We highly recommend leveraging our [hs-core-tools](https://github.com/intersystems/hs-core-tools) to fecilitate the creation of your new application. 
* **What are the differences between "src/app", "src/common" and "src/components"**
  * "src/common" is framework code and should only be updated directly by framework developers. It defines system wide behaviors such as session management, state authorization, page configuration, and etc.
  * "src/components" is a framework code and should only be updated directly by framework and edition developers. It defines different UI-Components (bootstrap, foundation for apps, angular material) and the different editions (US, UK, Chinese) utilizing for the selected UI-Component. 
  * "src/app" is application code should only be updated by application developers.  It contains application specific logic and pages.
* **I want to include a new bower package to my application, where should I install it?**
  * Application specific bower pakages should be installed under "src/app/" folder (don't install it in "src/common" and "src/components") 
* **Now that I have bower package successfully installed in "src/app/" folder, how do I add it to the application?**
  * We use Gulp to automate build tasks. Application specific gulp configuration can be found at "gulp/app.json". You'll need to specify the file path of your bower package in "vendor.js" json property which is line 3 of "gulp/app.json" file.
* **How do I add a new javascript package which is not avaiable through bower?**
  * You'll need to paste your non-bower library js files in "src/app/assets/vendors/" folder. If this folder doesn't exist, create one.
  * You'll have to reference your js file in "gulp/app.json" configuration file under this key path: "module.assets.vendor.js" array.
* **How do I include a 3rd party css file in my application?**
  * The framework does not support *.css file extensions, you'll need to rename your *.css extension to *.scss (superset of css) and place your *.scss file in "src/app/assets/sass/" folder. Once your file is in the sass folder, add a reference to  "src/app/assets/sass/main.scss" file.
* **How do I control what gets outputted in the console?**
  * Open up your "src/app/modules/app.config.js" file and add/remove channels in 'devlogWhitelist' and 'devlogBlacklist' arrays. Note: "\*" means all channels.
* **How do I change the REST API's hostname and Port number?**
  *  You can change the hostname and PORT number inside of app config file located "src/app/modules/app.config.js" 
* **I have an existing application and my framework is out of date. How can I upgrade my application's framework?**
  1. Ensure you have a local git remote upstream is pointing to "https://github.com/intersystems/hs-core-ui.git"
    1. execute ```git remote -v``` to check existing git remote repo mappings
    2. if "upstream" doesn't exist, add it by executing ```git remote add upstream https://github.com/intersystems/hs-core-ui.git```
  2. create a new branch off remote master ```git checkout -b framework-update origin/master```
  3. pull the framework into your branch ```git pull upstream master```
  4. resolve conflicts (if any) and commit
  5. update your node and bower packages (we recommend using [hs-core-tools](https://github.com/intersystems/hs-core-tools) ```slush hs:install```)
  6. follow changelog.md instruction for post update changes
  7. Verify your application still works
  8. commit your changes (if any)
  9. push to origin ```git pull origin framework-update```
  10. create a PR to merge this to your project's master branch
* **How do I specify who is authorized to access my page (ui-router state)?**
  * Navigate to where you've defined the ui-router state for your landing page and update **roles** property.  For reference, see  **src/app/modules/login/login.module.js**
* **How do I specify a landing page for specific user role?**
  * Navigate to where you've defined the ui-router state for your landing page and add/update  **landingPageFor** property and include your user role as one of the array values. For reference, see  **src/app/modules/login/login.module.js**
* **How come when I successfully authenticated a user(Status Code 200 from REST API), nothing happens, I am still at the login page?**
  * That's because you haven't specified a landing page for the authenticated user role. You need to specifiy a landing page for your authenticated user's role. For reference, see  **src/app/modules/login/login.module.js**
