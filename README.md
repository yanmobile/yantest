# hs-core-ui

---
## HealthShare UI Framework is intended to be used across multiple projects
*NOTE*: hs-core-ui not a standalone project -- it only contains common framework code. To become a standalone project, it needs to be complemented with application specific code. see: [Getting started](#getting-started))

---
## prerequisites:
1. Make sure you've read both [hs-core-tools](https://github.com/intersystems/hs-core-tools/blob/master/README.md) and [hs-core-ui](https://github.com/intersystems/hs-core-ui/blob/master/README.md) README.md files
2. Make sure you've installed [hs-core-tools] and its [prerequisites](https://github.com/intersystems/hs-core-tools/blob/master/README.md#requirements)

*Note* that if you are creating a modified build of your application, you should not modify these files. If you do, you risk them being overwritten on routine updates.

---
## Getting Started
*WARNING* the following instructions will fail if these [prerequisites](#prerequisites) were not satisfied.

### For framework developers
```bash
    #clone repo && switch to folder
    git clone https://github.com/intersystems/hs-core-ui.git 
    cd hs-core-ui
    
    #install dependencies (bower/npm)
    slush hs:install
```    
### For app developers
```bash
    #clone repo && setup upstream && push to destination repo && creat app specific code && install dependencies
    slush hs
    #once completed, make the necessary app specific changes then commit and push changes to origin master
    git add .
    git commit -m 'initial app code'
    git push origin master
```

---
##Run application
*note:* app specific commands requires app code

```bash
slush hs:install #installs npm and bower packages
gulp serve       #only app specific
```

Run tests:

```bash
gulp test        #only app specific. It runs test:common, test:components, and test:app
gulp test:common
gulp test:components
gulp test:app    #only app specific
```

Update framework: //make sure your workarea is clean 

```bash
slush hs:updateCore 
#create PR on GitHub
```

Override app.config.js (for specifying dev/deploy configurations):
```bash
# for specifying runtime application config
gulp serve --config <any valid directory>/<anyFileName>.js #only app specific
gulp build --config <any valid directory>/<anyFileName>.js #only app specific
gulp deploy --config <any valid directory>/<anyFileName>.js #only app specific
```

Override gulp/app.json:
```bash
# for specifying compile time application config -- to specify editions or different platform targets (mobile, web)
gulp serve --appjson path/to/app.json #only app specific
gulp build --appjson path/to/app.json #only app specific
gulp deploy --appjson path/to/app.json #only app specific
```
---
###File structure
    
    |-- gulp.js //utilizes gulp tasks inside of ./gulp folder
    |-- config.xml  //used by cordova
    |-- jsdocs
    |   |__ conf.json   //jsDocs configuration
    |-- src //source code
    |   |-- index.html
    |   |-- common  //should not contain any UI Components / CSS styles
    |   |   |-- assets
    |   |   |-- modules
    |   |   |   |__ isc.common.module.js
    |   |   |__ bower.json    
    |   |-- components
    |   |   |-- foundation
    |   |   |   |__ base //default edition
    |   |   |   |   |-- assets
    |   |   |   |   |-- modules
    |   |   |   |   |   |__ isc.components.module.js
    |   |   |   |   |-- bower.json
    |   |   |   |   |__ components.json //if this edition is picked, this file will be copied to "gulp/components.json"
    |   |-- app     //application specific
    |   |   |-- assets
    |   |   |-- modules
    |   |   |-- bower.json  
    |   |   |__ bower.json
    |-- test
    |   |-- unit
    |   |   |-- common
    |   |   |-- component
    |___|___|__ app     //application specific
   

---
###gulp configs
**This framework is designed to virtually eliminate the need to write custom automation tasks. The out-of-the-box automation tasks utilize these three configuration files: gulp/common.json, gulp/components.json, and gulp/app.json.**

**Notes:**
  * This *config structure* applies to ```gulp/app.json```, ```gulp/components.json```, and ```gulp/common.json```
  * The paths must be relative to the root of the application
  * Be sure to never reference files from another module or outside of their perspective section: *src/common*, *src/components*, and *src/app*.
  * The automation scripts will load the config sections in this orders: 
    1. gulp/common.json
    2. gulp/components.json
    3. gulp/app.json

```javascript
{
  "vendor" : {
    "js" : [
      // This is where we specify bower files
      // Exceptions: If files need to be loaded after all 3 "vendor/js", be sure to place it in the "module/assets/vendor/js" section
      // e.g., "src/common/bower_components/jquery/dist/jquery.js"
    ],
    "mocks" : [
      // This is where we specify vendor mock files
      // e.g., "src/common/bower_components/angular-mocks/angular-mocks.js"
    ],
    "fonts" : [
      // This is where we specify vendor font files
      // e.g., "src/components/foundation/base/bower_components/font-awesome/fonts/fontawesome-webfont.*"
    ]
  },
  "module" : {
    "modules": [
      // This is where we specify our own module files
      // Since the order of JS files matter, Angular modules must be loaded before they are referenced, this allows module definitions to be loaded before they are used      
      // e.g., "src/components/foundation/base/modules/**/*.module.js"
    ],
    "js" : [
      // This is where we specify our own js files
      // They will be loaded after after the "module/modules" files
      // e.g., "src/components/foundation/base/modules/**/*.js"
    ],
    "html" : [
      // This is where we specify html files
      // e.g., "src/components/foundation/base/modules/**/*.html",
      // e.g., "src/components/foundation/base/assets/**/*.html"
    ],
    "assets" : {
      "images" : [
        // This is where we specify image files. 
        // They'll compressed and moved into "www/images/"
        // e.g., "src/components/foundation/base/assets/images/**/*",
        // e.g., "src/components/foundation/base/assets/vendors/leaflet/images/**/*"
      ],
      "vendor" : {
        "js" : [
          // This is where we specify vendor files we've added to our source code
          // These files will be loaded after "vendor/js"
          // Exception: If files need to be loaded before all 3 "module/assets/vendor/js", be sure to place it in the "vendor/js" section
          // e.g., "src/components/foundation/base/assets/vendors/n3-charts/build/LineChart.js",
          // e.g., "src/components/foundation/base/assets/vendors/leaflet/leaflet.js"
        ]
      }
    },
    "mocks" : [
      // This is where we specify our own mock files
      // e.g., "test/unit/components/componentUnitTestMocks.js"
    ],
    "tests" : [
      // This is where we specify the test files
      // e.g., "test/unit/components/**/*.test.js"
    ]
  },
  "edition"       : [
    {
      "name" : "base",
      "path" : "src/components/foundation/base/components.json"
    },
    // to specify another edition, add it to this edition array. For example the UK edition below.
    // the framework will take the array of edition configurations and merge them to produce a single master components configuration
    {
      "name" : "UK",
      "path" : "src/components/foundation/UK/components.json"
    }
  ],
  "comments"      : "JavaScript files can't be overridden like css selector cascading or Angular's templateCache templates.",
  "comments"      : "If we want to override lower level JS files, we must exclude them from the list.",
  "comments"      : "The overrides below are used to exclude base files by specifying glob patterns.",
  "comments"      : "e.g. ```common: ['!src/modules/isc.filters/myFilter.js']```",
  "overrides"     : {
    "js" : {
      "common"     : [],
      "components" : []
    },
  "comments"      : "Used to exclude files in common/component. e.g. ```common: ['!src/modules/isc.filters/myFilter.html']```",
    "html" : {
      "common"     : [],
      "components" : []
    }
  }
}
```
        
---
###FAQs
* **I am getting this error message ```slush: command not found```**
  * Make sure your environment satisfies all of the [prerequisites](#prerequisites) and [hs-core-tools] is installed
  
* **This framework looks awesome, how do I create a fully functional application using this framework in a couple of minutes?**
  * We highly recommend leveraging our [hs-core-tools] to facilitate the creation of your new application.
   
* **What are the differences between "src/app", "src/common" and "src/components"**
  * "src/common" is framework code and should only be updated directly by framework developers. It defines system wide behaviors such as session management, state authorization, page configuration, and etc.
  * "src/components" is a framework code and should only be updated directly by framework and edition developers. It defines different UI-Components (bootstrap, foundation for apps, angular material) and the different editions (US, UK, Chinese) utilizing for the selected UI-Component. 
  * "src/app" is application code should only be updated by application developers.  It contains application specific logic and pages.
  
* **I want to include a new bower package to my application, where should I install it?**
  * Application specific bower packages should be installed under "src/app/" folder (don't install it in "src/common" and "src/components")
   
* **Now that I have bower package successfully installed in "src/app/" folder, how do I add it to the application?**
  * We use Gulp to automate build tasks. Application specific gulp configuration can be found at "gulp/app.json". You'll need to specify the file path of your bower package in "vendor.js" json property which is line 3 of "gulp/app.json" file.
  
* **How do I add a new javascript package which is not available through bower?**
  * You'll need to paste your non-bower library js files in "src/app/assets/vendors/" folder. If this folder doesn't exist, create one.
  * You'll have to reference your js file in "gulp/app.json" configuration file under this key path: "module.assets.vendor.js" array.
  
* **How do I include a 3rd party css file in my application?**
  * The framework does not support *.css file extensions, you'll need to rename your *.css extension to *.scss (superset of css) and place your *.scss file in "src/app/assets/sass/" folder. Once your file is in the sass folder, add a reference to  "src/app/assets/sass/main.scss" file.
  
* **How do I include a module specific scss file?**
  * This is a built-in functionality. Any scss file added to your module, matching this glob pattern ```src/app/modules/**/*.scss```, will automatically be compiled, concatenated, and shipped as part of your ```app.min.css```.
  
* **How do I control what gets outputted in the console?**
  * Open up your "src/app/modules/app.config.js" file and add/remove channels in 'devlogWhitelist' and 'devlogBlacklist' arrays. Note: "\*" means all channels.
  
* **How do I change the REST API's hostname and Port number?**
  1. You can change the hostname and PORT number inside of app config file located "src/app/modules/app.config.js" 
  2. You can use an alternate config file with ```gulp serve --config <any valid directory>/<anyFileName>.js```
  
* **How do I promote an application feature to the framework?** (Be sure your changes are in common/components folder)
  * **Scenario 1**: The code I want to promote to framework are all in their own commits
    * Create a new branch off upstream master ```git checkout -b <branch> upstream/master```
    * Cherry-pick the feature commits. For each of your commits in reverse chronological order (oldest first) 
        * ```git cherry-pick <commit-hash>```
            * if you have conflicts, resolve them first then continue ```git cherry-pick --continue```  
        * Once you have all the source code, commit the changes (if needed). 
    * Push the changes to upstream (not origin)  ```git push upstream <branch> ```
    * Create a Pull Request
  * **Scenario 2**: The code I want to promote to framework are committed but contains non-feature code
    * Create a new branch off upstream master ```git checkout -b <branch> upstream/master```
    * Cherry-pick the feature commits. For each of your commits in reverse chronological order (oldest first) 
        * ```git cherry-pick --no-ff --no-commit <commit-hash>```
            * if you have conflicts, resolve them first then continue ```git cherry-pick --continue```  
        * Remove all changes that's not part of your feature
        * Once you have all the source code, commit the changes
    * Push the changes to upstream (not origin)  ```git push upstream <branch>``
    * Create a Pull Request`
  * **Scenario 3**: The code I want to promote to framework have not been committed
    * Stash your changes ```git stash save "<message>"```
    * Create a new branch off upstream master ```git checkout -b <branch> upstream/master```
    * Apply your stashed changes ```git stash apply```
    * Resolve conflicts (if any)
    * Once you have all the source code, commit the changes
    * Push the changes to upstream (not origin)  ```git push upstream <branch> ```
    * Create a Pull Request
  * **Scenario 4**: The code I want to promote to framework are committed, and I can't easily isolate the commits. But the good news is, the code is all in my <localBranch>
    * Create a new branch off upstream master ```git checkout -b <branch> upstream/master```
    * Merge your <localBranch> into your <branch> without fast-forward and commit, which allows you to pick the changes you want ```git merge --no-ff --no-commit <localBranch>```
    * Remove the files/changes you don't want to promote to the framework
    * Once you have all the source code, commit the changes
    * Push the changes to upstream (not origin)  ```git push upstream <branch> ```
    * Create a Pull Request
    
* **I have an existing application and my framework is out of date. How can I upgrade my application's framework (cool slush way)?**
  1. Update your ```hs-core-tools``` by executing ```slush hs:update```
  1. execute ```slush hs:updateCore```
  1. create a PR to merge this to your project's master branch
  1. Follow [changelog.md] instruction for post update changes
  
* **I have an existing application and my framework is out of date. How can I upgrade my application's framework (the old fashion way)?**
  1. Ensure you have a local git remote ```upstream``` is pointing to "https://github.com/intersystems/hs-core-ui.git"
    1. execute ```git remote -v``` to check existing git remote repo mappings
    1. if "upstream" doesn't exist, add it by executing ```git remote add upstream https://github.com/intersystems/hs-core-ui.git```
  1. Ensure you have a local git remote ```appstream``` is pointing to "https://github.com/intersystems/hs-core-app-scaffold.git"
    1. execute ```git remote -v``` to check existing git remote repo mappings
    1. if "appstream" doesn't exist, add it by executing ```git remote add appstream https://github.com/intersystems/hs-core-app-scaffold.git```
  2. create a new branch off remote master ```git checkout -b framework-update origin/master```
  3. pull the framework into your branch ```git pull upstream master```
  4. resolve conflicts (if any) and commit
  5. update your node and bower packages (we recommend using [hs-core-tools] ```slush hs:install```)
  6. Follow [changelog.md] instruction for post update changes
  7. Verify your application still works
  8. commit your changes (if any)
  9. push to origin ```git push origin framework-update```
  10. create a PR to merge this to your project's master branch
  
* **How do I specify who is authorized to access my page (ui-router state)?**
  * Navigate to where you've defined the ui-router state for your landing page and update **roles** property.  For reference, see  **src/app/modules/login/login.module.js**
  
* **How do I specify a landing page for specific user role?**
  * Navigate to where you've defined the ui-router state for your landing page and add/update  **landingPageFor** property and include your user role as one of the array values. For reference, see  **src/app/modules/login/login.module.js**
  
* **How come when I successfully authenticated a user(Status Code 200 from REST API), nothing happens, I am still at the login page?**
  * That's because you haven't specified a landing page for the authenticated user role. You need to specifiy a landing page for your authenticated user's role. For reference, see  **src/app/modules/login/login.module.js**
  
* **I created a Pull-Request, but it won't let me merge it due to conflicts. How do I resolve this?**
  * merge the latest of origin master to your local branch  ```git pull origin master```
  * resolve conflicts
  * stage and commit your resolved changes  ```git commit -am '<your message>'```
  * Assume your branch is called "my-feature-branch". Push your changes to your tracked server branch  ```git push origin <my-feature-branch> ```
  
* **How do I specify a different edition (US/UK)?**
  * *note:* By default the code uses "base" edition, which is the US edition. Specific Edition config file will be merged with base edition. (using _.mergeWith() where it concatenates arrays)
  * Add a new edition config object in the "edition" array of ```gulp/app.json``` configuration

```javascript
  "edition"       : [
     {
       "name" : "base",
       "path" : "src/components/foundation/base/components.json"
     },
     {
       "name" : "US",
       "path" : "src/components/foundation/US/edition.json"
     }
   ]
```   

* **How do I add/exclude specific js in common or components?**
  * add glob patterns to ```gulp/app.json -> overrides/js/[common/component]``` configuration
 
* **How do I exclude specific html in common or components?**
  * add glob patterns to ```gulp/app.json -> overrides/html/[common/component]``` configuration

* **How do I exclude specific scss in common or components? (coming soon)**
  * add glob patterns to ```gulp/app.json -> overrides/scss/[common/component]``` configuration

---
###Git 101
```bash
# To switch between existing local branches
git checkout <branch>

# Check which branch you are currently on (current branch)
git branch

# Check existing local branches
git branch

# Create a new branch based off your current branch and switch to your new branch
git branch -b <branch>

# Create a new branch based off a origin *branchand switch to your new branch
git checkout -b <branch> origin/<branch>

# delete a local branch
git branch -d <branch>

# Check existing remote repos
git remote -v

# Add upstream repo
git remote add upstream <core repo uri>

# Check status of git (what's staged and unstaged)
git status

# Add all files to staged area
git add <file path>

# Add updated files to staged area
git add -u

# Commit the staged changes with message
git commit -m '<message>'

# Push commits to origin branch
git push origin <branch>

# Fetch all server branches
git fetch

# Update your branch to the latest
git pull origin <branch>

# Cherry-pick a commit from another branch into your current branch
git cherry-pick <commit hash>

# log commits on oneline
git log --oneline

# remote locally branches which no longer exists on server
git remote update --prune

# create git aliases for logging last commit (usage: git last)
git config --global alias.last 'log -1 --oneline HEAD'
```

---
###Bash 101 (OS X only)
```bash
# go to home (same as cd ~)
cd 

# go to last directory (good fo toggling between two directories)
cd -

# last command's arguments
!*

# last command's last arguments
!^

# last command's first command
!$

# last command
!!

# search last commands
CTRL+R

# last command start with cat
!cat

# last command containing cat
!?cat

# replace cat with meow in last command
^cat^meow

# list directory with human readable size in long format
ls -lh

# mkdir create parent directories as needed
mkdir -p parent/child/myfolder

# create new file if doesn't exist or update access time if already exists
touch <file name>

#copy entire directory and its content
cp -a src/ dest/

# delete a folder and its content
rm -rf <folder>

# find files in /home directory which matches '.bash*' pattern
find /home -name '.bash*'

# first few lines
head <file>

# last few lines
tail <file>

# last few lines and watch for updates
tail -f <file>

# output the content of a file
less <filename>

```
[hs-core-tools]: https://github.com/intersystems/hs-core-tools
[changelog.md]: https://github.com/intersystems/hs-core-ui/blob/master/changelog.md
