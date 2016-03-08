
#Core Changes

### 03/08/2016
#### breaking change
* adding support for edition (uk/us/french)

##### upgrade notes:
In order to upgrade the framework to this framework version, the projects needs to do these following things:

* Remove gulp/watch.js file
* In src/app/modules/app.module.js file, change "isc.common" dependency to "isc.components"
* In src/index.html file, add "```<script src="js/templates.min.js"></script>```" html tag after "```<script src="js/app.min.js"></script>```" tag

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
    
* In gulp/app.json file, separate "module/js" block into two blocks: "module/modules" and "module/js"

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

