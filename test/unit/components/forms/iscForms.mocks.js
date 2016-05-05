var mockApiHelper = {
  getUrl      : function (path) {
    return path;
  },
  getConfigUrl: function (configProp) {
    return configProp.path;
  }
};

var mockCustomConfigService = {
  getConfig: function () {
    return customConfig;
  }
};

var mockFormResponses = function (httpBackend) {
  var staticPath = '/test/unit/components/forms/static';

  // List forms
  httpBackend.when('GET', 'forms')
    .respond(200, mockFormStore.formStatus);

  // Get form status
  httpBackend.when('GET', /^formInfo\/status\/\w*$/)
    .respond(function response(method, url) {
      var formType = url.replace('formInfo/status/', '');
      return [200, _.filter(mockFormStore.formStatus, {
        formType: formType
      })]
    });

  // Update form status
  httpBackend.when('PUT', /^formInfo\/\w*$/)
    .respond(function response(method, url, data) {
      var formType = url.replace('formInfo/', ''),
          body     = JSON.parse(data);

      _.forEach(body, function (form) {
        var formToUpdate = _.find(mockFormStore.formStatus, {formType: formType, formKey: form.formKey});
        if (formToUpdate) {
          formToUpdate.status = form.status;
        }
      });

      return [200];
    });

  // Form Definition
  httpBackend.when('GET', /^forms\/\w*$/)
    .respond(function response(method, url) {
      var formKey = url.replace('forms/', ''),
          request = new XMLHttpRequest();

      request.open('GET', [staticPath, formKey + '.json'].join('/'), false);
      request.send(null);

      return [200, request.response, {}];
    });

  // User Scripts
  httpBackend.when('GET', /^formTemplates\/userScripts\/\w*$/)
    .respond(function response(method, url) {
      var scriptName = url.replace('formTemplates/userScripts/', ''),
          request    = new XMLHttpRequest();

      request.open('GET', [staticPath, 'userScripts', scriptName + '.js'].join('/'), false);
      request.send(null);

      return [200, request.response, {}];
    });

  // Custom Templates
  httpBackend.when('GET', /^formTemplates\/html\/\w*\/.*$/)
    .respond(function response(method, url) {
      var routeParams  = url.replace('formTemplates/html/', ''),
          splitParams  = routeParams.split('/'),
          templateName = splitParams[0],
          htmlName     = splitParams[1],
          request      = new XMLHttpRequest();

      request.open('GET', [staticPath, templateName, htmlName].join('/'), false);
      request.send(null);

      return [200, request.response, {}];
    });

  httpBackend.when('GET', /^formTemplates\/js\/\w*$/)
    .respond(function response(method, url) {
      var templateName = url.replace('formTemplates/js', ''),
          request      = new XMLHttpRequest();

      request.open('GET', [staticPath, templateName, 'script.js'].join('/'), false);
      request.send(null);

      return [200, request.response, {}];
    });

  httpBackend.when('GET', /^formTemplates\/css\/\w*$/)
    .respond(function response(method, url) {
      var templateName = url.replace('formTemplates/css', ''),
          request      = new XMLHttpRequest();

      request.open('GET', [staticPath, templateName, 'stylesheet.css'].join('/'), false);
      request.send(null);

      return [200, request.response, {}];
    });

  // Form Data
  // GET: list all
  httpBackend.when('GET', 'formData')
    .respond(200, mockFormStore.formData);

  // GET: by id
  httpBackend.when('GET', /^formData\/\d*$/)
    .respond(function response(method, url) {
      var id   = parseInt(url.replace('formData/', '')),
          form = _.find(mockFormStore.formData, {id: id});

      return [200, form || {}];
    });

  // PUT
  httpBackend.when('PUT', /^formData\/\d*$/)
    .respond(function response(method, url, data) {
      var id   = parseInt(url.replace('formData/', '')),
          form = _.find(mockFormStore.formData, {id: id}),
          body = JSON.parse(data);

      _.mergeWith(form, body, function (dbRecord, formRecord) {
        if (_.isArray(dbRecord)) {
          return formRecord;
        }
      });

      return [200, form];
    });

  // POST
  httpBackend.when('POST', 'formData')
    .respond(function response(method, url, data) {
      var body   = JSON.parse(data),
          maxId  = _.maxBy(mockFormStore.formData, function (form) {
            return Math.max(form.id);
          }),
          nextId = _.get(maxId, 'id', 0) + 1;

      var form = {
        id  : nextId,
        data: body
      };

      mockFormStore.formData.push(form);

      return [200, form];
    });

  // DELETE
  httpBackend.when('DELETE', /^formData\/\d*$/)
    .respond(function response(method, url) {
      var id   = parseInt(url.replace('formData/', '')),
          form = _.find(mockFormStore.formData, {id: id});
      _.remove(mockFormStore.formData, form);

      return [200, form];
    });

  // CodeTable API
  httpBackend.when('GET', 'codeTables')
    .respond(function response(method, url) {
      var request = new XMLHttpRequest();

      request.open('GET', [staticPath, 'codeTables', 'US_states.json'].join('/'), false);
      request.send(null);

      var response = {
        "US_states": JSON.parse(request.response)
      };

      return [200, response, {}];
    });

  // Public APIs for testing
  // Zipcode
  httpBackend.when('GET', /^http:\/\/api\.zippopotam\.us\/us\/\d*$/)
    .respond(200, {
      "post code"           : "02139",
      "country"             : "United States",
      "country abbreviation": "US",
      "places"              : [{
        "place name"        : "Cambridge",
        "longitude"         : "-71.1042",
        "state"             : "Massachusetts",
        "state abbreviation": "MA",
        "latitude"          : "42.3647"
      }]
    });
};

var mockFormStore = {
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
    {
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
    },
    {
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
    }
  ]
};

