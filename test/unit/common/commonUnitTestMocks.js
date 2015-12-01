/**
 * Created by douglasgoodman on 11/25/14.
 */

var respondToAssetCalls = function (backEnd, customConfigService) {

  if (customConfigService) {
    spyOn (customConfigService, 'getBaseUrl').and.returnValue ('');
  }

  // mock calls to the config
  backEnd.when ('GET', 'assets/configuration/configFile.json')
      .respond (200, customConfig);

  backEnd.when ('GET', 'assets/configuration/localConfig.json')
      .respond (200);
};

var customConfig = {
  "baseUrl": "http://hscommdev.iscinternal.com/public/api/v1",

  "languageList": [
    {
      "displayName": "English",
      "fileName": "en-us"
    },
    {
      "displayName": "Spanish",
      "fileName": "es-es"
    }
  ],

  "noLoginRequired": [
    "index.login",
    "index.home",
    "index.info.*"
  ],

  "devlogWhitelist": [],

  "userPermittedTabs": {
    "user":[ "index.wellness.*", "index.messages.*", "index.library.*", "index.calendar.*", "index.myAccount.*" ],
    "proxy":["index.myAccount.*", "index.messages",  "index.messages.inbox", "index.messages.outbox", "index.messages.refillPrescription"]
  },

  "userRoles": [ "user", "guest" ],

  "statePermissions": {
    "index.messages.outbox": ["user"]
  },


  "topTabs": {
    "index.home": {
      "state": "index.home",
      "translationKey": "ISC_HOME_TAB",
      "displayOrder": 1,
      "exclude": false
    },

    "index.wellness":  {
      "state": "index.wellness",
      "translationKey": "ISC_WELLNESS_TAB",
      "displayOrder": 2,
      "exclude": true
    },

    "index.messages": {
      "state": "index.messages",
      "translationKey": "ISC_MESSAGES_TAB",
      "displayOrder": 3,
      "exclude": true
    },

    "index.library":  {
      "state": "index.library",
      "translationKey": "ISC_LIBRARY_TAB",
      "displayOrder": 4,
      "exclude": true
    },

    "index.calendar": {
      "state": "index.calendar",
      "translationKey": "ISC_CALENDAR_TAB",
      "displayOrder": 5,
      "exclude": true
    },

    "index.myAccount":  {
      "state": "index.myAccount",
      "translationKey": "ISC_MY_ACCOUNT_TAB",
      "displayOrder": 6,
      "exclude": true
    },

    "index.customerTab":  {
      "state": "index.customerTab",
      "translationKey": "ISC_CUSTOMER_TAB",
      "displayOrder": 7,
      "exclude": true
    }
  },

  "loginButton": {
    "state": "index.login",
    "translationKey": "ISC_LOGIN_BTN",
    "displayOrder": 8,
    "exclude": false
  },

  "logoutButton": {
    "translationKey": "ISC_LOGOUT_BTN",
    "exclude": true
  },

  "home": {
  },

  "wellness": {
  },

  "messages": {
    "secondaryNav": {

      "index.messages.inbox": {
        "state": "index.messages.inbox",
        "translationKey": "ISC_MESSAGES_INBOX_BTN",
        "displayOrder": 1,
        "exclude": true
      },

      "index.messages.outbox": {
        "state": "index.messages.outbox",
        "translationKey": "ISC_MESSAGES_OUTBOX_BTN",
        "displayOrder": 2,
        "exclude": true
      },

      "index.messages.archivedInbox": {
        "state": "index.messages.archivedInbox",
        "translationKey": "ISC_MESSAGES_ARCHIVED_INBOX_BTN",
        "displayOrder": 3,
        "exclude": true
      },

      "index.messages.archivedOutbox": {
        "state": "index.messages.archivedOutbox",
        "translationKey": "ISC_MESSAGES_ARCHIVED_OUTBOX_BTN",
        "displayOrder": 4,
        "exclude": true
      }
    },

    "tasks": {
      "index.messages.medicalQuestion": {
        "state": "index.messages.medicalQuestion",
        "translationKey": "ISC_MESSAGES_MEDICAL_QUESTION",
        "displayOrder": 1,
        "exclude": true
      },

      "index.messages.generalQuestion": {
        "state": "index.messages.generalQuestion",
        "translationKey": "ISC_MESSAGES_GENERAL_QUESTION",
        "displayOrder": 2,
        "exclude": true
      },

      "index.messages.requestAppointment": {
        "state": "index.messages.requestAppointment",
        "translationKey": "ISC_MESSAGES_REQUEST_APPOINTMENT",
        "displayOrder": 3,
        "exclude": true
      },

      "index.messages.refillPrescription": {
        "state": "index.messages.refillPrescription",
        "translationKey": "ISC_MESSAGES_REFILL_PRESCRIPTION",
        "displayOrder": 4,
        "exclude": true
      },

      "index.messages.requestReferral": {
        "state": "index.messages.requestReferral",
        "translationKey": "ISC_MESSAGES_REQUEST_REFERRAL",
        "displayOrder": 5,
        "exclude": true
      },

      "index.messages.requestTestResult": {
        "state": "index.messages.requestTestResult",
        "translationKey": "ISC_MESSAGES_REQUEST_TEST_RESULT",
        "displayOrder": 6,
        "exclude": true
      }
    }
  },

  "library": {
    "secondaryNav": {

      "index.library.healthDictionary": {
        "state": "index.library.healthDictionary",
        "translationKey": "ISC_LIBRARY_HEALTH_DICT_BTN",
        "iconClasses": "fa fa-list-alt",
        "displayOrder": 1,
        "exclude": true
      },

      "index.library.news": {
        "state": "index.library.news",
        "translationKey": "ISC_LIBRARY_NEWS_BTN",
        "iconClasses": "fa fa-list-alt",
        "displayOrder": 2,
        "exclude": true
      },

      "index.library.forms": {
        "state": "index.library.forms",
        "translationKey": "ISC_LIBRARY_FORMS_BTN",
        "iconClasses": "fa fa-list-alt",
        "displayOrder": 2,
        "exclude": true
      }
    }
  },

  "calendar": {
  },

  "myAccount": {
    "secondaryNav": {

      "index.myAccount.summary": {
        "state": "index.myAccount.summary",
        "translationKey": "ISC_MY_ACCT_SUMMARY_BTN",
        "iconClasses": "fa fa-list-alt",
        "displayOrder": 1,
        "exclude": true
      },

      "index.myAccount.history": {
        "state": "index.myAccount.history",
        "translationKey": "ISC_MY_ACCT_HISTORY_BTN",
        "iconClasses": "fa fa-th",
        "displayOrder": 2,
        "exclude": true
      },

      "index.myAccount.password":{
        "state": "index.myAccount.password",
        "translationKey": "ISC_MY_ACCT_CHANGE_PASSWORD_BTN",
        "iconClasses": "fa fa-asterisk",
        "displayOrder": 3,
        "exclude": true
      },

      "index.myAccount.email": {
        "state": "index.myAccount.email",
        "translationKey": "ISC_MY_ACCT_CHANGE_EMAIL_BTN",
        "iconClasses": "fa fa-envelope",
        "displayOrder": 4,
        "exclude": true
      },

      "index.myAccount.proxies": {
        "state": "index.myAccount.proxies",
        "translationKey": "ISC_MY_ACCT_PROXIES_BTN",
        "iconClasses": "fa fa-star-empty",
        "displayOrder": 5,
        "exclude": true
      }
    }
  },

  "customerTab": {
    "secondaryNav": {

      "index.customerTab.tab1": {
        "state": "index.customerTab.tab1",
        "translationKey": "ISC_CUSTOMER_TAB_1_BTN",
        "iconClasses": "fa fa-list-alt",
        "displayOrder": 1,
        "exclude": true
      },

      "index.customerTab.tab2": {
        "state": "index.customerTab.tab2",
        "translationKey": "ISC_CUSTOMER_TAB_2_BTN",
        "iconClasses": "fa fa--list-alt",
        "displayOrder": 2,
        "exclude": true
      }
    }
  }
};

