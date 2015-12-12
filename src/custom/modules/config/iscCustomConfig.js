/**
 * Created by hzou on 12/11/15.
 */

(function () {

  'use strict';

  var iscCustomConfig = {
    "devlogWhitelist"                   : ["*"],
    "baseUrl"                           : "hello",
    "api"                               : {
      "simpleAPI": {
        "prefix"  : "/csp/healthshare/cmc/cc/api/v1",
        "comments": "if 'prefix' is present, it overrides 'real', 'mock'. This is the relative url used when server and client are on the same domain."
      },
      "mock"     : {
        "protocol" : "http",
        "hostname" : "localhost",
        "port"     : 3000,
        "namespace": "cmc"
      },
      "real"     : {
        "protocol" : "http",
        "hostname" : "localhost",
        "port"     : 57772,
        "namespace": "mycc"
      },
      "mode"     : "mock",
      "comments" : "options are 'real', 'mock', 'hybrid'. 'mock' and 'hybrid' are used for development"
    },
    "noLoginRequired"                   : [
      "index",
      "index.login",
      "index.checkSession"
    ],
    "formats"                           : {
      "date": {
        "shortDate"   : "dd MMM yyyy",
        "shortTime"   : "h:mm A",
        "longDate"    : "d MMMM yyyy",
        "longDateTime": "d MMMM yyyy H:mm",
        "database"    : "YYYY-MM-DD HH:mm:ss"
      }
    },
    "userRoles"                         : [
      "%HSCC_CMC_CarePlanApprover",
      "%HSCC_CMC_CarePlanCreator",
      "%HSCC_CMC_CarePlanViewer",
      "%HSCC_CMC_Administrator"
    ],
    "userPermittedTabs"                 : {
      "%HSCC_CMC_CarePlanApprover": [
        "index",
        "index.help",
        "index.restricted",
        "index.home.*",
        "index.findPatient.*",
        "index.managePatient.*",
        "index.viewPatient.*",
        "index.editCarePlan.*",
        "index.viewCarePlan.*"

      ],
      "%HSCC_CMC_CarePlanCreator" : [
        "index",
        "index.help",
        "index.restricted",
        "index.home.*",
        "index.findPatient.*",
        "index.managePatient.*",
        "index.viewPatient.*",
        "index.editCarePlan.*",
        "index.viewCarePlan.*"
      ],
      "%HSCC_CMC_CarePlanViewer"  : [
        "index",
        "index.help",
        "index.restricted",
        "index.findPatient.*",
        "index.viewCarePlan.*"
      ],
      "%HSCC_CMC_Administrator"   : ["*"]
    },
    "loginButton"                       : {
      "state"         : "index.login",
      "translationKey": "ISC_LOGIN_BTN",
      "displayOrder"  : 8,
      "exclude"       : false
    },
    "topTabs"                           : {
      "index.home"   : {
        "state"         : "index.home",
        "translationKey": "CMC_HOME",
        "displayOrder"  : 1,
        "exclude"       : false
      },
      "index.help"   : {
        "state"         : "index.help",
        "stateParams"   : {
          "helpState": "$currentState"
        },
        "target"        : "Help",
        "translationKey": "CMC_HELP",
        "displayOrder"  : 2,
        "exclude"       : false
      },
      "index.contact": {
        "state"         : "index.contact",
        "translationKey": "CMC_CONTACT",
        "displayOrder"  : 3,
        "exclude"       : false
      }
    },
    "topNav"                            : {
      "index.logout"   : {
        "translationKey": "ISC_LOGOUT",
        "function"      : "LogOut",
        "displayOrder"  : 1
      },
      "index.myAccount": {
        "externalLink"  : "My Account",
        "target"        : "myAccount",
        "translationKey": "CMC_MY_ACCOUNT",
        "function"      : "MyAccount",
        "displayOrder"  : 2
      }
    },
    "topTabs_%HSCC_CMC_CarePlanApprover": {
      "index.home"   : {
        "state"         : "index.home",
        "translationKey": "CMC_HOME",
        "displayOrder"  : 1,
        "exclude"       : false
      },
      "index.help"   : {
        "state"         : "index.help",
        "stateParams"   : {
          "helpState": "$currentState"
        },
        "target"        : "Help",
        "translationKey": "CMC_HELP",
        "displayOrder"  : 2,
        "exclude"       : false
      },
      "index.contact": {
        "state"         : "index.contact",
        "translationKey": "CMC_CONTACT",
        "displayOrder"  : 3,
        "exclude"       : false
      }
    },
    "topTabs_%HSCC_CMC_CarePlanCreator" : {
      "index.home"   : {
        "state"         : "index.home",
        "translationKey": "CMC_HOME",
        "displayOrder"  : 1,
        "exclude"       : false
      },
      "index.help"   : {
        "state"         : "index.help",
        "stateParams"   : {
          "helpState": "$currentState"
        },
        "target"        : "Help",
        "translationKey": "CMC_HELP",
        "displayOrder"  : 2,
        "exclude"       : false
      },
      "index.contact": {
        "state"         : "index.contact",
        "translationKey": "CMC_CONTACT",
        "displayOrder"  : 3,
        "exclude"       : false
      }
    },
    "topTabs_%HSCC_CMC_CarePlanViewer"  : {
      "index.home"   : {
        "state"         : "index.findPatient",
        "translationKey": "CMC_FIND_PATIENT",
        "displayOrder"  : 1,
        "exclude"       : false
      },
      "index.help"   : {
        "state"         : "index.help",
        "stateParams"   : {
          "helpState": "$currentState"
        },
        "target"        : "Help",
        "translationKey": "CMC_HELP",
        "displayOrder"  : 2,
        "exclude"       : false
      },
      "index.contact": {
        "state"         : "index.contact",
        "translationKey": "CMC_CONTACT",
        "displayOrder"  : 3,
        "exclude"       : false
      }
    },
    "topTabs_%HSCC_CMC_Administrator"   : {
      "index.home"   : {
        "state"         : "index.admin",
        "translationKey": "CMC_CMC_STAFF",
        "displayOrder"  : 1,
        "exclude"       : false
      },
      "index.help"   : {
        "state"         : "index.help",
        "stateParams"   : {
          "helpState": "$currentState"
        },
        "target"        : "Help",
        "translationKey": "CMC_HELP",
        "displayOrder"  : 2,
        "exclude"       : false
      },
      "index.contact": {
        "state"         : "index.contact",
        "translationKey": "CMC_CONTACT",
        "displayOrder"  : 3,
        "exclude"       : false
      }
    },
    "admin"                             : {
      "secondaryNav": {
        "index.admin.userManagement"    : {
          "state"         : "index.home",
          "externalLink"  : "User Management",
          "target"        : "UserManagement",
          "translationKey": "Admin_UserManagement_Nav_Button",
          "displayOrder"  : 1,
          "icon"          : "svg/external-link.html"
        },
        "index.admin.providerManagement": {
          "state"         : "index.home",
          "externalLink"  : "Provider Management",
          "target"        : "ProviderManagement",
          "translationKey": "Admin_ProviderManagement_Nav_Button",
          "displayOrder"  : 2,
          "icon"          : "svg/external-link.html"
        },
        "index.admin.patientManagement" : {
          "state"         : "index.home",
          "externalLink"  : "Patient Index Management",
          "target"        : "PatientManagement",
          "translationKey": "Admin_PatientManagement_Nav_Button",
          "displayOrder"  : 3,
          "icon"          : "svg/external-link.html"
        },
        "index.admin.manageTask"        : {
          "state"         : "index.admin.manageTask",
          "translationKey": "Admin_TaskManagement_Nav_Button",
          "displayOrder"  : 4,
          "icon"          : "svg/task-list.html"
        },
        "index.admin.manageCarePlan"    : {
          "state"         : "index.admin.manageCarePlan",
          "translationKey": "Admin_CarePlanManagement_Nav_Button",
          "displayOrder"  : 5,
          "icon"          : "svg/care-plan-management.html"
        },
        "index.admin.auditCarePlans"    : {
          "state"         : "index.auditPatient",
          "translationKey": "Admin_AuditCarePlans_Nav_Button",
          "displayOrder"  : 6,
          "icon"          : "svg/audit.html"
        },
        "index.admin.editCarePlans"     : {
          "state"         : "index.viewPatient",
          "translationKey": "Admin_EditCarePlans_Nav_Button",
          "displayOrder"  : 7,
          "icon"          : "svg/edit-care-plans.html"
        }
      }
    },
    "home"                              : {
      "secondaryNav": {
        "index.home.createCarePlan" : {
          "state"         : "index.managePatient",
          "translationKey": "CMC_CREATE_CARE_PLAN",
          "displayOrder"  : 1,
          "icon"          : "svg/plus.html",
          "exclude"       : false
        },
        "index.home.viewCarePlan"   : {
          "state"         : "index.viewPatient",
          "translationKey": "CMC_VIEW_CARE_PLAN",
          "displayOrder"  : 2,
          "icon"          : "svg/eye.html",
          "exclude"       : false
        },
        "index.home.printCarePlan"  : {
          "state"         : "index.home.printCarePlan",
          "translationKey": "CMC_PRINT_CARE_PLAN",
          "displayOrder"  : 3,
          "icon"          : "svg/print.html",
          "exclude"       : false
        },
        "index.home.findPatient"    : {
          "state"         : "index.managePatient",
          "translationKey": "CMC_FIND_PATIENT",
          "displayOrder"  : 4,
          "icon"          : "svg/search.html",
          "exclude"       : false
        },
        "index.home.viewPatientList": {
          "state"         : "index.home.viewPatientList",
          "translationKey": "CMC_VIEW_PATIENT_LIST",
          "displayOrder"  : 5,
          "icon"          : "svg/person.html",
          "exclude"       : false
        }
      }
    },
    "editCarePlan"                      : {
      "secondaryNav": {
        "index.editCarePlan.consent"          : {
          "state"         : "index.editCarePlan.consent",
          "translationKey": "PatientConsent_Nav_Button",
          "displayOrder"  : 2,
          "exclude"       : false
        },
        "index.editCarePlan.patientDetails"   : {
          "state"         : "index.editCarePlan.patientDetails",
          "translationKey": "PatientDetails_Nav_Button",
          "displayOrder"  : 3,
          "exclude"       : false
        },
        "index.editCarePlan.medicalBackground": {
          "state"         : "index.editCarePlan.medicalBackground",
          "translationKey": "SignificantMedicalBackground_Nav_Button",
          "displayOrder"  : 4,
          "exclude"       : false
        },
        "index.editCarePlan.preferences"      : {
          "state"         : "index.editCarePlan.preferences",
          "translationKey": "Preferences_Nav_Button",
          "displayOrder"  : 5,
          "exclude"       : false
        },
        "index.editCarePlan.cpr"              : {
          "state"         : "index.editCarePlan.cpr",
          "translationKey": "CPRDiscussion_Nav_Button",
          "displayOrder"  : 6,
          "exclude"       : false
        },
        "index.editCarePlan.urgentCare"       : {
          "state"         : "index.editCarePlan.urgentCare",
          "translationKey": "EmergencyTreatmentPlan_Nav_Button",
          "displayOrder"  : 7,
          "exclude"       : false
        },
        "index.editCarePlan.medications"      : {
          "state"         : "index.editCarePlan.medications",
          "translationKey": "Medication_Nav_Button",
          "displayOrder"  : 8,
          "exclude"       : false
        },
        "index.editCarePlan.careTeam"         : {
          "state"         : "index.editCarePlan.careTeam",
          "translationKey": "Contacts_Nav_Button",
          "displayOrder"  : 9,
          "exclude"       : false
        },
        "index.editCarePlan.socialDetails"    : {
          "state"         : "index.editCarePlan.socialDetails",
          "translationKey": "SocialSituation_Nav_Button",
          "displayOrder"  : 10,
          "exclude"       : false
        },
        "index.editCarePlan.clinicalEvents"   : {
          "state"         : "index.editCarePlan.clinicalEvents",
          "translationKey": "UrgentCareUpdates_Nav_Button",
          "displayOrder"  : 11,
          "exclude"       : false
        },
        "index.editCarePlan.documents"        : {
          "state"         : "index.editCarePlan.documents",
          "translationKey": "Documents_Nav_Button",
          "displayOrder"  : 12,
          "exclude"       : false
        },
        "index.editCarePlan.metrics"          : {
          "state"         : "index.editCarePlan.metrics",
          "translationKey": "Metrics_Nav_Button",
          "displayOrder"  : 13,
          "exclude"       : false
        }
      }
    },
    "viewCarePlan"                      : {
      "secondaryNav": {
        "index.viewCarePlan.urgentCareSummary": {
          "state"         : "index.viewCarePlan.urgentCareSummary",
          "translationKey": "CMC_CCP_URGENT_CARE_SUMMARY",
          "displayOrder"  : 1,
          "exclude"       : false
        },
        "index.viewCarePlan.consent"          : {
          "state"         : "index.viewCarePlan.consent",
          "translationKey": "PatientConsent_Nav_Button",
          "displayOrder"  : 2,
          "exclude"       : false
        },
        "index.viewCarePlan.patientDetails"   : {
          "state"         : "index.viewCarePlan.patientDetails",
          "translationKey": "PatientDetails_Nav_Button",
          "displayOrder"  : 3,
          "exclude"       : false
        },
        "index.viewCarePlan.medicalBackground": {
          "state"         : "index.viewCarePlan.medicalBackground",
          "translationKey": "SignificantMedicalBackground_Nav_Button",
          "displayOrder"  : 4,
          "exclude"       : false
        },
        "index.viewCarePlan.preferences"      : {
          "state"         : "index.viewCarePlan.preferences",
          "translationKey": "Preferences_Nav_Button",
          "displayOrder"  : 5,
          "exclude"       : false
        },
        "index.viewCarePlan.cpr"              : {
          "state"         : "index.viewCarePlan.cpr",
          "translationKey": "CPRDiscussion_Nav_Button",
          "displayOrder"  : 6,
          "exclude"       : false
        },
        "index.viewCarePlan.urgentCare"       : {
          "state"         : "index.viewCarePlan.urgentCare",
          "translationKey": "EmergencyTreatmentPlan_Nav_Button",
          "displayOrder"  : 7,
          "exclude"       : false
        },
        "index.viewCarePlan.medications"      : {
          "state"         : "index.viewCarePlan.medications",
          "translationKey": "Medication_Screen_Title",
          "displayOrder"  : 8,
          "exclude"       : false
        },
        "index.viewCarePlan.careTeam"         : {
          "state"         : "index.viewCarePlan.careTeam",
          "translationKey": "Contacts_Nav_Button",
          "displayOrder"  : 9,
          "exclude"       : false
        },
        "index.viewCarePlan.socialDetails"    : {
          "state"         : "index.viewCarePlan.socialDetails",
          "translationKey": "SocialSituation_Nav_Button",
          "displayOrder"  : 10,
          "exclude"       : false
        },
        "index.viewCarePlan.clinicalEvents"   : {
          "state"         : "index.viewCarePlan.clinicalEvents",
          "translationKey": "UrgentCareUpdates_Nav_Button",
          "displayOrder"  : 11,
          "exclude"       : false
        },
        "index.viewCarePlan.documents"        : {
          "state"         : "index.viewCarePlan.documents",
          "translationKey": "Documents_Nav_Button",
          "displayOrder"  : 12,
          "exclude"       : false
        }
      }
    }
  };

  // ----------------------------
  // injection
  // ----------------------------
  angular.module('hsSampleApp')
    .constant('iscCustomConfig', iscCustomConfig);

})();
