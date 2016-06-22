var suiteMain = {};

function createDirective( suite, html, scopeConfig ) {
  suite.$scope = suiteMain.$rootScope.$new();
  angular.extend( suite.$scope, angular.copy( scopeConfig ) );
  suite.element = suiteMain.$compile( html )( suite.$scope );
  digest( suite );
  suite.$isolateScope = suite.element.isolateScope();
  suite.controller    = suite.$isolateScope.formCtrl;
}

function getFormConfig( suite ) {
  return suite.controller.internalFormConfig;
}

function getButtonConfig( suite ) {
  return suite.controller.internalButtonConfig;
}

function getButton( suite, buttonName ) {
  return suite.element.find( '#' + buttonName + 'Button' );
}

function getControlByName( suite, controlKey ) {
  return suite.element.find( '[name*="' + controlKey + '"]' );
}

function digest( suite ) {
  suite.$scope.$digest();
  suiteMain.$timeout.flush();
}


// Form template generators
function getMinimalForm( formKey ) {
  return '<isc-form ' +
    'form-key="' + formKey + '" ' +
    '></isc-form>'
}

function getConfiguredForm() {
  return '<isc-form ' +
    'form-key="intake" ' +
    'form-data-id=""' +
    'form-version=""' +
    'mode="edit"' +
    'model="localModel"' +
    'form-config="localFormConfig"' +
    'button-config="localButtonConfig"' +
    '></isc-form>';
}

function getInternalForm() {
  return '<isc-form-internal ' +
    'form-definition="formCtrl.formDefinition"' +
    'model="formCtrl.model"' +
    'options="formCtrl.options"' +
    'button-config="formCtrl.internalButtonConfig"' +
    'form-config="formCtrl.internalFormConfig"' +
    'validate-form-api="formCtrl.validateFormApi"' +
    '></isc-form-internal>';
}

function getFormWithData() {
  return '<isc-form ' +
    'form-key="intake" ' +
    'form-data-id="2"' +
    'mode="view"' +
    '></isc-form>';
}