var infoPagesData = {
  "termsInfo" :"<p>Here are some <b>terms<b></p>",
  "legalInfo" :"<p>Here is some <b>legal info<b></p>",
  "termsAndConditions": "<h3>Baystate Health</h3><h4>Patient Portal (myHealth) Terms and Conditions of Use</h4><h5>Minimum Requirements and Security</h5></p><p>This website or of any delay, failure, interruption, or corruption of data or other information transmitted in connection with the use of any service related to Patient Portal. Once information is received by us, your medical information will be treated as confidential and given the same protection that all other Baystate Health medical records are given.</p>",
  "hsInfoContent": "<p>Thanks for using the HealthShare Personal Community site!</p><p>If you have an account, you can sign on: in the Activity Pane on the left, enter your user name and password and then click the Sign on button. If you have forgotten your user name or password, click I can't log in! Help!.</p><p>If you have received an activation key but not yet completed the enrollment process, click Activate your account to do so.</p><p>f you have not yet begun the enrollment process, click the Enroll button to do so.</p><p>If you are not logged in, HealthShare Personal Community shows you four tabs:</p><ul><li>Home — This is the current tab, which also lists upcoming events and current news stories.</li><li>Library — Here you can view general medical information, get HealthShare Personal Community and ISC General news, and download forms.</li><li>Calendar — A list of upcoming ISC General events.</li><li>Sign On — Here you can sign on to HealthShare Personal Community, activate your account, or begin enrollment. You can also do any of these from the Home tab.</li></ul><p>If you are logged in, HealthShare Personal Community shows you the following:</p><ul><li>Home — This is the current tab, which also lists upcoming events and current news stories.</li><li>Wellness — Provides access to the HealthShare Personal Community information about you, your medical history, upcoming appointments, and more. It also allows you to perform tasks so you can actively participate in your own healthcare.</li><li>Messages — Allows you to contact your care providers to ask questions, make appointments, refill prescriptions, and view test results.</li><li>Library — Here you can view general medical information, get HealthShare Personal Community and ISC General news, and download forms.<li>Calendar — A list of upcoming ISC General events.</li><li>My Account — Allows you to view and manage your HealthShare Personal Community account information, such as your password and email address. Here you can also start activities as a proxy user, so that you can view information and perform activities on behalf of another person.</li><li>Sign Out — A link for signing out of HealthShare Personal Community.</li></ul>",
  "states": [
    {
      "name": "Alabama",
      "abbreviation": "AL"
    },
    {
      "name": "Alaska",
      "abbreviation": "AK"
    },
    {
      "name": "American Samoa",
      "abbreviation": "AS"
    },
    {
      "name": "Arizona",
      "abbreviation": "AZ"
    },
    {
      "name": "Arkansas",
      "abbreviation": "AR"
    },
    {
      "name": "California",
      "abbreviation": "CA"
    },
    {
      "name": "Colorado",
      "abbreviation": "CO"
    },
    {
      "name": "Connecticut",
      "abbreviation": "CT"
    },
    {
      "name": "Delaware",
      "abbreviation": "DE"
    },
    {
      "name": "District Of Columbia",
      "abbreviation": "DC"
    },
    {
      "name": "Federated States Of Micronesia",
      "abbreviation": "FM"
    },
    {
      "name": "Florida",
      "abbreviation": "FL"
    },
    {
      "name": "Georgia",
      "abbreviation": "GA"
    },
    {
      "name": "Guam",
      "abbreviation": "GU"
    },
    {
      "name": "Hawaii",
      "abbreviation": "HI"
    },
    {
      "name": "Idaho",
      "abbreviation": "ID"
    },
    {
      "name": "Illinois",
      "abbreviation": "IL"
    },
    {
      "name": "Indiana",
      "abbreviation": "IN"
    },
    {
      "name": "Iowa",
      "abbreviation": "IA"
    },
    {
      "name": "Kansas",
      "abbreviation": "KS"
    },
    {
      "name": "Kentucky",
      "abbreviation": "KY"
    },
    {
      "name": "Louisiana",
      "abbreviation": "LA"
    },
    {
      "name": "Maine",
      "abbreviation": "ME"
    },
    {
      "name": "Marshall Islands",
      "abbreviation": "MH"
    },
    {
      "name": "Maryland",
      "abbreviation": "MD"
    },
    {
      "name": "Massachusetts",
      "abbreviation": "MA"
    },
    {
      "name": "Michigan",
      "abbreviation": "MI"
    },
    {
      "name": "Minnesota",
      "abbreviation": "MN"
    },
    {
      "name": "Mississippi",
      "abbreviation": "MS"
    },
    {
      "name": "Missouri",
      "abbreviation": "MO"
    },
    {
      "name": "Montana",
      "abbreviation": "MT"
    },
    {
      "name": "Nebraska",
      "abbreviation": "NE"
    },
    {
      "name": "Nevada",
      "abbreviation": "NV"
    },
    {
      "name": "New Hampshire",
      "abbreviation": "NH"
    },
    {
      "name": "New Jersey",
      "abbreviation": "NJ"
    },
    {
      "name": "New Mexico",
      "abbreviation": "NM"
    },
    {
      "name": "New York",
      "abbreviation": "NY"
    },
    {
      "name": "North Carolina",
      "abbreviation": "NC"
    },
    {
      "name": "North Dakota",
      "abbreviation": "ND"
    },
    {
      "name": "Northern Mariana Islands",
      "abbreviation": "MP"
    },
    {
      "name": "Ohio",
      "abbreviation": "OH"
    },
    {
      "name": "Oklahoma",
      "abbreviation": "OK"
    },
    {
      "name": "Oregon",
      "abbreviation": "OR"
    },
    {
      "name": "Palau",
      "abbreviation": "PW"
    },
    {
      "name": "Pennsylvania",
      "abbreviation": "PA"
    },
    {
      "name": "Puerto Rico",
      "abbreviation": "PR"
    },
    {
      "name": "Rhode Island",
      "abbreviation": "RI"
    },
    {
      "name": "South Carolina",
      "abbreviation": "SC"
    },
    {
      "name": "South Dakota",
      "abbreviation": "SD"
    },
    {
      "name": "Tennessee",
      "abbreviation": "TN"
    },
    {
      "name": "Texas",
      "abbreviation": "TX"
    },
    {
      "name": "Utah",
      "abbreviation": "UT"
    },
    {
      "name": "Vermont",
      "abbreviation": "VT"
    },
    {
      "name": "Virgin Islands",
      "abbreviation": "VI"
    },
    {
      "name": "Virginia",
      "abbreviation": "VA"
    },
    {
      "name": "Washington",
      "abbreviation": "WA"
    },
    {
      "name": "West Virginia",
      "abbreviation": "WV"
    },
    {
      "name": "Wisconsin",
      "abbreviation": "WI"
    },
    {
      "name": "Wyoming",
      "abbreviation": "WY"
    }
  ]
};

