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

           
Run application ([slush style](https://github.com/intersystems/hs-core-tools)):

```bash
slush hs:install #installs npm and bower packages
gulp serve
```

Run tests:

```bash
gulp test        #only available as part of app specific task
gulp test:common
gulp test:components
gulp test:app    #application specific
```

Update framework: //make sure your workarea is clean 

```bash
slush hs:updateCore 
#create PR on GitHub
```

Override app.config.js:
```bash
gulp serve --config <any valid directory>/app.config.js
#please note that the file name has to be app.config.js since the tool is design
#to override any file and need to correct basename to find the original file and
#override it.
```

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
  *  
* **How do I promote an application feature to the framework?** (Be sure your changes are in common/components folder)
  * **Scenario 1**: The code I want to promote to framework are all in their own commits
    * Create a new branch off upstream master ```git checkout -b <branch> upstream/master```
    * Cherry-pick the feature commits. For each of your commits in reverse chronological order (oldest first) 
        * ```git cherry-pick <commit-hash>```
            * if you have conflicts, resolve them first then continue ```git cherry-pick --continue```  
        * Once you have all the source code, commit the changes (if needed). 
    * Push the changes to upstream (not origin)  ```git push upstream <branch> ```
    * Create a Pull Request
  * **Scenario 2**: The code I want to promote to framework are commited but contains non-feature code
    * Create a new branch off upstream master ```git checkout -b <branch> upstream/master```
    * Cherry-pick the feature commits. For each of your commits in reverse chronological order (oldest first) 
        * ```git cherry-pick --no-ff --no-commit <commit-hash>```
            * if you have conflicts, resolve them first then continue ```git cherry-pick --continue```  
        * Remove all changes that's not part of your feature
        * Once you have all the source code, commit the changes
    * Push the changes to upstream (not origin)  ```git push upstream <branch>``
    * Create a Pull Request`
  * **Scenario 3**: The code I want to promote to framework have not been commited
    * Stash your changes ```git stash save "<message>"```
    * Create a new branch off upstream master ```git checkout -b <branch> upstream/master```
    * Apply your stashed changes ```git stash apply```
    * Resolve conflicts (if any)
    * Once you have all the source code, commit the changes
    * Push the changes to upstream (not origin)  ```git push upstream <branch> ```
    * Create a Pull Request
  * **Scenario 4**: The code I want to promote to framework are commited, and I can't easily isolate the commits. But the good news is, the code is all in my <localBranch>
    * Create a new branch off upstream master ```git checkout -b <branch> upstream/master```
    * Merge your <localBranch> into your <branch> without fast-forward and commit, which allows you to pick the changes you want ```git merge --no-ff --no-commit <localBranch>```
    * Remove the files/changes you don't want to promote to the framework
    * Once you have all the source code, commit the changes
    * Push the changes to upstream (not origin)  ```git push upstream <branch> ```
    * Create a Pull Request
* **I have an existing application and my framework is out of date. How can I upgrade my application's framework (cool slush way)?**
  1. Ensure you have a local git remote upstream is pointing to "https://github.com/intersystems/hs-core-ui.git"
    1. execute ```git remote -v``` to check existing git remote repo mappings
    2. if "upstream" doesn't exist, add it by executing ```git remote add upstream https://github.com/intersystems/hs-core-ui.git```
  2. execute slush hs:updateCore
  3. create a PR to merge this to your project's master branch
* **I have an existing application and my framework is out of date. How can I upgrade my application's framework (the old fashion way)?**
  1. Ensure you have a local git remote upstream is pointing to "https://github.com/intersystems/hs-core-ui.git"
    1. execute ```git remote -v``` to check existing git remote repo mappings
    2. if "upstream" doesn't exist, add it by executing ```git remote add upstream https://github.com/intersystems/hs-core-ui.git```
  2. create a new branch off remote master ```git checkout -b framework-update origin/master```
  3. pull the framework into your branch ```git pull upstream master```
  4. resolve conflicts (if any) and commit
  5. update your node and bower packages (we recommend using [hs-core-tools](https://github.com/intersystems/hs-core-tools) ```slush hs:install```)
  6. follow [changelog.md](https://github.com/intersystems/hs-core-ui/blob/master/changelog.md) instruction for post update changes
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
  * merge the lates of origin master to your local branch  ```git pull origin master ```
  * resolve conflicts
  * stage and commit your resolved changes  ```git commit -am '<your message>'```
  * Assume your branch is called "my-feature-branch". Push your changes to your tracked server branch  ```git push origin <my-feature-branch> ```

##Git 101

* To switch between existing local branches
  * ```git checkout <branch>```
* Check which branch you are currently on (current branch)
  * ```git branch```
* Check existing local branches
  * ```git branch```
* Create a new branch based off your current branch and switch to your new branch
  * ```git branch -b <branch>```
* Create a new branch based off a origin *branch* and switch to your new branch
  * ```git checkout -b <branch> origin/<branch>```
* delete a local branch
  * ```git branch -d <branch>```
* Check existing remote repos
  * ```git remote -v```
* Add upstream repo
  * ```git remote add upstream <core repo uri>```
* Check status of git (what's staged and unstaged)
  * ```git status```
* Add all files to staged area
  * ```git add <file path>```
* Add updated files to staged area
  * ```git add -u```
* Commit the staged changes with message
  * ```git commit -m '<message>'```
* Push commits to origin branch
  * ```git push origin <branch>```
* Fetch all server branches
  * ```git fetch```
* Update your branch to the latest
  * ```git pull origin <branch>```
* Cherry-pick a commit from another branch into your current branch
  * ```git cherry-pick <commit hash>```
* log commits on oneline
  * ```git log --oneline```
* remote locally branches which no longer exists on server
  * ```git remote update --prune```
* create git aliases for logging last commit (usage: git last)
  * ```git config --global alias.last 'log -1 --oneline HEAD'```

## Bash 101 (OS X only)
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

