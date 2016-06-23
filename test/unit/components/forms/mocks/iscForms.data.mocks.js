// Mock data
var mockFormStore      = {};
var resetMockFormStore = function() {
  mockFormStore = {
    formStatus: [
      {
        "formKey"    : "archive",
        "formName"   : "Archive Record",
        "formType"   : "closeout",
        "createdDate": "2016-01-29T16:32:50.186Z",
        "status"     : "Active"
      },
      {
        "formKey"    : "intake",
        "formName"   : "Intake Form",
        "formType"   : "initial",
        "createdDate": "2016-01-29T16:32:50.190Z",
        "status"     : "Active"
      },
      {
        "formKey"    : "treatment",
        "formName"   : "Treatment Form",
        "formType"   : "treatment",
        "createdDate": "2016-01-29T16:32:50.201Z",
        "status"     : "Active"
      },
      {
        "formKey"    : "sample",
        "formName"   : "Sample Intake Form",
        "formType"   : "initial",
        "createdDate": "2016-02-25T23:42:14.037Z",
        "status"     : "Inactive"
      },
      {
        "formKey"    : "sample2",
        "formName"   : "Sample Treatment Form",
        "formType"   : "treatment",
        "createdDate": "2016-02-25T23:42:14.041Z",
        "status"     : "Active"
      },
      {
        "formKey"    : "hsModelUtilsValidationSample",
        "formName"   : "Sample Form for hsModelUtilsValidation",
        "formType"   : "sample",
        "createdDate": "2016-04-05T20:43:05.838Z",
        "status"     : "Inactive"
      }
    ],
    formData  : [
      sampleCloseout,
      sampleDDPData,
      sampleIntake
    ]
  }
};

var mockComponentData = {
  "templates": {
    "input"                : "some text",
    "checkbox"             : true,
    "multiCheckbox"        : {
      "primitive": [
        "1",
        "2"
      ],
      "object"   : [
        {
          "name" : "MultiCheckbox 2",
          "value": "2"
        },
        {
          "name" : "MultiCheckbox 3",
          "value": "3"
        }
      ]
    },
    "radio"                : {
      "primitive": "Radio 1",
      "object"   : {
        "name" : "Radio 2",
        "value": "2"
      }
    },
    "typeahead"            : {
      "primitive": "Typeahead 1",
      "object"   : {
        "name" : "Typeahead 2",
        "value": "2"
      }
    },
    "typeaheadWithScript"  : {
      "name" : "TypeaheadWithScript 3",
      "value": "3"
    },
    "select"               : {
      "primitive": "Select 1",
      "object"   : {
        "name" : "Select 2",
        "value": "2"
      }
    },
    "textarea"             : "more text",
    "dateComponents"       : "1990-12-11 00:00:00",
    "dateComponentsPartial": {
      "day"  : "",
      "month": 9,
      "year" : 1989
    }
  }
};

var sampleCloseout = {
  "formKey"    : "archive",
  "formName"   : "Archive Record",
  "formType"   : "closeout",
  "author"     : {
    "Roles"   : [
      "provider"
    ],
    "Name"    : {
      "NamePrefix"        : {
        "Scheme"     : "",
        "Code"       : "",
        "Description": "",
        "CodeName"   : "HSCC-App-CodeTable.NamePrefix.$"
      },
      "GivenName"         : "Beth",
      "MiddleName"        : "",
      "FamilyNamePrefix"  : "",
      "FamilyName"        : "Childs",
      "NameSuffix"        : "",
      "PreferredName"     : "",
      "ProfessionalSuffix": ""
    },
    "userRole": "provider",
    "FullName": "Beth Childs"
  },
  "completedOn": "2016-01-20T08:10:19.558Z",
  "data"       : {
    "type": {
      "name" : "Treatment Complete",
      "value": "TC"
    }
  },
  "id"         : 1
};
var sampleDDPData  = {
  "formKey"    : "intake",
  "formName"   : "Intake Form",
  "formType"   : "initial",
  "id"         : 2,
  "author"     : {
    "Roles"   : [
      "provider"
    ],
    "Name"    : {
      "NamePrefix"        : {
        "Scheme"     : "",
        "Code"       : "",
        "Description": "",
        "CodeName"   : "HSCC-App-CodeTable.NamePrefix.$"
      },
      "GivenName"         : "Beth",
      "MiddleName"        : "",
      "FamilyNamePrefix"  : "",
      "FamilyName"        : "Childs",
      "NameSuffix"        : "",
      "PreferredName"     : "",
      "ProfessionalSuffix": ""
    },
    "userRole": "provider",
    "FullName": "Beth Childs",
    "username": "bchilds",
    "jwt"     : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJBcHBsaWNhdGlvblJvbGUiOiJwcm92aWRlciIsIlVzZXJUeXBlIjoiY2xpbmljaWFuIiwiVXNlcm5hbWUiOiJiY2hpbGRzIiwiUGFzc3dvcmQiOiJ0ZXN0IiwiVXNlckRhdGEiOnsiUm9sZXMiOlsicHJvdmlkZXIiXSwiTmFtZSI6eyJHaXZlbk5hbWUiOiJCZXRoIiwiTWlkZGxlTmFtZSI6IiIsIkZhbWlseU5hbWVQcmVmaXgiOiIiLCJGYW1pbHlOYW1lIjoiQ2hpbGRzIiwiTmFtZVN1ZmZpeCI6IiIsIlByZWZlcnJlZE5hbWUiOiIiLCJQcm9mZXNzaW9uYWxTdWZmaXgiOiIifX0sInNlc3Npb25JRCI6Ilc4bFhjSkJkME9ZMk9OLVp3elJuRnozMjBjQXc5MkQzIiwiaWF0IjoxNDYxODYzMzczLCJleHAiOjE0NjE5NDk3NzN9.Deru7nUcVvWYFfETHHPn3YWRPxmqYRPlPV-U81y5_wo"
  },
  "patientId"  : 5,
  "completedOn": "2016-04-28T17:10:06.383Z",
  "data"       : {
    "name"       : {
      "first": "Johnz",
      "last" : "Smith"
    },
    "dateOfBirth": "1951-12-12 00:00:00",
    "sex"        : {
      "name" : "Male",
      "value": "1"
    },
    "consent"    : {
      "name" : "Patient consents to treatment",
      "value": "Yes"
    },
    "addresses"  : [
      {
        "zip"         : "02116",
        "isPrimary"   : true,
        "streetNumber": 12,
        "street"      : "Main Street",
        "street2"     : "B",
        "city"        : "Boston",
        "state"       : {
          "name" : "Massachusetts",
          "value": "MA"
        }
      }
    ],
    "contacts"   : [
      {
        "type"     : {
          "name" : "Phone",
          "value": "tel"
        },
        "value"    : "617-274-5764",
        "isPrimary": true
      }
    ],
    "diagnoses"  : [
      {
        "diagnosis": {
          "name" : "Hepatitis B B16",
          "value": "B16"
        }
      }
    ]
  }
};

var sampleIntake = {
  "formKey" : "intake",
  "formName": "Intake Form",
  "id"      : 3,
  "data"    : {
    "components": mockComponentData,
    "subform"   : {
      "components": mockComponentData
    },
    "test"      : {
      "SubformPage"  : [
        {
          "aField": "SubformPage: some data"
        }
      ],
      "SubformInline": [
        {
          "aField": "SubformPage: some data"
        }
      ],
      "SubformModal" : [
        {
          "aField": "SubformPage: some data"
        }
      ]
    }
  }
};

