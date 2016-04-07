
# Core Changes
### 04/07/2016
#### upgrade notes:
Making the routing more clear we have changed the state names "index" to "authenticated" and the name "anonymous" to "unauthenticated"
This is a breaking change, in order to apply the change developers have to go through a series of steps:
1. If you have uncommitted changes, please stash the files so you can apply the changes in one of the next steps.
2. Update the framework with `slush hs:updateCore`.
3. Rename the files "app/modules/layout/anonymous.html"  to "app/modules/layout/unauthenticated.html".
4. In order to update files that are application related, the easiest approach is to run `slush hs:appModule`. This command will create a new branch with the latest code. You can apply the stash (from 1. above) and address all the conflicts.
5. Search your project for state which matching the following pattern: "anonymous.\*" and change it to "unauthenticated.\*"
6. Search your project for state which matching the following pattern: "index.\*" and change it to "authenticated.\*". See [this PR](https://github.com/intersystems/hs-core-tools/pull/54/files).

### 04/06/2016
#### upgrade notes:
If your application uses `iscSessionModel.configure` to manage session across tabs, you should remove
``` javascript
'remainingTimePath': 'sessionInfo.remainingTime'
```
and add
``` javascript
'expirationPath'   : 'sessionInfo.expiresOn'
```
to the `configure` call. See [this PR](https://github.com/intersystems/hs-core-tools/pull/55) for more information.

### 04/05/2016
#### upgrade notes:
If your application needs to send cookies with each request, add ```$httpProvider.defaults.withCredentials = true;``` to your app.module.js file. See [this PR](https://github.com/intersystems/hs-core-tools/pull/52/files)

### 04/05/2016
#### upgrade notes:
Application developers will need to update the `config` phase of `app.module.js` to ensure that `componentConfig` is included in the DI, and that it is merged into `appConfig` correctly. The `config` phase should include this line:
``` javascript
_.defaults(appConfig, componentsConfig, coreConfig);
```
See [here](https://github.com/intersystems/hs-core-tools/pull/50/files) for details. 

### 04/04/2016
#### upgrade notes:
In order to get the default footer to show the current version number, update your `app/modules/app.module.js` to include the changes described [here](https://github.com/intersystems/hs-core-tools/pull/48/files)

### 03/31/2016
#### upgrade notes:
The `app/modules/shared/apis/apiHelper.js` file should be updated to match [the updated source file](https://github.com/intersystems/hs-core-tools/pull/43/files).

### 03/30/2016
#### upgrade notes:
iscNavContainer.html in app folder is no longer in use and it should be removed.
see: https://github.com/intersystems/hs-core-tools/pull/39/files


### 03/24/2016
#### upgrade notes:
Application developers will need to place a "routes.module.js" file within their "modules" folder. This should contain a "routes" angular module declaration injecting all app specific modules created up until this point, including "home", "layout", and "login". The developer must then remove the app specific injections from app.module.js.

### 03/22/2016
#### upgrade notes:
Application developers will need to update their internationalization file to support the latest core tools and core UI changes. Everything above the CUSTOM section in src/app/assets/i18n/locale-en_US.json should consist of the contents of [this file](https://github.com/intersystems/hs-core-tools/blob/master/templates/appModule/src/app/assets/i18n/locale-en_US.json).

### 03/17/2016 & 03/18/2016
#### upgrade notes:
In order to fix the unit tests broken by 03/08/2016 edition refactoring, application developers will need update these files:
Replicate the changes described in following commits:
1. https://github.com/intersystems/hs-core-tools/pull/24/files
2. https://github.com/intersystems/hs-core-tools/pull/25/files


### 03/08/2016
#### breaking change
* adding support for edition (uk/us/french)

##### upgrade notes:
In order to upgrade the framework to this framework version, each project needs to do these following things:

1. Remove gulp/watch.js file
2. In src/app/modules/app.module.js file, change "isc.common" dependency to "isc.components"
3. In src/app/modules/app.module.js file, add "isc.templates" as a dependency. 
4. In src/index.html file, add "```<script src="js/templates.min.js"></script>```" html tag after "```<script src="js/app.min.js"></script>```" tag

```   
    //from
    <!-- inject:js -->
    <script src="js/app.min.js"></script>
    <!-- end inject -->
    
    //to    
    <!-- inject:js -->
    <script src="js/app.min.js"></script>
    <!-- end inject -->
    <script src="js/templates.min.js"></script>
```
    
5. In gulp/app.json file, separate "module/js" block into two blocks: "module/modules" and "module/js"

```
    // from
    "js" : [    
      "src/app/modules/**/app.module.js",
      "src/app/modules/**/*.module.js",
      "src/app/modules/**/*.js"
    ],    


    // TO
    "modules": [
      "src/app/modules/**/app.module.js",
      "src/app/modules/**/*.module.js"
    ],
    "js" : [
      "src/app/modules/**/*.js"
    ],
```

### 02/15/2016
-- added support for blacklist

### 02/14/2016
**NOTE:** If you have copied iscNavContainer.html, you'll need to update the reference to match. 

* Renaming "iscNavbarDesktop.html" to "iscNavbar.html"

