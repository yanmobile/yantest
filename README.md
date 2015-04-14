hs-ui-angular-core
==================

HealthShare UI infrastructure that is intended for use across projects

Note that if you are creating a modified build of your application, you should not modify these files. If you do, you risk them being overwritten on routine updates.


To use:

    clone the github repository in a sibling directory
    The folder structure should be similar to this:
        Code
            --hs-ui-core
            --project-1
            --project-2
            --other projects as sibling directories...
            
    -From within hs-ui-core, copy the gulp/add-common.js folder into your project, and then, from a terminal window, run
        gulp add-common
        