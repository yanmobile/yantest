(function () {
  'use strict';

  // ----------------------------
  // injection
  // ----------------------------

  angular.module('isc.forms')
      .directive('iscEmbeddedFormCollection', iscEmbeddedFormCollection);
  /**
   * @ngdoc directive
   * @memberOf isc.forms
   * @name iscEmbeddedFormCollection
   * @scope
   * @restrict 'E'
   * @param $filter
   * @param FoundationApi
   * @param appConfig
   * @param FORMS_EVENTS
   * @param iscFormsTemplateService
   * @param iscFormsValidationService
   * @param iscScrollContainerService
   * @returns {{restrict: string, replace: boolean, require: string, controllerAs: string, scope: {id: string, formState: string, options: string, annotations: string}, bindToController: boolean, controller: controller, link: link, templateUrl: string}}
   */
  /* @ngInject */
  function iscEmbeddedFormCollection($filter, FoundationApi, appConfig, FORMS_EVENTS,
                                     iscFormsTemplateService, iscFormsValidationService,
                                     iscScrollContainerService) {//jshint ignore:line

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------
    var directive = {
      restrict        : 'E',
      replace         : true,
      require         : 'ngModel',
      controllerAs    : 'efCollectionCtrl',
      scope           : {
        id         : '@',
        formState  : '=',
        options    : '=',
        annotations: '='
      },
      bindToController: true,
      controller      : controller,
      link            : link,
      templateUrl     : 'forms/foundationTemplates/components/iscEmbeddedFormCollection.html'
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------
    /* @ngInject */
    function controller($scope) {
      var self = this;

      var opts            = self.options,
          templateOptions = opts.templateOptions,
          key             = opts.key,
          editAs          = _.get(opts, 'data.collections.editAs'),
          viewAs          = _.get(opts, 'data.collections.viewAs'),
          subforms        = self.formState._subforms;

      // Inherit formState for subform
      self.subformOptions = {
        formState: _.extend({}, self.formState)
      };
      self.subform        = {};

      // Update annotations so that the context is filtered by the parent
      self.subformOptions.formState._annotations = {
        context: self.annotations.context,
        data   : self.formState._annotations.data
      };


      self.dateFormat        = _.get(appConfig, 'formats.date.shortDate', 'date');
      self.annotationWrapper = 'forms/foundationTemplates/tableTemplates/annotation-indicator.html';

      self.isNew      = false;
      self.renderForm = false;
      self.modalName  = 'editCollection_' + key;
      self.formName   = 'form_' + key;
      self.mode       = self.formState._mode;

      // Local model of validation errors set by iscFormsValidationService
      self.validationErrors = getValidation();

      // The data model for editing a single subform instance
      self.editModel = {};

      // The (singular) label for each subform instance
      self.label = _.get(opts, 'data.embeddedLabel', templateOptions.label);

      // Flatten field groups down for table header and cell iteration
      var type    = _.get(opts, 'data.embeddedType');
      self.fields = angular.merge({}, subforms[type]);
      mergeBuiltInTemplates(self.fields);

      createTableFields();

      // Callbacks
      self.hasValidationError = function (row) {
        return _.includes(self.validationErrors, row);
      };

      self.newForm = function () {
        self.isNew = true;

        self.editModel = {};
        setAnnotationContext();

        showSubform();
        // Defer the update until the formly-form has finished being initialized;
        // otherwise a race condition can prevent the broadcast message from being heard
        _.defer(updateModel);
      };

      self.editForm = function (row) {
        var index = _.indexOf(self.collectionModel, row);

        self.isNew     = false;
        self.editIndex = index;
        setAnnotationContext(index);

        self.editModel = {};
        _.merge(self.editModel, self.collectionModel[index]);
        showSubform();
        // Defer the update until the formly-form has finished being initialized;
        // otherwise a race condition can prevent the broadcast message from being heard
        _.defer(updateModelWithValidation);
      };

      self.cancel = function () {
        self.subformOptions.formState._validation.$submitted = false;
        hideSubform();
      };

      self.saveForm = function () {
        self.subformOptions.formState._validation.$submitted = true;

        var isSubformValid = iscFormsValidationService.validateForm(self.subform.form).isValid;

        // If this subform is valid, save the data and return
        if (isSubformValid) {
          if (self.isNew) {
            self.collectionModel.push(self.editModel);
          }
          else {
            var model = self.collectionModel[self.editIndex];
            _.merge(model, self.editModel);
            _.remove(self.validationErrors, model);
          }
          self.editIndex = undefined;
          hideSubform();

          onCollectionModified();
        }
        // TODO - show message if invalid? (iscFormModel.validate will touch each control during validation)
      };

      self.removeForm = function (row) {
        var index = _.indexOf(self.collectionModel, row);

        self.collectionModel.splice(index, 1);
        onCollectionModified();
      };


      // Watches
      $scope.$watch(getValidation, function (value) {
        self.validationErrors = _.get(value, 'records');
      });


      // Private/helper functions
      /**
       * @memberOf iscEmbeddedFormCollection
       * @returns {*}
         */
      function getValidation() {
        return self.formState._validation[self.id];
      }

      /**
       * @memberOf iscEmbeddedFormCollection
       */
      function createTableFields() {
        self.flattenedFields = $filter('iscFormsFlattenedFields')(self.fields, self.subformOptions.formState._annotations);

        // Table configuration
        // Fields
        var tableColumns = _.map(self.flattenedFields, function (field) {
          return {
            key             : field.label,
            model           : field.model,
            templateUrl     : self.annotationWrapper,
            hasAnnotations  : field.hasAnnotations,
            innerTemplateUrl: field.templateUrl,
            display         : field.display,
            type            : field.type,
            dateFormat      : self.dateFormat
          };
        });

        // Actions
        if (self.mode !== 'view') {
          tableColumns.push(
            {
              key        : 'Actions',
              sortable   : false,
              templateUrl: 'forms/foundationTemplates/components/iscEmbeddedFormCollection.table-actions.html'
            }
          );
        }

        self.tableConfig = {
          sortable : true,
          columns  : tableColumns,
          emptyText: _.get(self.options, 'data.emptyCollectionMessage')
        };
      }

      /**
       * @memberOf iscEmbeddedFormCollection
       * @descripiton
       * Sets the context on the subform so that field controls in that subform can use the annotation system.
       * @param {number=} index - The index of the row being edited. If for a new row, leave undefined.
       */
      function setAnnotationContext(index) {
        self.subformOptions.formState._annotations.index = index === undefined ? self.collectionModel.length : index;
      }

      /**
       * @memberOf iscEmbeddedFormCollection
       * @description
       * Merges properties on built-in templates into the fields list in this controller.
       * This is necessary because the formly engine has not yet processed these templates,
       * and we may need properties defined as defaultOptions in those templates to render them in the collection.
       * @param fields
       */
      function mergeBuiltInTemplates(fields) {
        _.forEach(fields, function (field) {
          var type = _.get(field, 'type', '');
          if (type && !type.startsWith('embeddedForm')) {
            // Recurse for fieldGroups
            if (field.fieldGroup) {
              mergeBuiltInTemplates(field.fieldGroup);
            }
            else {
              var options = _.get(iscFormsTemplateService.getRegisteredType(field.type), 'defaultOptions');
              if (options) {
                angular.merge(field, options, field);
              }
            }

          }
        });
      }

      /**
       * @memberOf iscEmbeddedFormCollection
       */
      function onCollectionModified() {
        self.subformOptions.formState._validation.$submitted = false;

        self.ngModelCtrl.$setViewValue(self.collectionModel);
        self.ngModelCtrl.$setTouched();
        self.ngModelCtrl.$validate();
      }

      /**
       * @memberOf iscEmbeddedFormCollection
       */
      function updateModelWithValidation() {
        // Broadcast down to the subform listener to set the model
        $scope.$broadcast(FORMS_EVENTS.setFormModel, self.editModel, false);
        iscFormsValidationService.validateForm(self.subform.form);
      }

      /**
       * @memberOf iscEmbeddedFormCollection
       */
      function updateModel() {
        // Broadcast down to the subform listener to set the model
        $scope.$broadcast(FORMS_EVENTS.setFormModel, self.editModel, true);
      }

      /**
       * @memberOf iscEmbeddedFormCollection
       */
      function showSubform() {
        // Delete the controller's reference to the formly-form's form attribute.
        // It will be regenerated on the scope by the formly-form when it is shown next time.
        // If this is not done, then when the form is requested the next time,
        // the value currently in self.subform will be orphaned and validation will not function properly.

        // This needs to be guaranteed to occur after any previous use of self.renderForm is set to false,
        // but before the next time self.renderForm is set to true.
        delete self.subform.form;

        switch (editAs) {
          case 'modal':
            _.defer(function () {
              // When self.renderForm is set to true, the formly-form will be created and added to the DOM.
              // This will regenerate self.subform for validation of the subform.
              self.renderForm = true;

              FoundationApi.publish(self.modalName, 'open');
            }, 0);
            break;

          default:
            $scope.$emit(FORMS_EVENTS.showSubform, {
              isNew    : self.isNew,
              itemLabel: self.label,
              model    : self.editModel,
              fields   : self.fields,
              options  : self.subformOptions,
              subform  : self.subform,
              onCancel : self.cancel,
              onSubmit : self.saveForm,
              scrollPos: iscScrollContainerService.getCurrentScrollPosition()
            });
        }
      }

      /**
       * @memberOf iscEmbeddedFormCollection
       */
      function hideSubform() {
        // Defer to avoid a flicker while Foundation catches up

        switch (editAs) {
          case 'modal':
            _.defer(function () {
              self.renderForm = false;
            }, 0);
            FoundationApi.publish(self.modalName, 'close');
            break;

          default:
            $scope.$emit(FORMS_EVENTS.hideSubform);
        }

      }
    }

    function link(scope, el, attrs, ngModelCtrl) {
      // Hold reference to ngModelCtrl in main controller
      scope.efCollectionCtrl.ngModelCtrl = ngModelCtrl;

      // Initialize model value for collection rows in $render
      ngModelCtrl.$render = function () {
        scope.efCollectionCtrl.collectionModel = ngModelCtrl.$modelValue || [];
      };
    }

  }//END CLASS



})();