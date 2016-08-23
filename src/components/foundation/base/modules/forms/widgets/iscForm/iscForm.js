(function() {
  'use strict';

  angular.module( 'isc.forms' )
    .directive( 'iscForm', iscForm );

  /**
   * @ngdoc directive
   * @memberOf isc.forms
   * @param $stateParams
   * @param $q
   * @param $window
   * @param iscSessionModel
   * @param iscNavContainerModel
   * @param iscFormsModel
   * @param iscFormsValidationService
   * @param iscFormDataApi
   * @returns {{restrict: string, replace: boolean, controllerAs: string, scope: {formKey: string, mode: string, formDataId: string, formVersion: string, model: string, formConfig: string, buttonConfig: string}, bindToController: boolean, controller: controller, templateUrl: directive.templateUrl}}
   * @description
   *    * iscForm - A directive for displaying a form
   *
   * Parameters:
   *
   * formKey    : The unique identifier for the form definition.
   * mode       : 'edit' or 'view'
   * formVersion: If provided, requests this specific version of the form definition.
   * formDataId : If provided, form data with this value is retrieved and loaded into this form instance.
   * model      : If provided, this is used as the form data model.
   *
   * formConfig : A configuration object that may include some or all of the following behavior configuration:
   *   additionalModelInit
   *     A function or expression to be invoked during form init, which may populate additional data models.
   *
   *   annotationsApi
   *     The API to use for annotations in this form, if applicable. These properties may be defined:
   *       getFormAnnotations
   *       closeAnnotationPanel
   *       initAnnotationQueue
   *       processAnnotationQueue
   *     Default: none
   *
   *   forceFdn
   *     An object to use for overriding any form-level properties that would be delivered from the form
   *     definition API call, such as annotations, autosave behavior, or page layout.
   *     Default: none
   *
   *   formDataApi
   *     The API to use when persisting data from this form. These properties may be defined:
   *       wrap  : The function to use to wrap the form data with metadata, before submitting it to the API.
   *               Called with two arguments:
   *                 formData       (this.internalModel)
   *                 formDefinition (this.formDefinition)
   *       unwrap: The function to use to unwrap form data returned from load.
   *               Called with one argument:
   *                 responseData   (the result from calling load)
   *       load  : The function call that will query for the initial form data.
   *               Called with one argument:
   *                 id       (this.formDataId)
   *       save  : The function call that will persist data in this form.
   *               Called with two arguments:
   *                 formData (the model payload for this form: this.internalModel)
   *                 id       (this.formDataId)
   *       urls  : An object for overriding the API endpoints for form data. These may be absolute or relative urls.
   *               These properties may be defined:
   *         get   : overrides the endpoint for iscFormDataApi.get
   *         post  : overrides the endpoint for iscFormDataApi.post
   *         put   : overrides the endpoint for iscFormDataApi.put
   *         delete: overrides the endpoint for iscFormDataApi.delete
   *         list  : overrides the endpoint for iscFormDataApi.list
   *
   *     Defaults:
   *       wrap:   A function that includes the following properties in the save call:
   *         formDefinition  : this.formDefinition,
   *         additionalModels: this.formConfig.additionalModels,
   *         formData        : {
   *           formKey    : this.formKey,
   *           formName   : this.formDefinition.name,
   *           id         : this.formDataId,
   *           author     : iscSessionModel.getCurrentUser(),
   *           completedOn: moment().toISOString(),
   *           data       : this.internalModel
   *         }
   *       unwrap: A function that returns responseData.data.
   *       load  : If this.formDataId is defined, call iscFormDataApi.get and update this.internalModel.
   *               Otherwise, use a new empty object.
   *       save  : If this.formDataId is undefined, call iscFormDataApi.post and update this.formDataId.
   *               Otherwise, call iscFormDataApi.put.
   *       urls  : None
   *
   * buttonConfig : A configuration object for form button configuration. This is an object with
   *   properties that represent buttons at the end of the main (parent) form.
   *   By default, the following two buttons are defined:
   *
   *   cancel
   *     configuration for the cancel button
   *     Defaults:
   *       afterClick: goes back one page in the browser history
   *       cssClass  : 'cancel button large float-left'
   *       text      : if mode is 'view', 'Forms_Back_Button', else 'Forms_Cancel_Button'
   *       order     : 1
   *
   *   submit
   *     configuration for the submit button
   *       Note: clicking the submit button always invokes the form's validation
   *       mechanism and only calls onClick if validation succeeds.
   *     Defaults:
   *       onClick   : calls formConfig.formDataApi.save
   *       afterClick: returns the user to his or her landing page
   *       cssClass  : 'button large float-right'
   *       text      : 'Forms_Submit_Button'
   *       hide      : hidden if mode is 'view'
   *       order     : 2
   *
   *   [other properties]
   *     configuration for other buttons at the bottom of the form
   *     Defaults: none
   *
   *
   *   button configurations are objects with the following properties:
   *     onClick    : a function to call when the button is clicked
   *     afterClick : a function callback called after the button click event has completed
   *     cssClass   : css styles to apply to the button
   *     text       : an i18n translation key or literal text to render on the button
   *     order      : order in which to render the button
   *     hide       : if truthy, the button will not be rendered in the UI.
   *                  This property may be defined as a primitive or as a function.
   *
   * @example
   *   Example usages:
   *
   *   to change the text of the submit button to "Complete" and add a "Home" button in the middle:
   *     buttonConfig : {
   *       submit : {
   *         text  : 'Complete',
   *         order : 3
   *       },
   *       home : {
   *         text    : 'Back Home',
   *         cssClass: 'button',
   *         onClick : function() {
   *           // ... custom business logic
   *         },
   *         order   : 2
   *       }
   *     }
   *
   *   to change the API endpoint for submitting data for just this form:
   *     formDataApi: {
   *       urls: {
   *         put : {
   *           url: "api/v1/alternateFormDataApi"
   *         },
   *         post: {
   *           url: "api/v1/alternateFormDataApi"
   *         }
   *       }
   *     }

   */
  /* @ngInject */
  function iscForm( $stateParams, $q, $window,
    iscSessionModel, iscNavContainerModel,
    iscFormsModel, iscFormsValidationService,
    iscFormDataApi, iscFormsTemplateService ) {//jshint ignore:line
    var directive = {
      restrict        : 'E',
      replace         : true,
      controllerAs    : 'formCtrl',
      scope           : {
        buttonConfig: '=',
        formConfig  : '=',
        formDataId  : '@?',
        formKey     : '@?',
        formVersion : '@?',
        mode        : '@',
        model       : '=?'
      },
      bindToController: true,
      controller      : controller,
      templateUrl     : function( elem, attrs ) {
        return attrs.templateUrl || 'forms/widgets/iscForm/iscForm.html';
      }
    };

    return directive;

    /**
     * @memberOf iscForm
     */
    function controller() {
      var self = this;

      var defaultFormConfig   = getFormDefaults( self.formConfig );
      self.internalFormConfig = _.defaultsDeep( self.formConfig || {}, defaultFormConfig );

      var defaultButtonConfig   = getButtonDefaults();
      self.internalButtonConfig = _.defaultsDeep( self.buttonConfig || {}, defaultButtonConfig );

      // Ensure id is either numeric or undefined (if passed directly from a route param, it could be a string)
      var parsedId          = parseInt( self.formDataId );
      self.parsedFormDataId = _.isNaN( parsedId ) ? undefined : parsedId;

      _.merge( self, {
        formDefinition        : {},
        internalFormDefinition: {},
        validationDefinition  : [],
        internalModel         : self.model || {},
        options               : {
          formState: {
            _mode: self.mode,
            _id  : self.parsedFormDataId,
            // _lib is populated during init()
            _lib : {}
          }
        }
      } );

      // Empty stubs for annotations, to remove dependency
      /**
       * @memberOf iscForm
       * @returns {*}
       */
      function emptyAnnotationData() {
        return $q.when( [] );
      }

      self.validateFormApi = function() {
        return iscFormsValidationService.validateCollections( self.internalModel, self.validationDefinition );
      };

      init();

      /**
       * @memberOf iscForm
       * @param formConfig - The formConfig for the directive
       * @returns {{annotationsApi: {getFormAnnotations: function, closeAnnotationPanel: function, initAnnotationQueue: function, processAnnotationQueue: function}, additionalModels: {}}}
       */
      function getFormDefaults( formConfig ) {
        // Empty annotations API if not provided
        var annotationsApi = {
          getFormAnnotations    : emptyAnnotationData,
          closeAnnotationPanel  : _.noop,
          initAnnotationQueue   : _.noop,
          processAnnotationQueue: _.noop
        };

        // Defaults for formDataApi property -- use iscFormDataApi
        var formDataApi = {
          wrap  : wrapDefault,
          unwrap: unwrapDefault,
          load  : loadDefault,
          save  : saveDefault,
          submit: submitDefault
        };

        return {
          annotationsApi  : annotationsApi,
          formDataApi     : formDataApi,
          additionalModels: {}
        };

        function wrapDefault( formData, formDefinition ) {
          // Wrap data with additional information and metadata
          return {
            formDefinition  : formDefinition,
            additionalModels: self.internalFormConfig.additionalModels,
            formData        : {
              formKey    : self.formKey,
              formName   : formDefinition.name,
              formVersion: self.formVersion,
              id         : self.parsedFormDataId,
              author     : iscSessionModel.getCurrentUser(),
              completedOn: moment().toISOString(),
              data       : formData
            }
          };
        }

        function unwrapDefault( responseData ) {
          return _.get( responseData, 'data', {} );
        }

        function loadDefault( id ) {
          if ( id !== undefined ) {
            return iscFormDataApi.get( id, getConfiguredUrl( 'get' ) );
          }
          else {
            return $q.when( {} );
          }
        }

        function saveDefault( formData, id ) {
          var annotationsApi = self.internalFormConfig.annotationsApi;

          if ( id !== undefined ) {
            return iscFormDataApi.put( id, formData, getConfiguredUrl( 'put' ) )
              .then( function( form ) {
                annotationsApi.processAnnotationQueue( form.id );
                return form;
              } );
          }
          else {
            return iscFormDataApi.post( formData, getConfiguredUrl( 'post' ) )
              .then( function( form ) {
                self.parsedFormDataId = self.options.formState._id = form.id;
                annotationsApi.processAnnotationQueue( form.id );
                return form;
              } );
          }
        }

        function submitDefault( formData, id ) {
          var annotationsApi = self.internalFormConfig.annotationsApi;

          return iscFormDataApi.submit( id, formData, getConfiguredUrl( 'submit' ) )
            .then( function( form ) {
              self.parsedFormDataId = self.options.formState._id = form.id;
              annotationsApi.processAnnotationQueue( form.id );
              return form;
            } );
        }

        function getConfiguredUrl( verb ) {
          return _.get( formConfig, 'formDataApi.urls.' + verb );
        }
      }

      /**
       * @memberOf iscForm
       * @returns {{cancel: {onClick: function, afterClick: function, cssClass: string, text: string}, submit: {onClick: function, afterClick: function, cssClass: string, text: string}}}
       */
      function getButtonDefaults() {
        return {
          cancel: {
            onClick   : _.noop,
            afterClick: afterCancel,
            cssClass  : 'cancel button large float-left',
            text      : self.mode === 'view' ? 'Forms_Back_Button' : 'Forms_Cancel_Button'
          },
          submit: {
            onClick   : onSubmit,
            afterClick: afterSubmit,
            cssClass  : 'button large float-right',
            text      : 'Forms_Submit_Button',
            hide      : self.mode === 'view'
          }
        };

        /**
         * @memberOf iscForm
         */
        function onSubmit() {
          var configuredDataApi = self.internalFormConfig.formDataApi;

          // Default api for submitting a form is to submit to iscFormDataApi
          var wrappedData = configuredDataApi.wrap( self.internalModel, self.formDefinition.form );
          return configuredDataApi.submit( wrappedData, self.parsedFormDataId );
        }

        /**
         * @memberOf iscForm
         */
        function afterSubmit() {
          iscNavContainerModel.navigateToUserLandingPage();
        }

        /**
         * @memberOf iscForm
         */
        function afterCancel() {
          $window.history.back();
        }

      }

      /**
       * @memberOf iscForm
       */
      function init() {
        getFormData();
      }

      /**
       * @memberOf iscForm
       */
      function getFormData() {
        var config      = self.internalFormConfig,
            formDataApi = config.formDataApi;

        config.annotationsApi.initAnnotationQueue();
        getAnnotationData()
          .then( function() {
            if ( _.isEmpty( self.internalModel ) ) {
              return formDataApi.load( self.parsedFormDataId )
                .then( function( formData ) {
                  self.internalModel = formDataApi.unwrap( formData ) || {};
                  return true;
                } );
            }
            else {
              return true;
            }
          } )
          .then( getFormDefinition );
      }

      /**
       * @memberOf iscForm
       * @returns {*}
       */
      function getAnnotationData() {
        var getApi = _.get( self.internalFormConfig, 'annotationsApi.getFormAnnotations' );

        if ( getApi && _.isFunction( getApi ) ) {
          return getApi( self.parsedFormDataId ).then( function( annotations ) {
            self.options.formState._annotations = {
              index: self.parsedFormDataId,
              data : annotations
            };
            return annotations;
          } );
        }
        else {
          return $q.when( [] );
        }
      }

      /**
       * @memberOf iscForm
       */
      function getFormDefinition() {
        iscFormsModel.getFormDefinition( {
          formKey    : self.formKey,
          mode       : self.mode,
          formLiteral: self.internalFormConfig.formLiteral,
          formVersion: self.formVersion
        } )
          .then( function( formDefinition ) {
            self.formDefinition                = formDefinition;
            self.options.formState._validateOn = formDefinition.form.validateOn;

            populateAdditionalModels( self.formDefinition.form.additionalModelInit );
            initializeUserLibrary( self.formDefinition.form.library );

            getValidationDefinition();
          } );
      }

      /**
       * @memberOf iscForm
       * @param fdnScript
       * @description
       * If provided, call init function to populate additional dynamic data models
       */
      function populateAdditionalModels( fdnScript ) {
        var args = [self.internalFormConfig.additionalModels, $stateParams, self.internalModel];
        evalScript( fdnScript, args );
        evalScript( self.internalFormConfig.additionalModelInit, args );

        function evalScript( script, args ) {
          if ( script && _.isFunction( script ) ) {
            script.apply( null, args );
          }
        }
      }

      /**
       * @memberOf iscForm
       * @param fdnLibraries
       * @description
       * If provided, populate user library of reusable functions from FDN and/or controller definition
       */
      function initializeUserLibrary( fdnLibraries ) {
        // First the global library
        mergeLibrary( iscFormsTemplateService.getGlobalFunctionLibrary() );

        // Apply libraries in reverse order to ensure that the library defined on the form itself takes precedence
        // over those in subforms.
        var fdnLibrary;
        while ( fdnLibrary = fdnLibraries.pop() ) {
          mergeLibrary( fdnLibrary );
        }

        // Finally, apply any library defined in client code
        mergeLibrary( self.internalFormConfig.library );

        function mergeLibrary( library ) {
          _.extend( self.options.formState._lib, library );
        }
      }

      /**
       * @memberOf iscForm
       */
      function getValidationDefinition() {
        iscFormsModel.getValidationDefinition( {
          formKey    : self.formKey,
          formVersion: self.formVersion,
          formLiteral: self.internalFormConfig.formLiteral
        } )
          .then( function( validationDefinition ) {
            self.validationDefinition = validationDefinition;
            self.showInternal         = true;
          } );
      }
    }
  }
})();
