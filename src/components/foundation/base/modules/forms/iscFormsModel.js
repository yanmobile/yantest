(function () {
  'use strict';

  /* @ngInject */
  angular
    .module('isc.forms')
    .factory('iscFormsModel', iscFormsModel);

  /**
   * @ngdoc factory
   * @memberOf isc.forms
   * @param $q
   * @param $templateCache
   * @param $window
   * @param iscHttpapi
   * @param iscFormsCodeTableApi
   * @param iscFormsTemplateService
   * @param iscFormsApi
   * @returns {{getForms, getActiveForm, getActiveForms, setFormStatus: setFormStatus, getFormDefinition: getFormDefinition, getValidationDefinition: getValidationDefinition}}
     */
  function iscFormsModel($q, $templateCache, $window,
                         iscHttpapi,
                         iscFormsCodeTableApi, iscFormsTemplateService, iscFormsApi) {
    var _typeCache          = {};
    var _formsCache         = {};
    var _viewModeFormsCache = {};
    var _validationCache    = {};

    var defaultViewTemplateUrl  = 'forms/foundationTemplates/templates/defaultViewMode.html';
    var viewModePrefix          = '__viewMode__';
    var multipleActiveFormTypes = [];

    var getForms       = _.partial(getFormStatus, {
      returnMultiple: true,
      limitToActive : false
    });
    var getActiveForm  = _.partial(getFormStatus, {
      returnMultiple: false,
      limitToActive : true
    });
    var getActiveForms = _.partial(getFormStatus, {
      returnMultiple: true,
      limitToActive : true
    });

    return {
      getForms               : getForms,
      getActiveForm          : getActiveForm,
      getActiveForms         : getActiveForms,
      setFormStatus          : setFormStatus,
      getFormDefinition      : getFormDefinition,
      getValidationDefinition: getValidationDefinition
    };

    /**
     * @memberOf iscFormsModel
     * @param formType
     * @returns {*}
       */
    function getCachedType(formType) {
      var cachedType = _.get(_typeCache, formType);
      if (!cachedType) {
        cachedType = [];
        _.set(_typeCache, formType, cachedType);
      }
      return cachedType;
    }

    /**
     * @memberOf iscFormsModel
     * @param config
     * @param formType
     * @param formList
       * @returns {*}
       */
    function getFormStatus(config, formType, formList) {
      var allowMultiple = !!config.returnMultiple,
          limitToActive = !!config.limitToActive,
          cachedType    = getCachedType(formType);

      if (cachedType.length) {
        return $q.when(filterResults(cachedType));
      }
      else {
        var deferred = $q.defer();
        iscFormsApi.getActiveForms(formType).then(function (results) {
          _.set(_typeCache, formType, results);
          deferred.resolve(filterResults(results));
        });
        return deferred.promise;
      }

      function filterResults(array) {
        var filteredArray = limitToActive ? _.filter(array, { status: 'Active' }) : array;
        return allowMultiple ? filteredArray : _.first(filteredArray);
      }
    }

    /**
     * @memberOf iscFormsModel
     * @param formType
     * @param formStatus
     * @param formList
       * @returns {*}
       */
    function setFormStatus(formType, formStatus, formList) {
      var cache               = getCachedType(formType),
          allowMultipleActive = _.includes(multipleActiveFormTypes, formType),
          formStatuses        = [formStatus];

      // If multiple forms of this type are not allowed,
      // inactivate any currently active ones.
      if (!allowMultipleActive) {
        var existingFormsToInactivate = _.filter(formList, {
            formType: formType,
            status  : 'Active'
          }
        );
        _.forEach(existingFormsToInactivate, function (form) {
          if (form.formKey !== formStatus.formKey) {
            form.status = 'Inactive';
            formStatuses.push({
              formKey: form.formKey,
              status : 'Inactive'
            });
          }
        });
      }

      // Update the local cache, if it is populated
      if (cache.length) {
        _.forEach(formStatuses, function (form) {
          _.find(cache, { formKey: form.formKey }).status = form.status;
        });
      }

      // Submit to REST api
      return iscFormsApi.setFormStatus(formType, formStatuses);
    }

    /**
     * @memberOf iscFormsModel
     * @param formKey
     * @returns {*}
       */
    function getValidationDefinition(formKey) {
      var cachedValidation = _.get(_validationCache, formKey);
      var validations      = [];

      var deferred = $q.defer();

      if (cachedValidation) {
        deferred.resolve(cachedValidation);
      }
      else {
        getFormDefinition(formKey).then(function (form) {
          if (_.isArray(form)) {
            _getEmbeddedForms(form);
          }
          else {
            _.forEach(form.pages, function (page) {
              _getEmbeddedForms(page.fields);
            });
          }

          _validationCache[formKey] = validations;
          deferred.resolve(validations);
        });
      }

      return deferred.promise;

      function _getEmbeddedForms(fields) {
        _.forEach(fields, function (field) {
          if (field.fieldGroup) {
            _getEmbeddedForms(field.fieldGroup);
          }
          // If a collection, register it with the validation safety net
          else if (field.type === 'embeddedFormCollection') {
            validations.push({
              key   : field.key,
              fields: field.templateOptions.fields
            });
          }
        });
      }
    }

    /**
     * @memberOf iscFormsModel
     * @description
     * Gets the form with the given formKey name.
     * @param {String} formKey
     * @param {=String} mode
     * @param {=Object} subformDefinitions
     * @returns {Object}
     */
    function getFormDefinition(formKey, mode, subformDefinitions) {
      // If form is already cached, return the cached form in a promise
      var cachedForm;
      switch (mode) {
        case 'view':
          cachedForm = _.get(_viewModeFormsCache, formKey);
          break;

        default:
          cachedForm = _.get(_formsCache, formKey);
      }
      var deferred = $q.defer();

      if (cachedForm) {
        deferred.resolve(cachedForm);
        return deferred.promise;
      }

      // Otherwise, fetch the form template and resolve the form in a promise
      else {
        iscFormsApi.getFormDefinition(formKey).then(function (responseData) {
          var primaryPromises   = [],
              secondaryPromises = [],
              form              = responseData,
              subforms          = subformDefinitions || {};

          // Subform-only definitions are a bare array
          if (_.isArray(form)) {
            primaryPromises = primaryPromises.concat(_processFields(form));
          }
          else {
            _.forEach(form.pages, function (page) {
              primaryPromises = primaryPromises.concat(_processFields(page.fields));
            });
          }

          // If an FDN-specified dataModelInit function is indicated, fetch this as a user script
          if (form.dataModelInit) {
            var scriptPromise = iscFormsApi.getUserScript(form.dataModelInit)
              .then(function (response) {
                var script         = parseScript(response);
                form.dataModelInit = (function (iscHttpapi) {
                  return script;
                })();
                return true;
              });
            primaryPromises.push(scriptPromise);
          }

          // After all necessary template calls have completed, return the form
          $q.all(primaryPromises).then(function () {
            $q.all(secondaryPromises).then(function () {
              var editMode = {
                form    : form,
                subforms: subforms
              };

              // Cache the editable version
              _.set(_formsCache, formKey, editMode);

              // Make a deep copy for the view mode version
              var viewMode = {
                form    : angular.merge({}, form),
                subforms: subforms
              };

              // Replace templates in the view mode with readonly versions
              _.forEach(viewMode.form.pages, function (page) {
                replaceTemplates(page.fields);
              });

              // Cache it separately
              _.set(_viewModeFormsCache, formKey, viewMode);

              // Resolve the requested version
              switch (mode) {
                case 'view':
                  deferred.resolve(viewMode);
                  break;

                default:
                  deferred.resolve(editMode);
              }
            });
          });

          /**
           * @memberOf iscFormsModel
           * @description
           * Additional processing for fields to bind to the formly form.
           * @param fields
           * @returns {Array}
           * @private
           */
          function _processFields(fields) {
            var fieldPromises = [];
            _.forEach(fields, function (field) {
              var expProps    = _.get(field, 'expressionProperties', {}),
                  label       = _.get(field, 'templateOptions.label'),
                  type        = _.get(field, 'type'),
                  extendsType = _.get(field, 'extends'),
                  fieldGroup  = _.get(field, 'fieldGroup'),
                  data        = _.get(field, 'data', {});

              // A field group does not have its own type, but contains fields in the fieldGroup array
              if (fieldGroup) {
                fieldPromises = fieldPromises.concat(_processFields(fieldGroup));
              }

              // If type has not been specified, this is arbitrary html written into a template tag, so skip it.
              if (!type) {
                return true;
              }

              // If this is a nested form, recurse the process for its child fields
              if (type === 'embeddedForm' || type === 'embeddedFormCollection' ||
                extendsType === 'embeddedForm' || extendsType === 'embeddedFormCollection') {
                _processEmbeddedForm(field, data);
              }

              else {
                // If a user script is provided, this needs to be loaded and parsed
                if (data.userScript) {
                  _processUserScript(field, data.userScript);
                }

                // Create a translated expression property for each label
                var expLabel = expProps['templateOptions.label'];
                if (label && !expLabel) {
                  expLabel = expProps['templateOptions.label'] = '"' + label + '"';
                }
                if (expLabel && !_.isFunction(expLabel)) {
                  expProps['templateOptions.label'] += ' | translate';
                }
                _.set(field, 'expressionProperties', expProps);

                // If this field uses a code table, look it up and push it into the field's options
                if (data.codeTable) {
                  // Include any custom options for this field that have been explicitly entered
                  var explicitOptions = _.get(field, 'templateOptions.options', []);
                  _.set(field, 'templateOptions.options',
                    [].concat(explicitOptions).concat(iscFormsCodeTableApi.get(data.codeTable))
                  );
                }

                // If data.isObject is not set, infer object/primitive mode based on first option in options list
                var options = _.get(field, 'templateOptions.options', []);
                if (data.isObject === undefined && options) {
                  _.set(field, 'data.isObject', _.isObject(_.head(options)));
                }

                // If the type is not already registered, load it and register it with formly
                if (!iscFormsTemplateService.isTypeRegistered(type)) {
                  _getCustomTemplate(type);
                }
              }
            });
            return fieldPromises;

            function _processUserScript(field, scriptName) {
              var scriptPromise = iscFormsApi.getUserScript(scriptName)
                .then(function (response) {
                  var script = parseScript(response),
                      getApi = script.api.get;
                  // Expose iscHttpapi to api getter function
                  if (getApi) {
                    script.api.get = (function (iscHttpapi) {
                      return getApi;
                    })();
                  }
                  _.set(field, 'data.userModel', script);
                  return true;
                });
              primaryPromises.push(scriptPromise);
            }

            /**
             * Processes an embeddedForm or embeddedFormCollection
             * @private
             */
            function _processEmbeddedForm(field, data) {
              var embeddedType = data.embeddedType,
                  embeddedPage = data.embeddedPage,
                  isCollection = field.type === 'embeddedFormCollection' || field.extends === 'embeddedFormCollection';

              // If a linked type, look up that type and import the fields []
              if (embeddedType) {
                if (subforms[embeddedType] === undefined) {
                  if (isCollection) {
                    subforms[embeddedType] = [];
                  }

                  fieldPromises.push(
                    // Fetch the embedded type
                    getFormDefinition(embeddedType, mode, subforms)
                      .then(function (embeddedForm) {
                        var fields = [],
                            form   = embeddedForm.form;

                        // If this is a bare array of fields (subform-only definition),
                        // then the response form is only the fields [] for this form.
                        if (_.isArray(form)) {
                          fields = form;
                        }

                        // If this is a full form with page and form wrappers, we can only use a fields [] from it.
                        // If an embeddedPage was provided, use the fields [] from that page;
                        // otherwise, use the fields [] on the first page.
                        else {
                          var pages = form.pages,
                              page;

                          // Page lookup can be either a 0-based index or a page name
                          if (embeddedPage) {
                            if (_.isNumber(embeddedPage)) {
                              page = _.get(pages, embeddedPage);
                            }
                            else {
                              page = _.find(pages, { name: embeddedPage });
                            }
                          }
                          // If no page was provided, use the first one
                          else {
                            page = _.get(pages, '0');
                          }

                          fields = _.get(page, 'fields', []);
                        }

                        // Force inheritance of the data property
                        forceDataInheritance(fields);

                        if (isCollection) {
                          // Push a subform listener into the fields list
                          fields.push({
                            'type': 'embeddedFormListener'
                          });

                          // Update the subforms hash table
                          subforms[embeddedType] = fields;
                        }

                        // A non-collection embedded form is inlined in the parent form
                        else {
                          // Update the fields in this embedded form from the looked-up form
                          _.set(field, 'templateOptions.fields', fields);
                        }
                      })
                  );
                }

                fieldPromises = fieldPromises.concat(_processFields(_.get(field, 'templateOptions.fields')));
              }
            }
          }

          /**
           * @memberOf iscFormsModel
           * @description
           * Loads the template script and other assets for the given custom template name.
           * @param templateName
           * @private
           */
          function _getCustomTemplate(templateName) {
            var scriptPromise = iscFormsApi.getTemplate("js/" + templateName)
              .then(function (response) {
                _processScript(response);
                return true;
              });
            primaryPromises.push(scriptPromise);

            /**
             * @memberOf iscFormsModel
             * @description
             * Processes the javascript source for the custom template
             * @returns {Object}
             * @private
             */
            function _processScript(response) {
              var template = parseScript(response);

              _injectHtml(template);
              _injectCss();

              // TODO - load other assets such as images?

              // Register with formly
              iscFormsTemplateService.registerType(template);

              return template;
            }

            /**
             * @memberOf iscFormsModel
             * @description
             * Fetches html for the template and puts it in the $templateCache.
             * @private
             */
            function _injectHtml(template) {
              var templateHtml = template.templateUrl;

              // If a templateUrl is specified in the custom template,
              // and it has not been loaded yet, load and cache it now.
              if (templateHtml) {
                if (!$templateCache.get(templateHtml)) {
                  var htmlPromise = iscFormsApi.getTemplate('html/' + templateName + '/' + templateHtml)
                    .then(function (templateMarkup) {
                      $templateCache.put(templateHtml, templateMarkup);
                      return true;
                    });
                  secondaryPromises.push(htmlPromise);
                }
              }
            }

            /**
             * @memberOf iscFormsModel
             * @description
             * Fetches the stylesheet for the template and adds it to the page.
             * Adapted from: https://medium.com/opinionated-angularjs/angular-dynamically-injecting-css-file-using-route-resolve-and-promises-7bfcb8ccd05b#.djlx7z6on
             * but modified to write in a dynamic style tag rather than a static file.
             * @private
             */
            function _injectCss() {
              var cssPromise = iscFormsApi.getTemplate('css/' + templateName).then(
                function (stylesheet) {
                  // Stylesheet is optional and not specified by the FDN,
                  // so the only way to find out if there is one is to ask for it.
                  // Expect the server to send a 204 (not 404) if no stylesheet was found.
                  if (stylesheet) {
                    _stylesheetLoaded(stylesheet);
                  }
                }, _stylesheetNotFound);

              secondaryPromises.push(cssPromise);

              function _stylesheetLoaded(stylesheet) {
                if (!angular.element('style#' + templateName).length) {
                  var style = _createStyle(templateName, stylesheet);
                  angular.element('head').append(style);
                }
                return true;
              }

              function _stylesheetNotFound() {
                // This may happen if there is no custom stylesheet for this template
                // but the server is configured to send a 404.
                return true;
              }

              // Creates the style element
              function _createStyle(id, styles) {
                var style       = $window.document.createElement('style');
                style.id        = id;
                style.innerHTML = styles;
                return style;
              }
            }
          }
        });

        return deferred.promise;
      }
    }

    /**
     * @memberOf iscFormsModel
     * @description
     * Forces the data property on all fields to explicitly inherit data properties from ancestor(s).
     * This is only necessary on any fields inside an embeddedFormCollection, as this is the only template
     * that needs to operate on the raw fields array (for the tabular view of data).
     *
     * @param {Array} fields
     */
    function forceDataInheritance(fields) {
      _.forEach(fields, function (field) {
        if (field.fieldGroup) {
          forceDataInheritance(field.fieldGroup);
        }
        else if (field.type) {
          var data              = _.get(field, 'data', {});
          var ancestorDataStack = _.compact(_getAncestors(field.type)),
              ancestorData;

          while ((ancestorData = ancestorDataStack.pop()) !== undefined) {
            // Prefer the most local data to ancestral data
            _.merge(data, ancestorData, data);
          }

          _.set(field, 'data', data);
        }
      });

      /**
       * @memberOf iscFormsModel
       * @param type
       * @returns {Array}
         * @private
         */
      function _getAncestors(type) {
        var stack    = [],
            template = iscFormsTemplateService.getRegisteredType(type);
        if (template) {
          // If this ancestor has a data property, push it onto the stack
          var data = _.get(template, 'defaultOptions.data');
          if (data) {
            stack.push(data);
          }
          // If this ancestor has more ancestors, recurse through them
          if (template.extends) {
            stack = stack.concat(_getAncestors(template.extends));
          }
        }
        return stack;
      }
    }

    /**
     * @memberOf iscFormsModel
     * @description
     * Replaces the templates for each field in fields with its viewMode version.
     * @param fields
     */
    function replaceTemplates(fields) {
      _.forEach(fields, function (field) {
        if (field.fieldGroup) {
          replaceTemplates(field.fieldGroup);
        }
        else {
          var data            = _.get(field, 'data.viewMode', {}),
              viewTemplate    = data.template,
              viewTemplateUrl = data.templateUrl;
          if (viewTemplate) {
            field.template = viewTemplate;
          }
          else if (viewTemplateUrl) {
            field.templateUrl = viewTemplateUrl;
          }
          else {
            // Collections handle view mode on their own.
            // field.key is the data path into the model, so if this is not present,
            // there is no model (e.g., an "instructions" template or arbitrary html).
            if (field.type && field.type !== 'embeddedFormCollection' && field.key) {
              var viewModeType   = viewModePrefix + field.type;
              var registeredType = iscFormsTemplateService.getRegisteredType(viewModeType);
              if (!registeredType) {
                iscFormsTemplateService.registerType(
                  {
                    'name'       : viewModeType,
                    'extends'    : field.type,
                    'templateUrl': defaultViewTemplateUrl
                  }
                );
              }
              field.type = viewModeType;
              delete field.template;
              delete field.templateUrl;
            }
          }
        }
      });
    }

    /**
     * @memberOf iscFormsModel
     * @description
     *  This is only ever evaluated on scripts returned from a trusted backend REST source
     * @param script
     * @returns {Object}
       */
    function parseScript(script) {
      // Ignoring JSHint for eval()
      //
      return eval(script); // jshint ignore:line
    }
  }
})();
