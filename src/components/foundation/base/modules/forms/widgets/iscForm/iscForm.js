(function () {
  'use strict';

  angular.module('isc.forms')
    .directive('iscForm', iscForm);

  /* @ngInject */
  function iscForm($stateParams, $q,
                   iscSessionModel, iscNavContainerModel,
                   iscFormsModel, iscFormsValidationService, iscFormDataApi) {//jshint ignore:line
    var directive = {
      restrict        : 'E',
      replace         : true,
      controllerAs    : 'formCtrl',
      scope           : {
        formType           : '@',
        formKey            : '@',
        annotationsApi     : '=',
        mode               : '@',
        id                 : '@',
        additionalModelInit: '=',
        useOriginalFormKey : '='
      },
      bindToController: true,
      controller      : controller,
      templateUrl     : 'forms/widgets/iscForm/iscForm.html'
    };

    return directive;

    function controller() {
      var self = this;

      _.merge(self, {
        localFormKey          : self.formKey,
        formDefinition        : {},
        internalFormDefinition: {},
        validationDefinition  : {},
        additionalModels      : {},
        model                 : {},
        options               : {
          formState: {
            _mode: self.mode
          }
        }
      });


      // Empty stubs for annotations, to remove dependency
      function emptyAnnotationData() { return $q.when([]); }

      function emptyFunction() { }

      // Defaults if not provided
      self.annotationsApi = _.extend({
        getFormAnnotations    : emptyAnnotationData,
        closeAnnotationPanel  : emptyFunction,
        initAnnotationQueue   : emptyFunction,
        processAnnotationQueue: emptyFunction
      }, self.annotationsApi);

      self.validateFormApi = function () {
        return iscFormsValidationService.validateCollections(self.model, self.validationDefinition);
      };

      self.submitFormApi = submitForm;

      init();


      // Private/helper functions
      var originalFormKey;

      function init() {
        // Resolve default formKey if not provided,
        // and if not using formKey previously persisted with form
        if (!self.localFormKey && !(self.id && self.useOriginalFormKey)) {
          iscFormsModel.getActiveForm(self.formType).then(function (form) {
            self.localFormKey = form.formKey;
            getFormData();
          });
        }
        else {
          getFormData();
        }
      }

      function getFormData() {
        self.annotationsApi.initAnnotationQueue();

        if (self.id) {
          self.annotationsApi.getFormAnnotations(self.id).then(function (annotations) {
            self.options.formState._annotations = {
              index: self.id,
              data : annotations
            };
            iscFormDataApi.get(self.id).then(function (formData) {
              originalFormKey = formData.formKey;

              // Option to force using the formKey saved in the form previously
              if (!self.localFormKey && self.useOriginalFormKey) {
                self.localFormKey = originalFormKey;
              }
              self.model = formData.data;

              getFormDefinition();
            });
          });
        }
        else {
          getFormDefinition();
        }
      }

      function getFormDefinition() {
        iscFormsModel.getFormDefinition(self.localFormKey, self.mode)
          .then(function (formDefinition) {
            self.formDefinition                = formDefinition;
            self.options.formState._validateOn = formDefinition.validateOn;

            reconcileModelWithFormDefinition();

            populateAdditionalModels(self.formDefinition.form.dataModelInit);
          });
      }

      // If the original/persisted formKey differs from the formKey of the definition,
      // we need to process the implicit data model of the new formDefinition to ensure
      // it does not contain properties that are not supported by the new definition.
      function reconcileModelWithFormDefinition() {
        if (originalFormKey && originalFormKey != self.localFormKey) {
          var form = self.formDefinition.form,
              data = self.model;

          self.model = _mergeFormAndData();
        }

        /**
         * Prunes any properties in data that are not keyed by fields in form.
         * @returns {Object}
         * @private
         */
        function _mergeFormAndData() {
          var model = {};

          _.forEach(form.pages, function (page) {
            _processFields(page.fields);
          });

          return model;

          function _processFields(fields, parentPath, isCollection) {
            _.forEach(fields, function (field) {
              // Field groups are just arrays of fields
              if (field.fieldGroup) {
                _processFields(field.fieldGroup, parentPath, isCollection);
              }
              else {
                if (field.key) {
                  var key      = field.key,
                      fullPath = (parentPath ? parentPath + '.' : '') + key;
                  // templateOptions.fields is populated with subform fields for embedded forms
                  var embeddedFields = _.get(field, 'templateOptions.fields'),
                      isEfCollection = field.type === 'embeddedFormCollection' || field.extends === 'embeddedFormCollection';

                  if (embeddedFields) {
                    // If a collection, initialize the size of the new array to match data's size of this collection
                    if (isEfCollection) {
                      var sourceCollectionSize = _.get(data, fullPath, []).length;
                      if (sourceCollectionSize) {
                        _.set(model, fullPath, Array(sourceCollectionSize));
                        _.fill(model[fullPath], {});
                      }
                    }
                    _processFields(embeddedFields, fullPath, isEfCollection);
                  }
                  else {
                    // If saving a collection, iterate all items in data and save this verified property
                    if (isCollection) {
                      var sourceData = _.get(data, parentPath, []);

                      _.forEach(sourceData, function (item, index) {
                        var indexedKey = [parentPath, '[', index, ']', '.', key].join(''),
                            value      = _.get(data, indexedKey);
                        if (value != undefined) {
                          _.set(model, indexedKey, value);
                        }
                      });
                    }
                    else {
                      var value = _.get(data, key);

                      if (value != undefined) {
                        _.set(model, key, value);
                      }
                    }
                  }
                }
              }
            })
          }
        }
      }

      function populateAdditionalModels(fdnScript) {
        // If provided, call init function/expression to populate additional dynamic data models, such as patients
        evalScript(fdnScript);
        evalScript(self.additionalModelInit);

        getValidationDefinition();

        function evalScript(script) {
          if (script && _.isFunction(script)) {
            script(self.additionalModels, $stateParams);
          }
        }
      }

      function getValidationDefinition() {
        iscFormsModel.getValidationDefinition(self.localFormKey)
          .then(function (validationDefinition) {
            self.validationDefinition = validationDefinition;
            self.showInternal         = true;
          });
      }


      // Default api for submitting a form is to submit to formDataApi
      function submitForm() {
        var formDefinition = self.formDefinition.form;
        // Wrap data with additional information and metadata
        var formWrapper = {
          formDefinition  : formDefinition,
          additionalModels: self.additionalModels,
          formData        : {
            formKey    : self.localFormKey,
            formName   : formDefinition.name,
            formType   : formDefinition.formType,
            id         : self.id ? parseInt(self.id) : undefined,
            author     : iscSessionModel.getCurrentUser(),
            completedOn: moment().toISOString(),
            data       : self.model
          }
        };

        // Save form and return to dashboard
        // If an existing form, PUT; otherwise POST
        var saveCall;
        if (self.id) {
          saveCall = iscFormDataApi.put(parseInt(self.id), formWrapper).then(_updateAnnotations);
        }
        else {
          saveCall = iscFormDataApi.post(formWrapper).then(_updateAnnotations);
        }
        saveCall.then(function () {
          iscNavContainerModel.navigateToUserLandingPage();
        });

        function _updateAnnotations(form) {
          self.annotationsApi.processAnnotationQueue(form.id);
        }
      }
    }
  }
})();