var appointmentTimeData = {
  isComplete: false,
  step: 0,
  appointmentOptions: [
    {label: 'ISC_MESSAGES_REQUEST_APPOINTMENT_NEXT_AVAILABLE', value: 1},
    {label: 'ISC_MESSAGES_REQUEST_APPOINTMENT_WITHIN_WEEK', value: 2},
    {label: 'ISC_MESSAGES_REQUEST_APPOINTMENT_WITHIN_TWO_WEEKS', value: 3},
    {label: 'ISC_MESSAGES_REQUEST_APPOINTMENT_WITHIN_NEXT_MONTH', value: 4},
    {label: 'ISC_MESSAGES_REQUEST_APPOINTMENT_WITHIN_TWO_MONTHS', value: 5},
    {label: 'ISC_MESSAGES_REQUEST_APPOINTMENT_WITHIN_THREE_MONTHS', value: 6},
    {label: 'ISC_MESSAGES_REQUEST_APPOINTMENT_WITHIN_SIX_MONTHS', value: 7},
    {label: 'ISC_MESSAGES_REQUEST_APPOINTMENT_WITHIN_ONE_YEAR', value: 8}
  ],
  days: [
    {
      dayOfWeek: 'Sun',
      timesOfDay: [
      {label: 'ISC_SUNDAY_MORNING', checked:false},
      {label: 'ISC_SUNDAY_AFTERNOON', checked:false},
      {label: 'ISC_SUNDAY_EVENING', checked:false}
      ]
    },
    {
      dayOfWeek: 'Mon',
      timesOfDay: [
      {label: 'ISC_MONDAY_MORNING', checked:false},
      {label: 'ISC_MONDAY_AFTERNOON', checked:false},
      {label: 'ISC_MONDAY_EVENING', checked:false}
      ]
    },
    {
      dayOfWeek: 'Tues',
      timesOfDay: [
      {label: 'ISC_TUESDAY_MORNING', checked:false},
      {label: 'ISC_TUESDAY_AFTERNOON', checked:false},
      {label: 'ISC_TUESDAY_EVENING', checked:false}
      ]
    },
    {
      dayOfWeek: 'Wed',
      timesOfDay: [
      {label: 'ISC_WEDNESDAY_MORNING', checked:false},
      {label: 'ISC_WEDNESDAY_AFTERNOON', checked:false},
      {label: 'ISC_WEDNESDAY_EVENING', checked:false}
      ]
    },
    {
      dayOfWeek: 'Thurs',
      timesOfDay: [
      {label: 'ISC_THURSDAY_MORNING', checked:false},
      {label: 'ISC_THURSDAY_AFTERNOON', checked:false},
      {label: 'ISC_THURSDAY_EVENING', checked:false}
      ]
    },
    {
      dayOfWeek: 'Fri',
      timesOfDay: [
      {label: 'ISC_FRIDAY_MORNING', checked:false},
      {label: 'ISC_FRIDAY_AFTERNOON', checked:false},
      {label: 'ISC_FRIDAY_EVENING', checked:false}
      ]
    },
    {
      dayOfWeek: 'Sat',
      timesOfDay: [
      {label: 'ISC_SATURDAY_MORNING', checked:false},
      {label: 'ISC_SATURDAY_AFTERNOON', checked:false},
      {label: 'ISC_SATURDAY_EVENING', checked:false}
      ]
    }
  ]
};

