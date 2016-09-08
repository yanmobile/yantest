// Mock API
var mockFormResponses = function( httpBackend ) {
  var staticPath   = 'test/unit/components/forms/static',
      templatePath = staticPath + '/templates',
      wrapperPath  = staticPath + '/wrappers';

  resetMockFormStore();

  // List forms
  // GET forms
  httpBackend.when( 'GET', 'forms' )
    .respond( 200, mockFormStore.formStatus );

  // Get form status
  // GET formInfo/status/:formKey
  httpBackend.when( 'GET', /^formInfo\/status\/\w*$/ )
    .respond( function response( method, url ) {
      var formType = url.replace( 'formInfo/status/', '' );
      return [200, _.filter( mockFormStore.formStatus, {
        formType: formType
      } )];
    } );

  // Update form status
  // PUT formInfo/:formKey
  httpBackend.when( 'PUT', /^formInfo\/\w*$/ )
    .respond( function response( method, url, data ) {
      var formType = url.replace( 'formInfo/', '' ),
          body     = JSON.parse( data );

      _.forEach( body, function( form ) {
        var formToUpdate = _.find( mockFormStore.formStatus, { formType: formType, formKey: form.formKey } );
        if ( formToUpdate ) {
          formToUpdate.status = form.status;
        }
      } );

      return [200];
    } );

  // Form Definition
  // GET forms/:formKey
  httpBackend.when( 'GET', /^forms\/[\w.]*$/ )
    .respond( function response( method, url ) {
      var formKey = url.replace( 'forms/', '' ),
          path    = [staticPath, formKey].join( '/' );

      return [200, getJSONFile( path ), {}];
    } );

  // Form Definition, specific version
  // GET forms/:formKey/:formVersion
  httpBackend.when( 'GET', /^forms\/[\w.]*\/[\w.]*$/ )
    .respond( function response( method, url ) {
      var requestUrl  = url.replace( 'forms/', '' ).split( '/' ),
          formKey     = requestUrl[0],
          formVersion = requestUrl[1],
          formPath    = [formKey, formVersion].join( '.' ),
          path        = [staticPath, formPath].join( '/' );

      return [200, getJSONFile( path ), {}];
    } );

  // User Scripts
  // GET formTemplates/userScripts/:scriptName
  httpBackend.when( 'GET', /^formTemplates\/userScripts\/\w*$/ )
    .respond( function response( method, url ) {
      var scriptName = url.replace( 'formTemplates/userScripts/', '' ),
          path       = [staticPath, 'userScripts', scriptName + '.js'].join( '/' );

      var file = getHTMLFile( path );
      return [200, file, {}];
    } );

  // Custom Templates
  // GET formTemplates/html/:templateName/:htmlName
  httpBackend.when( 'GET', /^formTemplates\/html\/\w*\/.*$/ )
    .respond( function response( method, url ) {
      var routeParams  = url.replace( 'formTemplates/html/', '' ),
          splitParams  = routeParams.split( '/' ),
          templateName = splitParams[0],
          htmlName     = splitParams[1],
          path         = [templatePath, templateName, htmlName].join( '/' );

      return [200, getHTMLFile( path ), {}];
    } );

  // GET formTemplates/js/:templateName
  httpBackend.when( 'GET', /^formTemplates\/js\/\w*$/ )
    .respond( function response( method, url ) {
      var templateName = url.replace( 'formTemplates/js/', '' ),
          path         = [templatePath, templateName, 'script.js'].join( '/' );

      return [200, getHTMLFile( path ), {}];
    } );

  // GET formTemplates/css/:templateName
  httpBackend.when( 'GET', /^formTemplates\/css\/\w*$/ )
    .respond( function response( method, url ) {
      var templateName = url.replace( 'formTemplates/css/', '' ),
          path         = [templatePath, templateName, 'stylesheet.css'].join( '/' );

      var response = getHTMLFile( path );

      if ( !response ) {
        return [404, {}, {}];
      }
      else {
        return [200, response, {}];
      }
    } );

  // Custom wrappers
  // GET formTemplates/wrappers/:wrapperName
  httpBackend.when( 'GET', /^formTemplates\/wrappers\/\w*$/ )
    .respond( function response( method, url ) {
      var wrapperName = url.replace( 'formTemplates/wrappers/', '' ),
          path        = [wrapperPath, wrapperName + '.html'].join( '/' );

      return [200, getHTMLFile( path ), {}];
    } );

  // View mode test
  httpBackend.when( 'GET', /^testViewMode\.html$/ )
    .respond( function response( method, url ) {
      var path = [staticPath, 'viewMode', url].join( '/' );
      return [200, getHTMLFile( path ), {}];
    } );


  // Form Data
  // GET formData
  httpBackend.when( 'GET', 'formData' )
    .respond( 200, mockFormStore.formData );

  // GET formData/:id
  httpBackend.when( 'GET', /^formData\/\d+$/ )
    .respond( function response( method, url ) {
      var id   = parseInt( url.replace( 'formData/', '' ) ),
          form = _.find( mockFormStore.formData, { id: id } );

      return [200, form || {}];
    } );

  // PUT formData/:id
  httpBackend.when( 'PUT', /^formData\/\d+$/ )
    .respond( function response( method, url, data ) {
      var id   = parseInt( url.replace( 'formData/', '' ) ),
          form = _.find( mockFormStore.formData, { id: id } ),
          body = JSON.parse( data );

      _.mergeWith( form, body, function( dbRecord, formRecord ) {
        if ( _.isArray( dbRecord ) ) {
          return formRecord;
        }
      } );

      return [200, form];
    } );

  // Creating new form data
  // POST formData
  httpBackend.when( 'POST', /^formData$/ )
    .respond( function response( method, url, data ) {
      var body   = JSON.parse( data ),
          maxId  = _.maxBy( mockFormStore.formData, function( form ) {
            return Math.max( form.id );
          } ),
          nextId = _.get( maxId, 'id', 0 ) + 1;

      var form = {
        id  : nextId,
        data: body
      };

      mockFormStore.formData.push( form );

      return [200, form];
    } );

  // Submitting form data   (may be new or may already exist)
  // POST formData/:id      (already exists)
  // POST formData/_submit  (new)
  httpBackend.when( 'POST', /^formData\/(\d+|_submit)$/ )
    .respond( function response( method, url, data ) {
      var id     = url.replace( 'formData/', '' ),
          body   = JSON.parse( data ),
          maxId  = _.maxBy( mockFormStore.formData, function( form ) {
            return Math.max( form.id );
          } ),
          nextId = _.get( maxId, 'id', 0 ) + 1,
          form;

      if ( id === '_submit' ) {
        form = {
          id  : nextId,
          data: body
        };
        mockFormStore.formData.push( form );
      }
      else {
        id   = parseInt( id );
        form = _.find( mockFormStore.formData, { id: id } );
        _.mergeWith( form, body, function( dbRecord, formRecord ) {
          if ( _.isArray( dbRecord ) ) {
            return formRecord;
          }
        } );
      }

      return [200, form];
    } );

  // DELETE formData/:id
  httpBackend.when( 'DELETE', /^formData\/\d+$/ )
    .respond( function response( method, url ) {
      var id   = parseInt( url.replace( 'formData/', '' ) ),
          form = _.find( mockFormStore.formData, { id: id } );
      _.remove( mockFormStore.formData, form );

      return [200, form];
    } );

  // CodeTable API
  httpBackend.when( 'GET', 'codeTables' )
    .respond( function response( method, url ) {
      var path = [staticPath, 'codeTables', 'usStates'].join( '/' ),
          json = getJSONFile( path );

      var response = {
        "usStates": json
      };

      return [200, response, {}];
    } );

  // Public APIs for testing
  // Zipcode
  httpBackend.when( 'GET', /^http:\/\/api\.zippopotam\.us\/us\/\d*$/ )
    .respond( 200, {
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
    } );
};

// JSON fixtures
function getJSONFile( path ) {
  // For Karma, using fixtures
  if ( window.__json__ ) {
    return window.__json__[path];
  }
  // For Wallaby, serving files
  else {
    var request = new XMLHttpRequest();

    request.open( 'GET', path + '.json', false );
    request.send( null );

    return JSON.parse( request.response );
  }
}

// HTML fixtures
function getHTMLFile( path ) {
  // For Karma, using fixtures
  if ( window.__html__ ) {
    return window.__html__[path];
  }
  // For Wallaby, serving files
  else {
    var request = new XMLHttpRequest();

    request.open( 'GET', path, false );
    request.send( null );

    return request.response;
  }
}

