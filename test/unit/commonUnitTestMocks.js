/**
 * Created by douglasgoodman on 11/25/14.
 */

var customConfig = {
  "baseUrl": "http://hscommdev.iscinternal.com/public/api/v1/",

  "noLoginRequired": [
    "index",
    "index.login",
    "index.home",
    "index.library.*",
    "index.calendar.*",
    "index.info.*"
  ],

  "userRoles": [
    "user",
    "proxy"
  ],

  "statePermissions": {
    "index.messages.outbox": ["user"],
    "index.myAccount": ["user"]
  },

  "topTabs": {
    "index.home": {
      "state": "index.home",
      "translationKey": "ISC_HOME_TAB",
      "iconClasses": "fa fa-home",
      "displayOrder": 1,
      "exclude": false
    },

    "index.wellness":  {
      "state": "index.wellness",
      "translationKey": "ISC_WELLNESS_TAB",
      "iconClasses":"fa fa-heart",
      "displayOrder": 2,
      "exclude": false
    },

    "index.messages": {
      "state": "index.messages",
      "translationKey": "ISC_MESSAGES_TAB",
      "iconClasses":"fa fa-envelope",
      "displayOrder": 3,
      "exclude": false
    },

    "index.library":  {
      "state": "index.library",
      "translationKey": "ISC_LIBRARY_TAB",
      "iconClasses":"fa fa-book",
      "displayOrder": 4,
      "exclude": false
    },

    "index.calendar": {
      "state": "index.calendar",
      "translationKey": "ISC_CALENDAR_TAB",
      "iconClasses":"fa fa-calendar",
      "displayOrder": 5,
      "exclude": false
    },

    "index.myAccount":  {
      "state": "index.myAccount",
      "translationKey": "ISC_MY_ACCOUNT_TAB",
      "iconClasses":"fa fa-dashboard",
      "displayOrder": 6,
      "exclude": false
    },

    "index.customerTab":  {
      "state": "index.customerTab",
      "translationKey": "ISC_CUSTOMER_TAB",
      "iconClasses":"fa fa-dashboard",
      "displayOrder": 7,
      "exclude": true
    }
  },

  "loginButton": {
    "state": "index.login",
    "translationKey": "ISC_LOGIN_BTN",
    "iconClasses":"fa fa-login",
    "displayOrder": 8,
    "exclude": false
  },

  "logoutButton": {
    "translationKey": "ISC_LOGOUT_BTN",
    "iconClasses":"fa fa-sign-out",
    "exclude": false
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
        "iconClasses": "fa fa-list-alt",
        "displayOrder": 1,
        "exclude": false
      },

      "index.messages.outbox": {
        "state": "index.messages.outbox",
        "translationKey": "ISC_MESSAGES_OUTBOX_BTN",
        "iconClasses": "fa fa-list-alt",
        "displayOrder": 2,
        "exclude": false
      },

      "index.messages.medicalQuestion": {
        "state": "index.messages.medicalQuestion",
        "translationKey": "ISC_MESSAGES_MEDICAL_QUESTION_BTN",
        "iconClasses": "fa fa-list-alt",
        "displayOrder": 3,
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
        "exclude": false
      },

      "index.library.news": {
        "state": "index.library.news",
        "translationKey": "ISC_LIBRARY_NEWS_BTN",
        "iconClasses": "fa fa-list-alt",
        "displayOrder": 2,
        "exclude": false
      },

      "index.library.forms": {
        "state": "index.library.forms",
        "translationKey": "ISC_LIBRARY_FORMS_BTN",
        "iconClasses": "fa fa-list-alt",
        "displayOrder": 2,
        "exclude": false
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
        "exclude": false
      },

      "index.myAccount.history": {
        "state": "index.myAccount.history",
        "translationKey": "ISC_MY_ACCT_HISTORY_BTN",
        "iconClasses": "fa fa-th",
        "displayOrder": 2,
        "exclude": false
      },

      "index.myAccount.password":{
        "state": "index.myAccount.password",
        "translationKey": "ISC_MY_ACCT_CHANGE_PASSWORD_BTN",
        "iconClasses": "fa fa-asterisk",
        "displayOrder": 3,
        "exclude": false
      },

      "index.myAccount.email": {
        "state": "index.myAccount.email",
        "translationKey": "ISC_MY_ACCT_CHANGE_EMAIL_BTN",
        "iconClasses": "fa fa-envelope",
        "displayOrder": 4,
        "exclude": false
      },

      "index.myAccount.proxies": {
        "state": "index.myAccount.proxies",
        "translationKey": "ISC_MY_ACCT_PROXIES_BTN",
        "iconClasses": "fa fa-star-empty",
        "displayOrder": 5,
        "exclude": false
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
        "exclude": false
      },

      "index.customerTab.tab2": {
        "state": "index.customerTab.tab2",
        "translationKey": "ISC_CUSTOMER_TAB_2_BTN",
        "iconClasses": "fa fa--list-alt",
        "displayOrder": 2,
        "exclude": false
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