var appointmentReasonData = {
  label: 'ISC_SELECT_APPOINTMENT_TYPE',
  allTypes: [],
  selectedType: null,
  appointmentType: {
    id: '-1',
    label: 'ISC_SELECT_APPOINTMENT_TYPE',
    allTypes: [],
    selectedType: null
  },
  step: 0,
  isComplete: false
};

var contactInfoData = {
  isComplete: false,
  step: 0,
  sendMessage: true,
  phoneNumber: '',
  addExtension: false,
  extensionValue: '',
  timeToCallValue: '',
  voiceMailOK: false,
  saveAsDefault: false,
  timeToCallOptions: [
    {label: 'ISC_MESSAGES_REQUEST_APPOINTMENT_CALL_MORNING', value: 1},
    {label: 'ISC_MESSAGES_REQUEST_APPOINTMENT_CALL_AFTERNOON', value: 2},
    {label: 'ISC_MESSAGES_REQUEST_APPOINTMENT_CALL_EVENING', value: 3}
  ]
};

var mailReplyData = {
  isComplete: false,
  step: 0,
  mailReply: {
    To: '',
    From: '',
    Subject: '',
    Body: ''
  }
};

var testResultData = {
  isComplete: false,
  step: 0,
  testDate: '',
  testResult: ''
};

