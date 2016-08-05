(function() {
  'use strict';

  /* @ngInject */
  angular
    .module( 'isc.forms' )
    .factory( 'iscFormsModel', iscFormsModel );

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
   * @returns {{getForms, getActiveForm, getActiveForms, setFormStatus, getFormDefinition, getValidationDefinition}}
   */
  function iscFormsModel( $q, $templateCache, $window, $filter,
    iscHttpapi, // needed for user script closures
    iscFormsCodeTableApi, iscFormsTemplateService, iscFormsApi ) {
    var _typeCache          = {};
    var _formsCache         = {};
    var _viewModeFormsCache = {};
    var _validationCache    = {};

    var defaultViewTemplateUrl  = 'forms/foundationTemplates/templates/defaultViewMode.html';
    var viewModePrefix          = '__viewMode__';
    var multipleActiveFormTypes = [];

    var getForms       = _.partial( getFormStatus, {
      returnMultiple: true,
      limitToActive : false
    } );
    var getActiveForm  = _.partial( getFormStatus, {
      returnMultiple: false,
      limitToActive : true
    } );
    var getActiveForms = _.partial( getFormStatus, {
      returnMultiple: true,
      limitToActive : true
    } );

    return {
      getForms                    : getForms,
      getActiveForm               : getActiveForm,
      getActiveForms              : getActiveForms,
      setFormStatus               : setFormStatus,
      getFormDefinition           : getFormDefinition,
      getValidationDefinition     : getValidationDefinition,
      unwrapFormDefinitionResponse: unwrapFormDefinitionResponse,
      invalidateCache             : invalidateCache
    };

    /**
     * @memberOf iscFormsModel
     * @param response
     * @returns {Object | Array}
     */
    function unwrapFormDefinitionResponse( response ) {
      // Assumes the form def is in _Body.FormDefinition,
      // but falls back to a root-level definition if not.
      return _.get( response, '_Body.FormDefinition', response );
    }

    /**
     * @memberOf iscFormsModel
     * @descriptions Explicitly invalidates the form definition cache for the given formKey.
     * The next time the definition is needed, it will be requested from the server.
     * @param {String} formKey
     * @param {=String} formVersion
     */
    function invalidateCache( formKey, formVersion ) {
      var cacheKey = ( formVersion || 'current' ) + '.' + formKey;
      _.unset( _formsCache, cacheKey );
      _.unset( _viewModeFormsCache, cacheKey );
      _.unset( _validationCache, cacheKey );
    }

    /**
     * @memberOf iscFormsModel
     * @param formType
     * @returns {*}
     */
    function getCachedType( formType ) {
      var cachedType = _.get( _typeCache, formType );
      if ( !cachedType ) {
        cachedType = [];
        _.set( _typeCache, formType, cachedType );
      }
      return cachedType;
    }

    /**
     * @memberOf iscFormsModel
     * @param config
     * @param formType
     * @returns {*}
     */
    function getFormStatus( config, formType ) {
      var allowMultiple = !!config.returnMultiple,
          limitToActive = !!config.limitToActive,
          cachedType    = getCachedType( formType );

      if ( cachedType.length ) {
        return $q.when( filterResults( cachedType ) );
      }
      else {
        var deferred = $q.defer();
        iscFormsApi.getFormStatuses( formType ).then( function( results ) {
          _.set( _typeCache, formType, results );
          deferred.resolve( filterResults( results ) );
        } );
        return deferred.promise;
      }

      function filterResults( array ) {
        var filteredArray = limitToActive ? _.filter( array, { status: 'Active' } ) : array;
        return allowMultiple ? filteredArray : _.first( filteredArray );
      }
    }

    /**
     * @memberOf iscFormsModel
     * @param {String} formType
     * @param {Object} formStatus - formKey and status
     * @param {Array} formList
     * @returns {*}
     */
    function setFormStatus( formType, formStatus, formList ) {
      var cache               = getCachedType( formType ),
          allowMultipleActive = _.includes( multipleActiveFormTypes, formType ),
          formStatuses        = [formStatus];

      // If multiple forms of this type are not allowed,
      // and we are setting a form to be active,
      // inactivate any currently active ones.
      if ( !allowMultipleActive && formStatus.status === 'Active' ) {
        var existingFormsToInactivate = _.filter( formList, {
            formType: formType,
            status  : 'Active'
          }
        );
        _.forEach( existingFormsToInactivate, function( form ) {
          if ( form.formKey !== formStatus.formKey ) {
            form.status = 'Inactive';
            formStatuses.push( {
              formKey: form.formKey,
              status : 'Inactive'
            } );
          }
        } );
      }

      // Update the local cache, if it is populated
      if ( cache.length ) {
        _.forEach( formStatuses, function( form ) {
          _.find( cache, { formKey: form.formKey } ).status = form.status;
        } );
      }

      // Submit to REST api
      return iscFormsApi.setFormStatus( formType, formStatuses );
    }

    /**
     * @memberOf iscFormsModel
     * @param {Object} config:
     * {String} formKey,
     * {=String} formVersion
     * @returns {*}
     */
    function getValidationDefinition( config ) {
      var formKey     = config.formKey,
          formVersion = config.formVersion,
          cacheKey    = ( formVersion || 'current' ) + '.' + formKey;

      var cachedValidation = _.get( _validationCache, cacheKey );
      var validations      = [];

      var deferred = $q.defer();

      if ( cachedValidation ) {
        deferred.resolve( angular.copy( cachedValidation ) );
      }
      else {
        getFormDefinition( {
          formKey    : formKey,
          formVersion: formVersion
        } )
          .then( function( formDefinition ) {
            _.forEach( formDefinition.form.pages, function( page ) {
              getEmbeddedForms( page.fields, formDefinition.subforms );
            } );

            _.set( _validationCache, cacheKey, validations );
            deferred.resolve( angular.copy( validations ) );
          } );
      }

      return deferred.promise;

      function getEmbeddedForms( fields, subforms ) {
        _.forEach( fields, function( field ) {
          var registeredType = iscFormsTemplateService.getRegisteredType( field.type ),
              extendsType    = _.get( field, 'extends' ) || _.get( registeredType, 'extends' );

          if ( field.fieldGroup ) {
            getEmbeddedForms( field.fieldGroup, subforms );
          }
          // If a collection, register it with the validation safety net
          else if ( field.type === 'embeddedFormCollection' || extendsType === 'embeddedFormCollection' ) {
            validations.push( {
              key   : field.key,
              fields: subforms[_.get( field, 'data.embeddedType' )] || []
            } );
          }
        } );
      }
    }

    /**
     * @memberOf iscFormsModel
     * @description
     * Gets the form with the given formKey name.
     * @param {Object} config:
     * {String} formKey,
     * {=String} mode,
     * {=String} formVersion,
     * {=String} subformDefinitions
     * @returns {Object}
     */
    function getFormDefinition( config ) {
      var formKey            = config.formKey,
          mode               = config.mode,
          formVersion        = config.formVersion,
          subformDefinitions = config.subformDefinitions,
          cacheKey           = ( formVersion || 'current' ) + '.' + formKey;

      // If form is already cached, return the cached form in a promise
      var cachedForm;
      switch ( mode ) {
        case 'view':
          cachedForm = _.get( _viewModeFormsCache, cacheKey );
          break;

        default:
          cachedForm = _.get( _formsCache, cacheKey );
      }
      var deferred = $q.defer();

      if ( cachedForm ) {
        deferred.resolve( angular.copy( cachedForm ) );
        return deferred.promise;
      }

      // Otherwise, fetch the form template and resolve the form in a promise
      else {
        iscFormsApi.getFormDefinition( formKey, formVersion ).then( function( responseData ) {
          var primaryPromises   = [],
              secondaryPromises = [],
              form              = unwrapFormDefinitionResponse( responseData ),
              subforms          = subformDefinitions || {};

          // Subform-only definitions are a bare array
          if ( _.isArray( form ) ) {
            primaryPromises = primaryPromises.concat( processFields( form ) );
          }
          else {
            _.forEach( form.pages, function( page ) {
              primaryPromises = primaryPromises.concat( processFields( page.fields ) );
            } );
          }

          // If an FDN-specified additionalModelInit function is indicated, fetch this as a user script
          if ( form.additionalModelInit ) {
            var scriptPromise = iscFormsApi.getUserScript( form.additionalModelInit )
              .then( function( response ) {
                var script               = parseScript( response );
                form.additionalModelInit = (function( iscHttpapi ) {
                  return script;
                })( iscHttpapi );
                return true;
              } );
            primaryPromises.push( scriptPromise );
          }

          // After all necessary template calls have completed, return the form
          $q.all( primaryPromises ).then( function() {
            $q.all( secondaryPromises ).then( function() {
              var editMode = {
                form    : form,
                subforms: subforms
              };

              // Cache the editable version
              _.set( _formsCache, cacheKey, editMode );

              // Make a deep copy for the view mode version
              var viewMode = {
                form    : angular.merge( {}, form ),
                subforms: subforms
              };

              // Replace templates in the view mode with readonly versions
              _.forEach( viewMode.form.pages, function( page ) {
                replaceTemplates( page.fields );
              } );

              // Cache it separately
              _.set( _viewModeFormsCache, cacheKey, viewMode );

              // Resolve the requested version
              switch ( mode ) {
                case 'view':
                  deferred.resolve( angular.copy( viewMode ) );
                  break;

                default:
                  deferred.resolve( angular.copy( editMode ) );
              }
            } );
          } );

          /**
           * @memberOf iscFormsModel
           * @description
           * Additional processing for fields to bind to the formly form.
           * @param fields
           * @returns {Array}
           * @private
           */
          function processFields( fields ) {
            var fieldPromises = [];
            _.forEach( fields, function( field ) {
              var expProps       = _.get( field, 'expressionProperties', {} ),
                  label          = _.get( field, 'templateOptions.label' ),
                  type           = _.get( field, 'type' ),
                  wrappers       = _.get( field, 'wrapper' ),
                  fieldGroup     = _.get( field, 'fieldGroup' ),
                  data           = _.get( field, 'data', {} ),
                  registeredType = iscFormsTemplateService.getRegisteredType( type ),
                  extendsType    = _.get( field, 'extends' ) || _.get( registeredType, 'extends' ),
                  isForm         = type === 'embeddedForm' || extendsType === 'embeddedForm',
                  isCollection   = type === 'embeddedFormCollection' || extendsType === 'embeddedFormCollection',
                  watcher        = _.get( field, 'watcher' );

              // A field group does not have its own type, but contains fields in the fieldGroup array
              if ( fieldGroup ) {
                fieldPromises = fieldPromises.concat( processFields( fieldGroup ) );
              }

              // If type has not been specified, this is arbitrary html written into a template tag, so skip it.
              if ( !type ) {
                return true;
              }

              // If this is a nested form, recurse the process for its child fields
              if ( isForm || isCollection ) {
                processEmbeddedForm( field, data, isCollection );
              }

              else {
                // If a user script is provided, this needs to be loaded and parsed
                if ( data.userScript ) {
                  processUserScript( field, data.userScript );
                }

                // Translate the label if no label expression has been set
                var expLabel = expProps['templateOptions.label'];
                if ( label && !expLabel ) {
                  _.set( field, 'templateOptions.label', $filter( 'translate' )( label ) );
                }

                // If this field uses a code table, look it up and push it into the field's options
                if ( data.codeTable ) {
                  // Include any custom options for this field that have been explicitly entered
                  var explicitOptions = _.get( field, 'templateOptions.options', [] );
                  _.set( field, 'templateOptions.options',
                    [].concat( explicitOptions ).concat( iscFormsCodeTableApi.get( data.codeTable ) )
                  );
                }

                // If data.isObject is not set, infer object/primitive mode based on first option in options list
                var options = _.get( field, 'templateOptions.options', [] );
                if ( data.isObject === undefined && options ) {
                  _.set( field, 'data.isObject', _.isObject( _.head( options ) ) );
                }

                // If the type is not already registered, load it and register it with formly
                if ( !iscFormsTemplateService.isTypeRegistered( type ) ) {
                  getCustomTemplate( type );
                }
                // If a non-custom form has custom wrappers, load them
                else if ( wrappers ) {
                  _.forEach( wrappers, function( wrapperName ) {
                    if ( !iscFormsTemplateService.isWrapperRegistered( wrapperName ) ) {
                      fieldPromises.push( getWrapper( wrapperName ) );
                    }
                  } );
                }

                if ( watcher ) {
                  _.forEach( watcher, function( watch ) {
                    // Angular does not support $watch listeners as expressions, but formly thinks it does.
                    // So we need to wrap any watch listener that is an expression in a function.
                    if ( watch.listener && !_.isFunction( watch.listener ) ) {
                      var watchListener = watch.listener;
                      // The formly watcher signature takes additional args of field and the watch's deregistration function.
                      watch.listener = function( field, newVal, oldVal, scope, stop ) {
                        scope.$eval( watchListener, {
                          field : field,
                          newVal: newVal,
                          oldVal: oldVal,
                          stop  : stop
                        } );
                      }
                    }
                  } );
                }
              }
            } );
            return fieldPromises;

            function processUserScript( field, scriptName ) {
              var scriptPromise = iscFormsApi.getUserScript( scriptName )
                .then( function( response ) {
                  var script = parseScript( response ),
                      getApi = _.get( script, 'api.get' );
                  // Expose iscHttpapi to api getter function
                  if ( getApi ) {
                    script.api.get = (function( iscHttpapi ) {
                      return getApi;
                    })();
                  }
                  _.set( field, 'data.userModel', script );
                  return true;
                } );
              primaryPromises.push( scriptPromise );
            }

            /**
             * Processes an embeddedForm or embeddedFormCollection
             * @private
             */
            function processEmbeddedForm( field, data, isCollection ) {
              var embeddedType = data.embeddedType,
                  embeddedPage = data.embeddedPage;

              // If a linked type, look up that type and import the fields []
              if ( embeddedType ) {
                if ( subforms[embeddedType] === undefined ) {
                  if ( isCollection ) {
                    subforms[embeddedType] = [];
                  }

                  fieldPromises.push(
                    // Fetch the embedded type
                    getFormDefinition( {
                      formKey           : embeddedType,
                      mode              : mode,
                      subformDefinitions: subforms
                    } )
                      .then( function( embeddedForm ) {
                        var fields = [],
                            form   = embeddedForm.form;

                        // If this is a bare array of fields (subform-only definition),
                        // then the response form is only the fields [] for this form.
                        if ( _.isArray( form ) ) {
                          fields = form;
                        }

                        // If this is a full form with page and form wrappers, we can only use a fields [] from it.
                        // If an embeddedPage was provided, use the fields [] from that page;
                        // otherwise, use the fields [] on the first page.
                        else {
                          var pages = form.pages,
                              page;

                          // Page lookup can be either a 0-based index or a page name
                          if ( embeddedPage ) {
                            if ( _.isNumber( embeddedPage ) ) {
                              page = _.get( pages, embeddedPage );
                            }
                            else {
                              page = _.find( pages, { name: embeddedPage } );
                            }
                          }
                          // If no page was provided, use the first one
                          else {
                            page = _.get( pages, '0' );
                          }

                          fields = _.get( page, 'fields', [] );
                        }

                        // Force inheritance of the data property
                        forceDataInheritance( fields );

                        if ( isCollection ) {
                          // Push a subform listener into the fields list
                          fields.push( {
                            'type': 'embeddedFormListener'
                          } );

                          // Update the subforms hash table
                          subforms[embeddedType] = fields;
                        }

                        // A non-collection embedded form is inlined in the parent form
                        else {
                          // Update the fields in this embedded form from the looked-up form
                          _.set( field, 'templateOptions.fields', fields );
                        }
                      } )
                  );
                }

                fieldPromises = fieldPromises.concat( processFields( _.get( field, 'templateOptions.fields' ) ) );
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
          function getCustomTemplate( templateName ) {
            var scriptPromise = iscFormsApi.getTemplate( "js/" + templateName )
              .then( function( response ) {
                processScript( response );
                return true;
              } );
            primaryPromises.push( scriptPromise );

            /**
             * @memberOf iscFormsModel
             * @description
             * Processes the javascript source for the custom template
             * @returns {Object}
             * @private
             */
            function processScript( response ) {
              var template = parseScript( response );

              injectWrappers( template );
              injectHtml( template );
              injectCss();

              // TODO - load other assets such as images?

              // Register with formly
              iscFormsTemplateService.registerType( template );

              return template;
            }

            /**
             * @memberOf iscFormsModel
             * @description
             * Fetches custom wrappers for the template and registers them.
             * @param template
             * @private
             */
            function injectWrappers( template ) {
              var wrappers = template.wrapper || [];

              _.forEach( wrappers, function( wrapperName ) {
                if ( !iscFormsTemplateService.isWrapperRegistered( wrapperName ) ) {
                  secondaryPromises.push( getWrapper( wrapperName ) );
                }
              } );
            }

            /**
             * @memberOf iscFormsModel
             * @description
             * Fetches html for the template and puts it in the $templateCache.
             * @param template
             * @private
             */
            function injectHtml( template ) {
              var templateHtml = template.templateUrl;

              // If a templateUrl is specified in the custom template,
              // and it has not been loaded yet, load and cache it now.
              if ( templateHtml ) {
                if ( !$templateCache.get( templateHtml ) ) {
                  secondaryPromises.push( getHtml( templateName, templateHtml ) );
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
            function injectCss() {
              var cssPromise = iscFormsApi.getTemplate( 'css/' + templateName ).then(
                function( stylesheet ) {
                  // Stylesheet is optional and not specified by the FDN,
                  // so the only way to find out if there is one is to ask for it.
                  // Expect the server to send a 204 (not 404) if no stylesheet was found.
                  if ( stylesheet ) {
                    stylesheetLoaded( stylesheet );
                  }
                }, stylesheetNotFound );

              secondaryPromises.push( cssPromise );

              function stylesheetLoaded( stylesheet ) {
                if ( !angular.element( 'style#' + templateName ).length ) {
                  var style = createStyle( templateName, stylesheet );
                  angular.element( 'head' ).append( style );
                }
                return true;
              }

              function stylesheetNotFound() {
                // This may happen if there is no custom stylesheet for this template
                // but the server is configured to send a 404.
                return true;
              }

              // Creates the style element
              function createStyle( id, styles ) {
                var style       = $window.document.createElement( 'style' );
                style.id        = id;
                style.innerHTML = styles;
                return style;
              }
            }
          }
        } );

        return deferred.promise;
      }

      function getWrapper( wrapperName ) {
        return iscFormsApi.getTemplate( 'wrappers/' + wrapperName )
          .then( function( wrapperMarkup ) {
            iscFormsTemplateService.registerWrapper(
              {
                "name"    : wrapperName,
                "template": wrapperMarkup
              }
            );
            return true;
          } );
      }

      function getHtml( templateName, templateHtml ) {
        return iscFormsApi.getTemplate( 'html/' + templateName + '/' + templateHtml )
          .then( function( templateMarkup ) {
            $templateCache.put( templateHtml, templateMarkup );
            return true;
          } );
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
    function forceDataInheritance( fields ) {
      _.forEach( fields, function( field ) {
        if ( field.fieldGroup ) {
          forceDataInheritance( field.fieldGroup );
        }
        else if ( field.type ) {
          var data              = _.get( field, 'data', {} );
          var ancestorDataStack = _.compact( getAncestors( field.type ) ),
              ancestorData;

          while ( ( ancestorData = ancestorDataStack.pop() ) !== undefined ) {
            // Prefer the most local data to ancestral data
            _.merge( data, ancestorData, data );
          }

          _.set( field, 'data', data );
        }
      } );

      /**
       * @memberOf iscFormsModel
       * @param type
       * @returns {Array}
       * @private
       */
      function getAncestors( type ) {
        var stack    = [],
            template = iscFormsTemplateService.getRegisteredType( type );
        if ( template ) {
          // If this ancestor has a data property, push it onto the stack
          var data = _.get( template, 'defaultOptions.data' );
          if ( data ) {
            stack.push( data );
          }
          // If this ancestor has more ancestors, recurse through them
          if ( template.extends ) {
            stack = stack.concat( getAncestors( template.extends ) );
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
    function replaceTemplates( fields ) {
      _.forEach( fields, function( field ) {
        var registeredType = iscFormsTemplateService.getRegisteredType( field.type ),
            extendsType    = _.get( field, 'extends' ) || _.get( registeredType, 'extends' );

        if ( field.fieldGroup ) {
          replaceTemplates( field.fieldGroup );
        }
        else {
          var data            = _.get( field, 'data.viewMode', {} ),
              viewTemplate    = data.template,
              viewTemplateUrl = data.templateUrl;
          if ( viewTemplate ) {
            field.template = viewTemplate;
          }
          else if ( viewTemplateUrl ) {
            field.templateUrl = viewTemplateUrl;
          }
          else {
            // Collections handle view mode on their own.
            // field.key is the data path into the model, so if this is not present,
            // there is no model (e.g., an "instructions" template or arbitrary html).
            if ( field.type && field.type !== 'embeddedFormCollection' && extendsType !== 'embeddedFormCollection' && field.key ) {
              var viewModeType       = viewModePrefix + field.type;
              var registeredViewType = iscFormsTemplateService.getRegisteredType( viewModeType );
              if ( !registeredViewType ) {
                iscFormsTemplateService.registerType(
                  {
                    'name'       : viewModeType,
                    'extends'    : field.type,
                    'templateUrl': defaultViewTemplateUrl
                  },
                  {
                    excludeFromWidgetLibrary: true
                  }
                );
              }
              field.type = viewModeType;
              delete field.template;
              delete field.templateUrl;
            }
          }
        }
      } );
    }

    /**
     * @memberOf iscFormsModel
     * @description
     *  This is only ever evaluated on scripts returned from a trusted backend REST source
     * @param script
     * @returns {Object}
     */
    function parseScript( script ) {
      // Ignoring JSHint for eval()
      //
      return eval( script ); // jshint ignore:line
    }
  }
})();
