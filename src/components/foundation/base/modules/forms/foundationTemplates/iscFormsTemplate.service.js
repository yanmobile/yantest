(function() {
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
    .module( 'isc.forms' )
    .factory( 'iscFormsTemplateService', iscFormsTemplateService );

  /**
   * @ngdoc factory
   * @memberOf isc.forms
   * @name iscFormsTemplateService
   * @param $filter
   * @param $window
   * @param $sce
   * @param iscCustomConfigService
   * @param formlyConfig
   * @param hsModelUtils
   * @returns {{isTypeRegistered: isTypeRegistered, getRegisteredType: getRegisteredType, registerWrapper: *, registerBaseType: registerBaseType, registerType: registerType, appendWrapper: appendWrapper}}
   * @description
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
  function iscFormsTemplateService( $filter, $window, $sce, iscCustomConfigService, formlyConfig, hsModelUtils ) {
    var baseType = '__iscFormsBase__';

    var config           = iscCustomConfigService.getConfig(),
        formsConfig      = _.get( config, 'forms', {} ),
        updateOnExcluded = formsConfig.updateOnExcluded,
        widgetLibrary    = [];

    // YYYY-MM-DDThh:mm:ss.xxxZ   or
    // YYYY-MM-DD hh:mm:ss
    var isoRE = /^\d{4}[-\/]{1}\d{2}[-\/]{1}\d{2}[T ]{1}\d{2}:{1}\d{2}:{1}\d{2}(.{1}\d{3}Z{1})?$/;

    formlyConfig.extras.fieldTransform.push( addDataModelDependencies );

    var service = {
      isTypeRegistered   : isTypeRegistered,
      isWrapperRegistered: isWrapperRegistered,
      getRegisteredType  : getRegisteredType,
      registerWrapper    : formlyConfig.setWrapper,
      registerBaseType   : registerBaseType,
      registerType       : registerType,
      appendWrapper      : appendWrapper,
      getWidgetList      : getWidgetList
    };

    return service;

    /**
     * @memberOf iscFormsTemplateService
     * @param fields
     * @returns {*}
     */
    function addDataModelDependencies( fields ) {
      _.forEach( fields, function( field ) {
        if ( field.fieldGroup ) {
          addDataModelDependencies( field.fieldGroup );
        }
        else if ( field.key ) {
          field.modelOptions = {
            // Set ng-model-options.updateOn:blur to limit excessive validation
            updateOn    : excludeUpdateOn( field.type ) ? undefined : formsConfig.updateOn,
            // Debounce for UI responsiveness if updating on change
            debounce    : formsConfig.debounce,
            // Allow invalid so external validations can use the form model for evaluation
            allowInvalid: formsConfig.allowInvalid
          };

          var validators          = field.validators || ( field.validators = {} );
          // Executes external/HS validation api
          validators.hsValidation = {
            expression: 'hsValidation.getError(options.key)',
            message   : 'hsValidation.$error.text'
          };
        }
      } );
      return fields;
    }

    /**
     * @memberOf iscFormsTemplateService
     * @param type - The formly type to check
     * @returns {boolean} - Whether the given type should always use the default updateOn behavior
     */
    function excludeUpdateOn( type ) {
      if ( _.includes( updateOnExcluded, type ) ) {
        return true;
      }
      // If no match, check the type hierarchy above this type
      var baseType = _.get( getRegisteredType( type ), 'extends' );
      return !!baseType && excludeUpdateOn( baseType );
    }

    /**
     * @memberOf iscFormsTemplateService
     * @param type
     * @returns {boolean}
     */
    function isTypeRegistered( type ) {
      return !!getRegisteredType( type );
    }

    /**
     * @memberOf iscFormsTemplateService
     * @param wrapper
     * @returns {boolean}
     */
    function isWrapperRegistered( wrapper ) {
      return !!formlyConfig.getWrapper( wrapper );
    }

    /**
     * @memberOf iscFormsTemplateService
     * @param type
     * @returns {*}
     */
    function getRegisteredType( type ) {
      return formlyConfig.getType( type );
    }

    /**
     * @memberOf iscFormsTemplateService
     */
    function registerBaseType() {
      // Base type overrides
      formlyConfig.setType( {
        name      : baseType,
        controller: /* @ngInject */ function( $scope, iscNotificationService ) {
          iscNotificationService.registerFieldScope( $scope );

          var formlyRootCtrl = getFormlyRoot( $scope );

          // Validation for external/HS api
          var removeWatch = $scope.$watch(
            // Wait for formControl to be populated
            function() {
              return $scope.options.formControl;
            },
            // Configure a listener for that ngModel and drop the watch
            function( ngModelController ) {
              if ( ngModelController ) {
                removeWatch();
                var formDef    = formlyRootCtrl.formDefinition,
                    // Pull the hsValidation params from the form level
                    // This may need to support field-level modules and recordNames in the future
                    moduleName = formDef.hsValidationModule,
                    recordName = formDef.hsValidationRecordName;

                _.extend( hsValidation, {
                  module    : $window[moduleName],
                  recordName: recordName
                } );

                if ( hsValidation.module && hsValidation.recordName && ngModelController.$viewChangeListeners ) {
                  ngModelController.$viewChangeListeners.push(
                    function() {
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
          switch ( $scope.formOptions.formState._validateOn ) {
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
            getError: function( spec ) {
              if ( hsValidation.module ) {
                hsValidation.$error = hsModelUtils.getError(
                  hsValidation.module,
                  // hsModelUtils.getError expects the root of the spec to be the recordName
                  [hsValidation.recordName, spec].join( '.' )
                );
                return !hsValidation.$error;
              }
              return true;
            },
            $error  : ''
          };

          // Annotations
          var annotationsState   = $scope.formOptions.formState._annotations;
          var annotationsConfig  = getAnnotationConfig();
          var annotationsContext = getAnnotationContext();
          var annotationsData    = getAnnotationData( annotationsContext );
          var annotationMetadata = {
            type     : 'field',
            formKey  : formlyRootCtrl.formDefinition.formKey,
            formType : formlyRootCtrl.formDefinition.formType,
            formName : formlyRootCtrl.formDefinition.name,
            fieldName: $scope.to.label,

            // formId will not be available for unsubmitted, new forms
            // Ensure they are up to date when submitting queued annotations
            formId: parseInt( annotationsState.index )
          };

          // Inject utilities so they are available in FDN expressions
          _.extend( $scope, {
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
              config : annotationsConfig,
              context: annotationsContext,
              data   : annotationsData
            },
            allAnnotations    : formlyRootCtrl.options.formState._annotations.data,
            annotationMetadata: annotationMetadata
          } );

          // Helper functions
          function getFormlyRoot( scope ) {
            if ( scope.formInternalCtrl ) {
              return scope.formInternalCtrl;
            }
            var parent = scope.$parent;
            if ( parent ) {
              return getFormlyRoot( parent );
            }
            return {};
          }

          function hasCustomValidator( validatorName ) {
            var customValidators = _.get( $scope, 'options.data.validators' );
            return customValidators && !!_.includes( customValidators, validatorName );
          }

          function getDefaultViewValue() {
            var value = _.get( $scope.model, $scope.options.key );

            if ( _.isObject( value ) ) {
              var displayField = _.get( $scope.options, 'data.displayField', 'name' );
              return wrap( value[displayField] );
            }
            else {
              if ( value && isoRE.test( value ) ) {
                var mValue = moment( value );
                if ( mValue.isValid() ) {
                  return wrap( $filter( 'iscDate' )( mValue, _.get( config, 'formats.date.shortDate', 'date' ) ) );
                }
              }
              return wrap( value );
            }

            function wrap( value ) {
              if ( value === undefined ) {
                return $sce.trustAsHtml( '<p class="not-specified">Not specified</p>' );
              }
              else {
                return $sce.trustAsHtml( '<p>' + value + '</p>' );
              }
            }
          }

          function getAnnotationConfig() {
            return _.get( formlyRootCtrl, 'formDefinition.form.annotations', {} );
          }

          function getAnnotationContext() {
            // If the context property has been set, this is a field on a subform
            if ( annotationsState.context ) {
              // This means it has a containing context for the parent
              // Contexts are nested instances of the same object type
              var container = _.merge( {}, annotationsState.context );
              while ( container.context !== undefined ) {
                container = container.context;
              }

              // Set the inner context for just this field
              container.context = makeContext( 'item' );

              return container;
            }

            // Otherwise it is on the root form
            else {
              return makeContext( 'form' );
            }

            function makeContext( type ) {
              var contextId = parseInt( annotationsState.index );
              return {
                type     : type,
                isQueued : annotationsState.index === undefined ? true : undefined,
                contextId: _.isNaN( contextId ) ? null : contextId,
                key      : $scope.options.key
              };

            }
          }

          function getAnnotationData( context ) {
            return $filter( 'iscFormsContext' )( annotationsState.data, context );
          }
        },

        link: function( scope, element, attrs ) {
          // If the field's data.hideIfGroupEmpty property is truthy,
          // this field will be hidden if all of its sibling fields are hidden.
          // This is useful for section headers within a fieldGroup,
          // where all members of that section have different hideExpressions.
          if ( _.get( scope, 'options.data.hideIfGroupEmpty' ) ) {
            var unregisterModelWatch = scope.$watch(
              'model',
              onModelChange,
              true
            );
            scope.$on( '$destroy', unregisterModelWatch );
          }

          function onModelChange() {
            // $applyAsync to allow slightly more time for other fields' hideExpressions to be evaluated
            // The other fields are the ones checked as element.siblings()
            scope.$applyAsync( function() {
              element.css( 'display', element.siblings( '[formly-field]' ).length ? 'block' : 'none' );
            } );
          }
        }
      } );
    }

    /**
     * @memberOf iscFormsTemplateService
     * @param type
     */
    function registerType( type, options ) {
      // Ensure all templates extend the base type for functionality
      type.extends     = type.extends || baseType;
      type.overwriteOk = true;
      options          = options || {};

      if ( !options.excludeFromWidgetLibrary ) {
        widgetLibrary.push( type.name );
      }
      formlyConfig.setType( type );
    }

    /**
     * @memberOf iscFormsTemplateService
     */
    function getWidgetList() {
      return angular.copy( widgetLibrary );
    }

    /**
     * @memberOf iscFormsTemplateService
     * @param wrapperName
     * @param templateName
     */
    function appendWrapper( wrapperName, templateName ) {
      var template = getRegisteredType( templateName ),
          wrappers = _.get( template, 'wrapper', [] );
      if ( !_.includes( wrappers, wrapperName ) ) {
        wrappers.push( wrapperName );
        _.set( template, 'wrapper', wrappers );
        registerType( template );
      }
    }

  }
})();