var pharmacyData = {
  isComplete: false,
  step: 0,
  currentPage: 1, //pagination page
  searchTerm: '',
  selectedPharmacy: null,
  providersSearchResults: [],
  providersFavoritesList: []
};

var providersData = {
  isComplete: false,
  step: 0,
  currentPage: 1, //pagination page
  searchTerm: '',
  selectedProvider: null,
  providersSearchResults: [],
  providersFavoritesList: []
};

var referralReasonData = {
  isComplete: false,
  step: 0,
  underWorkmansComp: false,
  motorVehicleInjury: false,
  insuranceCompanyName: '',
  policyNumber: '',
  reasonForReferral: ''
};

var providersListData = [
  {
    name: 'Prof. Russell Johnson',
    location: 'InterSys Clinic',
    address:'1 Memorial Drive, Cambridge, MA 02140',
    specialty: ['Allergies', 'Chiropracty', 'Crystal Divination', 'Internal Medicine', 'Cardiology'],
    isFavorite: 1
  },
  {
    name: 'Dr. Gilligan Skipper',
    location: 'Mayo Clinic',
    address:'11 Friends St, Watertown, MA 02345',
    specialty: ['Pediatrics'],
    isFavorite: 1
  },
  {
    name: 'Dr. Mary Anne Ginger',
    location: 'InterSys Clinic',
    address:'1 Memorial Drive, Cambridge, MA 02140',
    specialty: ['Internal Medicine'],
    isFavorite: 1
  },
  {
    name: 'Dr. Jessica Greenspan',
    location: 'InterSys Clinic',
    address:'15 Memorial Drive, Cambridge, MA 02140',
    specialty: ['Allergies'],
    isFavorite: 1
  }
]
