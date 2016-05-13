(function() {
  'use strict';

  angular.module( 'isc.forms' )
    .directive( 'iscFormInternal', iscFormInternal );

  /* @ngInject */
  /**
   * @ngdoc directive
   * @memberOf isc.forms
   * @param $q
   * @param iscCustomConfigService
   * @param iscNotificationService
   * @param iscFormsValidationService
   * @returns {{restrict: string, replace: boolean, controllerAs: string, scope: {formDefinition: string, model: string, options: string, formConfig: string, validateFormApi: string, buttonConfig: string}, bindToController: boolean, controller: controller, templateUrl: directive.templateUrl}}
   */
  function iscFormInternal( $q, iscCustomConfigService, iscNotificationService, iscFormsValidationService ) {
    var directive = {
      restrict        : 'E',
      replace         : true,
      controllerAs    : 'formInternalCtrl',
      scope           : {
        formDefinition : '=',
        model          : '=',
        options        : '=',
        formConfig     : '=',
        validateFormApi: '=',
        buttonConfig   : '='
      },
      bindToController: true,
      controller      : controller,
      templateUrl     : function( elem, attrs ) {
        return attrs.templateUrl || 'forms/widgets/iscFormInternal/iscFormInternal.html';
      }
    };

    return directive;

    /* @ngInject */
    function controller( $scope ) {
      var self = this;

      _.merge( self, {
        forms       : [],
        debugDisplay: _.get( iscCustomConfigService.getConfig(), 'debugDisplay.forms', {}),
        options     : {
          formState: {
            _mode       : self.mode,
            _validation : {},
            _annotations: {
              data: []
            },
            _subforms   : self.formDefinition.subforms,
            _model      : {
              isDirty: false
            }
          }
        },
        childConfig : {},
        formConfig  : {},
        buttonConfig: {}
      }, self );

      self.additionalModels = _.get( self.formConfig, 'additionalModels', {});

      // Object to hold data and structure for temporary form validation
      self.validation = iscFormsValidationService.getValidationObject();

      // Submit button from buttonConfig is handled separately here, to work with $validation pipeline
      self.onSubmit = onSubmit;

      // Annotations
      self.closeAnnotations = closeAnnotations;

      init();

      // Private/helper functions
      /**
       * @memberOf iscFormInternal
       *
       */
      function init() {
        // Initialize validation and notification components
        iscFormsValidationService.init( self.options );
        iscNotificationService.init();
        initAutosaveConfig();
        watchPages();
      }

      /**
       * @memberOf iscFormInternal
       */
      function initAutosaveConfig() {
        var saveConfig  = _.get( self.formDefinition.form, 'autosave', {}),
            formDataApi = _.get( self.formConfig, 'formDataApi', {}),
            saveApi     = formDataApi.save || function() {
              },
            wrapApi     = formDataApi.wrap || function( data ) {
                return data;
              };

        var callSaveApi = _.throttle( wrapAndSaveData, 500, { trailing: true });

        // Set save trigger
        switch ( saveConfig.trigger ) {
          case 'modelChange':
            watchModel( callSaveApi );
            break;

          case 'pageChange':
            watchModel( dirtify );
            watchPage();
            break;

          // default behavior is to only save when the form is submitted (post validation)
        }

        function dirtify() {
          self.options.formState._model.isDirty = true;
        }

        function cleanify() {
          self.options.formState._model.isDirty = false;
        }

        function wrapAndSaveData() {
          var wrappedData = wrapApi( self.model, self.formDefinition.form );
          return saveApi( wrappedData, self.options.formState._id );
        }

        function watchModel( action ) {
          $scope.$watch(
            "formInternalCtrl.model",
            function( newVal, oldVal ) {
              if ( !angular.equals( newVal, oldVal ) ) { // avoids trigger during initial watch setup
                action();
              }
            },
            true
          );
        }

        function watchPage() {
          $scope.$watch(
            "formInternalCtrl.currentPage",
            function() {
              if ( self.options.formState._model.isDirty ) {
                callSaveApi();
                cleanify();
              }
            }
          );
        }
      }

      /**
       * @memberOf iscFormInternal
       * @param mainFormErrors
       * @param subformErrors
       */
      function showFailedValidation( mainFormErrors, subformErrors ) {
        mainFormErrors = _.compact( mainFormErrors );

        // Main form alerts
        // Limit error reporting to one per control; this needs to be done manually because notifications
        // can use ng-messages, but each notification has its own ng-messages collection.
        var alerts = {};

        _.forEach( mainFormErrors, function( error ) {
          _.forEach( error, function( errorType ) {
            _.forEach( errorType, function( errorInstance ) {
              var fieldScope        = iscNotificationService.getFieldScope( errorInstance.$name );
              alerts[fieldScope.id] = {
                $error  : error,
                options : fieldScope.options,
                scrollTo: fieldScope.id
              };
            });
          });
        });

        _.forEach( alerts, function( alert ) {
          iscNotificationService.showAlert( alert );
        });

        // Cascaded subform alerts
        _.forEach( subformErrors, function( error, id ) {
          var alert = {
            scrollTo: id,
            content : makeError( error )
          };
          iscNotificationService.showAlert( alert );
        });

        /**
         * @memberOf iscFormInternal
         * @param error
         * @returns {string}
         */
        function makeError( error ) {
          return '<label class="error-message">In ' + error.label + ': ' + pluralize( 'record', error.records.length ) + ' invalid.</label>';
        }

        /**
         * @memberOf iscFormInternal
         * @param text
         * @param count
         * @returns {string}
         */
        function pluralize( text, count ) {
          return count + ' ' + text + ( count > 1 ? 's are' : ' is' );
        }
      }

      //
      /**
       * @memberOf iscFormInternal
       * @description
       * Sets up watches on pages having a hideExpression property
       */
      function watchPages() {
        // Throttle for initial load or large model changes
        var throttledFilter = _.throttle( filterPages, 100 );
        _.forEach( self.formDefinition.form.pages, function( page ) {
          var hideExp = page.hideExpression;
          if ( hideExp ) {
            $scope.$watch(
              function() {
                return $scope.$eval( hideExp, self );
              },
              function( hidePage ) {
                page._isHidden = hidePage;
                throttledFilter();
              });
          }
        });

        self.pages       = self.formDefinition.form.pages;
        self.currentPage = _.head( self.pages );
        self.multiConfig = {
          pages          : self.pages,
          layout         : self.formDefinition.form.pageLayout,
          currentPage    : self.currentPage,
          selectablePages: [],
          forms          : self.forms,
          buttonConfig   : self.buttonConfig || {},
          selectPage     : selectPage
        };

        throttledFilter();
      }

      /**
       * @memberOf iscFormInternal
       * @param index - The index of the page to select/go to. Indexed from selectablePages, not all pages.
       */
      function selectPage( index ) {
        self.currentPage             = self.multiConfig.selectablePages[index];
        self.multiConfig.currentPage = self.currentPage;
      }

      /**
       * @memberOf iscFormInternal
       */
      function filterPages() {
        self.multiConfig.selectablePages = _.filter( self.formDefinition.form.pages, function( page ) {
          return !page._isHidden;
        });
      }

      /**
       * @memberOf iscFormInternal
       */
      function closeAnnotations() {
        self.formConfig.annotationsApi.closeAnnotationPanel();
      }

      /**
       * @memberOf iscFormInternal
       */
      function onSubmit() {
        self.options.formState._validation.$submitted = true;

        // iscFormsValidationService.validateForm parses the outer forms on each page.
        var containingFormIsValid = true,
            $error                = [],
            index                 = 0;
        _.forEach( self.pages, function( page ) {
          // Force each form (page) to validate if it is not hidden
          // Forms are generated by formly by index
          var form = self.forms[index++];
          if ( !page._isHidden ) {
            var formValidation    = iscFormsValidationService.validateForm( form );
            containingFormIsValid = formValidation.isValid && containingFormIsValid;
            $error                = $error.concat( formValidation.$error );
          }
        });

        // Additional validation via api attribute
        if ( self.validateFormApi ) {
          self.validateFormApi().then(function( result ) {
            if ( containingFormIsValid && result.isValid ) {
              submitForm();
            }
            else {
              showFailedValidation( $error, result.errors );
            }
          });
        }
        else {
          if ( containingFormIsValid ) {
            submitForm();
          }
        }
      }

      /**
       * @memberOf iscFormInternal
       */
      function submitForm() {
        var submitConfig = _.get( self.buttonConfig, 'submit', {}),
            onSubmit     = submitConfig.onClick || function() {
              },
            afterSubmit  = submitConfig.afterClick || function() {
              };

        $q.when( onSubmit() )
          .then( afterSubmit );
      }
    }
  }
})
();
