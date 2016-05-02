
# Core Changes
### 05/02/2016
Our application framework has been updated to automatically update app code when executing ```slush hs:updateCore```. Each application will add an additional git remote repo, appstream. When executing ```slush hs:updateCore```, *appstream* remote repo will automatically be added to your project.

### 04/29/2016
[hs-core-tools PR 49](https://github.com/intersystems/hs-core-tools/pull/49)
adding support to allow app.config override during a run of any gulp task. In order to achieve the expected behavior, a new entry
has to be added in the file:
gulp/app.json
"excludeConfig" : "!src/app/modules/app.config.js"
This change was made on 4/5/2016

### 04/26/2016
[hs-core-ui PR 213](https://github.com/intersystems/hs-core-ui/pull/213) adds support for compile time edition selection support; apps can now specify which edition to build for at compile time. The app specific changes can be found in [hs-core-tools PR 74](https://github.com/intersystems/hs-core-tools/pull/76/files?w=1).   
[hs-core-ui PR 210](https://github.com/intersystems/hs-core-ui/pull/210) adds theming functionially. Make sure to update both core-ui and core-tools together in this update or your app will break. Please refer to core-tools PR 75 for app specific changes: [hs-core-tools PR 75](https://github.com/intersystems/hs-core-tools/pull/75). 

### 04/21/2016
[hs-core-ui PR 209](https://github.com/intersystems/hs-core-ui/pull/209) adds support for module specific scss files. In order for individual apps to take advantage of this feature, they need to be updated. The app specific changes can be found in [hs-core-tools PR 74](https://github.com/intersystems/hs-core-tools/pull/74).
 
### 04/19/2016
[hs-core-ui PR 198](https://github.com/intersystems/hs-core-ui/pull/198) removed ```$$``` from navbar's ```$$active``` property. This is a breaking change, and every app that is based of hs-core-ui need to be updated to be compatible; please make the same changes as [hs-core-tools PR 66](https://github.com/intersystems/hs-core-tools/pull/66).  

### 04/14/2016
[This PR](https://github.com/intersystems/hs-core-ui/pull/189)
Updated the wallaby config for the application to support javascript libraries that need to be included during testing with "Wallaby".
1. "wallaby.config.app.js":
  change from
  ```javascript
  var commonVendorJs      = (commonConfig.vendor.js || []).map(noInstrument);
  ...
  ...
  var componentsVendorJs      = (componentsConfig.vendor.js || []).map(noInstrument);
  ...
  ...
  var appVendorJs      = (appConfig.vendor.js || []).map(noInstrument);
  ```
  to
  ```
  var commonVendorJs      = (commonConfig.vendor.js || []).map(noInstrument);
  var commonModuleVendorJs = (commonConfig.module.assets.vendor.js || []).map(noInstrument);
  ...
  ...
  var componentsVendorJs      = (componentsConfig.vendor.js || []).map(noInstrument);
  var componentsModuleVendorJs = (componentsConfig.module.assets.vendor.js || []).map(noInstrument);
  ...
  ...
  var appVendorJs      = (appConfig.vendor.js || []).map(noInstrument);
  var appModuleVendorJs = (appConfig.module.assets.vendor.js || []).map(noInstrument);
  ```

  and add referece, by changing from
  ```javascript
        .concat(commonVendorJs)
        .concat(componentsVendorJs)
        .concat(appVendorJs)
  ```
  to
  ```
        .concat(commonVendorJs)
        .concat(componentsVendorJs)
        .concat(appVendorJs)
        .concat(commonModuleVendorJs)
        .concat(componentsModuleVendorJs)
        .concat(appModuleVendorJs)
  ```

### 04/14/2016
[This PR](https://github.com/intersystems/hs-core-ui/pull/187) renames ddpTable to fauxTable. As an application developer and your application uses ddpTable, you'll need to do the following:
 1. Search and replace ```ddp-table``` with ```faux-table```
 1. Search and replace ```isc.ddpTable``` with ```isc.fauxTable```

### 04/14/2016
[This PR](https://github.com/intersystems/hs-core-tools/pull/59) removes the "locale-" prefix from the i18n files. Please apply [these changes](https://github.com/intersystems/hs-core-tools/pull/59) to your app.
Please be sure to remove "locale-" from "locale-en_US.json" file.

### 04/13/2016
[This PR](https://github.com/intersystems/hs-core-tools/pull/57) adds support for second level navigation. It also added ngAnnotate inject comments. Please apply [the changes](https://github.com/intersystems/hs-core-tools/pull/57) described here to your own projects.

### 04/11/2016
#### upgrade notes:
[This PR](https://github.com/intersystems/hs-core-ui/pull/180) updates the gulp tasks to minify files when deployed and separated the scripts into 4 files when used in development. Individual applications needs to be updated in order to work with this latest framework changes. The changes can be found [here](https://github.com/intersystems/hs-core-tools/pull/56). You can choose to apply the specific changes the existing files or take the updated files.  


### 04/07/2016
#### upgrade notes:
Making the routing more clear we have changed the state names "index" to "authenticated" and the name "anonymous" to "unauthenticated"
This is a breaking change, in order to apply the change developers have to go through a series of steps:
1. If you have uncommitted changes, please stash the files so you can apply the changes in one of the next steps.
2. Update the framework with `slush hs:updateCore`.
3. Rename the files "app/modules/layout/anonymous.html"  to "app/modules/layout/unauthenticated.html".
4. In order to update files that are application related, the easiest approach is to run `slush hs:appModule`. This command will create a new branch with the latest code. You can apply the stash (from 1. above) and address all the conflicts.
5. Search your project for states which match the following pattern: "anonymous.\*" and change them to "unauthenticated.\*"
6. Search your project for states which match the following pattern: "index.\*" and change them to "authenticated.\*". See [this PR](https://github.com/intersystems/hs-core-tools/pull/54/files).

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
