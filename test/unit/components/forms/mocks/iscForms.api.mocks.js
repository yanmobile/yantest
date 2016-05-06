// Mock API
var mockFormResponses = function (httpBackend) {
  var staticPath = '/test/unit/components/forms/static';

  resetMockFormStore();

  // List forms
  httpBackend.when('GET', 'forms')
    .respond(200, mockFormStore.formStatus);

  // Get form status
  httpBackend.when('GET', /^formInfo\/status\/\w*$/)
    .respond(function response(method, url) {
      var formType = url.replace('formInfo/status/', '');
      console.log(_.filter(mockFormStore.formStatus, {
        formType: formType
      }));
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

      request.open('GET', [staticPath, 'codeTables', 'usStates.json'].join('/'), false);
      request.send(null);

      var response = {
        "usStates": JSON.parse(request.response)
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

