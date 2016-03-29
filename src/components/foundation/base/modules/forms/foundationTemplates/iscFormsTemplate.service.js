(function () {
  'use strict';

  /**
   * Wraps the formlyConfig service:
   * registerBaseType should be called (once), then registerType may be used to register any other types.
   *
   * The base type provides common functionality for all formly templates and their controllers. This includes:
   *
   * _                  : makes lodash available in FDN expressions
   * moment             : makes moment available in FDN expressions
   * formModel          : a reference to the root formly model. This is useful for expressions that may need to modify
   *                      model values outside their own control or page scope
   * hasCustomValidator : a function that takes a custom validator name and returns whether that validator is used on
   *                      this control. This is useful for making custom validators reusable by defining them once on
   *                      the control template and then including them by name in controls that should use them.
   * getDefaultViewValue: a function that returns the display for a view mode field which uses the default view template.
   *
   */

  /* @ngInject */
  angular
      .module('isc.forms')
      .factory('iscFormsTemplateService',iscFormsTemplateService);

  /**
   * @ngdoc factory
   * @memberOf isc.forms
   * @param $filter
   * @param $window
   * @param $sce
   * @param appConfig
   * @param formlyConfig
   * @param hsModelUtils
   * @returns {{isTypeRegistered: isTypeRegistered, getRegisteredType: getRegisteredType, registerWrapper: *, registerBaseType: registerBaseType, registerType: registerType, appendWrapper: appendWrapper}}
   */
  /* @ngInject */
  function iscFormsTemplateService($filter, $window, $sce, appConfig, formlyConfig, hsModelUtils) {
    var baseType = '__iscFormsBase__';

    // YYYY-MM-DDThh:mm:ss.xxxZ   or
    // YYYY-MM-DD hh:mm:ss
    var isoRE = /^\d{4}[-\/]{1}\d{2}[-\/]{1}\d{2}[T ]{1}\d{2}:{1}\d{2}:{1}\d{2}(.{1}\d{3}Z{1})?$/;

    formlyConfig.extras.fieldTransform.push(addDataModelDependencies);

    var service = {
      isTypeRegistered : isTypeRegistered,
      getRegisteredType: getRegisteredType,
      registerWrapper  : formlyConfig.setWrapper,
      registerBaseType : registerBaseType,
      registerType     : registerType,
      appendWrapper    : appendWrapper
    };

    return service;

    /**
     *
     * @param fields
     * @returns {*}
     */
    function addDataModelDependencies(fields) {
      _.forEach(fields, function (field) {
        if (field.fieldGroup) {
          addDataModelDependencies(field.fieldGroup);
        }
        else if (field.key) {
          field.modelOptions = {
            // Set ng-model-options.updateOn:blur to limit excessive validation
            //updateOn    : 'blur',
            // Debounce for UI responsiveness if updating on change
            debounce    : 75,
            // Allow invalid so external validations can use the form model for evaluation
            allowInvalid: true
          };

          var validators = field.validators || (field.validators = {});
          // Executes external/HS validation api
          validators.hsValidation = {
            expression: 'hsValidation.getError(options.key)',
            message   : 'hsValidation.$error.text'
          };
        }
      });
      return fields;
    }

    /**
     *
     * @param type
     * @returns {boolean}
     */
    function isTypeRegistered(type) {
      return !!getRegisteredType(type);
    }

    /**
     *
     * @param type
     * @returns {*}
     */
    function getRegisteredType(type) {
      return formlyConfig.getType(type);
    }

    /**
     *
     */
    function registerBaseType() {
      // Base type overrides
      formlyConfig.setType({
        name      : baseType,
        controller: /* @ngInject */ function ($scope, iscNotificationService) {
          iscNotificationService.registerFieldScope($scope);

          var formlyRootCtrl = getFormlyRoot($scope);

          // Validation for external/HS api
          var removeWatch = $scope.$watch(
              // Wait for formControl to be populated
              function () {
                return $scope.options.formControl;
              },
              // Configure a listener for that ngModel and drop the watch
              function (ngModelController) {
                if (ngModelController) {
                  removeWatch();
                  var formDef    = formlyRootCtrl.formDefinition,
                  // Pull the hsValidation params from the form level
                  // This may need to support field-level modules and recordNames in the future
                      moduleName = formDef.hsValidationModule,
                      recordName = formDef.hsValidationRecordName;

                  _.extend(hsValidation, {
                    module    : $window[moduleName],
                    recordName: recordName
                  });

                  if (hsValidation.module && hsValidation.recordName && ngModelController.$viewChangeListeners) {
                    ngModelController.$viewChangeListeners.push(
                        function () {
                          hsModelUtils.validateRecord(
                              hsValidation.module,
                              // Currently passing the root form model
                              // this may need to be scoped to subforms or sections
                              $scope.formModel,
                              hsValidation.recordName
                          );
                        }
                    );
                  }
                }
              }
          );

          // Validation show condition
          switch ($scope.formOptions.formState._validateOn) {
            case 'blur':
              $scope.validationShowCondition = '$touched';
              break;

            case 'submit':
              $scope.validationShowCondition = '$submitted';
              break;

            // Default is to validate on $dirty
            default:
              $scope.validationShowCondition = '$dirty';
              break;
          }

          // External/HS validation
          var hsValidation = {
            getError: function (spec) {
              if (hsValidation.module) {
                hsValidation.$error = hsModelUtils.getError(
                    hsValidation.module,
                    // hsModelUtils.getError expects the root of the spec to be the recordName
                    [hsValidation.recordName, spec].join('.')
                );
                return !hsValidation.$error;
              }
              return true;
            },
            $error  : ''
          };

          // Annotations
          var annotationsState   = $scope.formOptions.formState._annotations;
          var annotationsContext = getAnnotationContext();
          var annotationsData    = getAnnotationData(annotationsContext);
          var annotationMetadata = {
            type     : 'field',
            formKey  : formlyRootCtrl.formDefinition.formKey,
            formType : formlyRootCtrl.formDefinition.formType,
            formName : formlyRootCtrl.formDefinition.name,
            fieldName: $scope.to.label,

            // formId will not be available for unsubmitted, new forms
            // Ensure they are up to date when submitting queued annotations
            formId: parseInt(annotationsState.index)
          };

          // Inject utilities so they are available in FDN expressions
          _.extend($scope, {
            // Libraries
            _     : _,
            moment: moment,

            // Utility properties
            formModel       : formlyRootCtrl.model,
            additionalModels: formlyRootCtrl.additionalModels,
            mode            : formlyRootCtrl.mode,

            // Utility functions
            hasCustomValidator : hasCustomValidator,
            getDefaultViewValue: getDefaultViewValue,

            // HS validation
            hsValidation: hsValidation,

            // Annotations state
            annotations       : {
              context: annotationsContext,
              data   : annotationsData
            },
            allAnnotations    : formlyRootCtrl.options.formState._annotations.data,
            annotationMetadata: annotationMetadata
          });


          // Helper functions
          function getFormlyRoot(scope) {
            if (scope.formInternalCtrl) {
              return scope.formInternalCtrl;
            }
            var parent = scope.$parent;
            if (parent) {
              return getFormlyRoot(parent);
            }
            return {};
          }

          function hasCustomValidator(validatorName) {
            var customValidators = _.get($scope, 'options.data.validators');
            return customValidators && !!_.includes(customValidators, validatorName);
          }

          function getDefaultViewValue() {
            var value = _.get($scope.model, $scope.options.key);

            if (_.isObject(value)) {
              var displayField = _.get($scope.options, 'data.displayField', 'name');
              return wrap(value[displayField]);
            }
            else {
              if (value && isoRE.test(value)) {
                var mValue = moment(value);
                if (mValue.isValid()) {
                  return wrap($filter('iscDate')(mValue, _.get(appConfig, 'formats.date.shortDate', 'date')));
                }
              }
              return wrap(value);
            }

            function wrap(value) {
              if (value === undefined) {
                return $sce.trustAsHtml('<p class="not-specified">Not specified</p>');
              }
              else {
                return $sce.trustAsHtml('<p>' + value + '</p>');
              }
            }
          }

          function getAnnotationContext() {
            // If the context property has been set, this is a field on a subform
            if (annotationsState.context) {
              // This means it has a containing context for the parent
              // Contexts are nested instances of the same object type
              var container = _.merge({}, annotationsState.context);
              while (container.context !== undefined) {
                container = container.context;
              }

              // Set the inner context for just this field
              container.context = makeContext('item');

              return container;
            }

            // Otherwise it is on the root form
            else {
              return makeContext('form');
            }

            function makeContext(type) {
              return {
                type     : type,
                isQueued : annotationsState.index === undefined ? true : undefined,
                contextId: parseInt(annotationsState.index),
                key      : $scope.options.key
              };

            }
          }

          function getAnnotationData(context) {
            return $filter('iscFormsContext')(annotationsState.data, context);
          }
        }
      });
    }

    /**
     *
     * @param type
     */
    function registerType(type) {
      // Ensure all templates extend the base type for functionality
      type.extends = type.extends || baseType;
      formlyConfig.setType(type);
    }

    /**
     *
     * @param wrapperName
     * @param templateName
     */
    function appendWrapper(wrapperName, templateName) {
      var template = getRegisteredType(templateName),
          wrappers = _.get(template, 'wrapper', []);
      if (!_.includes(wrappers, wrapperName)) {
        wrappers.push(wrapperName);
        _.set(template, 'wrapper', wrappers);
        registerType(template);
      }
    }

  }
})();
