(function() {
  'use strict';

  /**
   * Flattens a list of fields by compressing fieldGroups down into a single field list
   * This is useful for tabular representation of data
   */
  angular.module( 'isc.forms' )
    .filter( 'iscFormsFlattenedFields', iscFormsFlattenedFields );
  /**
   * @ngdoc filter
   * @memberOf isc.forms
   * @param $filter
   * @returns {Function}
   */
  /* @ngInject */
  function iscFormsFlattenedFields( $filter ) {
    return function( fields, annotationState ) {
      var flattenedFields = flattenFields( fields, annotationState );
      return flattenedFields;
    };

    /**
     * @memberOf iscFormsFlattenedFields
     * @param fields
     * @param annotationState
     * @returns {Array}
     */
    function flattenFields( fields, annotationState ) {
      var fieldArray = [];
      _.forEach( fields, function( field ) {
        fieldArray = fieldArray.concat( getFields( field, annotationState ) );
      } );
      return fieldArray;
    }

    /**
     * @memberOf iscFormsFlattenedFields
     * @param field
     * @param annotationState
     * @returns {*}
     */
    function getFields( field, annotationState ) {
      if ( field.fieldGroup ) {
        return flattenFields( field.fieldGroup, annotationState );
      }
      else if ( !field.type.startsWith( 'embeddedForm' ) ) {
        return [].concat(
          angular.extend(
            {
              key           : field.key,
              label         : field.templateOptions.label,
              model         : field.key + (
                // For data stored as complex objects, get the list field property
                doesFieldStoreObject( field ) ?
                  ( '.' + _.get( field, 'data.displayField', 'name' ) )
                  : ''
              ),
              templateUrl   : _.get( field, 'data.tableCellTemplateUrl' ),
              hasAnnotations: hasAnnotations( field, annotationState )
            },
            getCustomDisplayOptions( field )
          )
        );
      }
      else {
        return [];
      }
    }

    /**
     * @memberOf iscFormsFlattenedFields
     * @param field
     * @param annotationState
     * @returns {hasAnnotations}
     */
    function hasAnnotations( field, annotationState ) {
      var key     = field.key,
          context = annotationState.context,
          data    = annotationState.data;

      return function hasAnnotations( index ) {
        var filteredAnnotations = $filter( 'iscFormsContext' )( data, getContext( index ) );

        return filteredAnnotations.length > 0;
      };

      function getContext( index ) {
        var localContext = _.merge( {}, context ),
            endContext   = localContext;
        while ( endContext.context !== undefined ) {
          endContext = endContext.context;
        }
        endContext.context = {
          'key'      : key,
          'contextId': index
        };

        return localContext;
      }
    }

    /**
     * @memberOf iscFormsFlattenedFields
     * @param field
     * @returns {*}
     */
    function doesFieldStoreObject( field ) {
      return _.get( field, 'data.isObject' ) || _.get( field, 'data.displayField' );
    }

    /**
     * @memberOf iscFormsFlattenedFields
     * @param field
     * @returns {{}}
     */
    function getCustomDisplayOptions( field ) {
      var options = {},
          data    = _.get( field, 'data', {} );

      if ( data.tableCellType ) {
        options.type = data.tableCellType;
      }

      if ( data.tableCellDisplay ) {
        options.templateUrl = 'forms/foundationTemplates/tableTemplates/data.tableCellDisplay.html';
        options.display     = data.tableCellDisplay;
      }
      return options;
    }

  }

})();
