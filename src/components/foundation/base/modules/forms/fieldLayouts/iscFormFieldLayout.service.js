(function() {
  'use strict';

  /* @ngInject */
  angular.module( 'isc.forms' )
    .factory( 'iscFormFieldLayoutService', iscFormFieldLayoutService );

  function iscFormFieldLayoutService( $interpolate, iscCustomConfigService ) {
    var config;

    var service = {
      transformContainer: transformContainer
    };

    return service;

    /**
     * Transforms the given container of FDN FieldDefinitions by applying its layoutOptions to its fields.
     * This modifies the className property of the fieldContainer and possibly of its contained fields.
     * @param {Object} fieldContainer - The field definition in the FDN. This field is mutated by this function call.
     */
    function transformContainer( fieldContainer ) {
      var config        = getConfig(),
          layoutOptions = _.get( fieldContainer, 'data.layout' );

      if ( !layoutOptions ) {
        return;
      }

      var classes           = _.get( config, 'classes', {} ),
          breakpoints       = _.get( config, 'breakpoints', [] ),
          firstBreakpoint   = _.head( breakpoints ) || 'x-small',
          columnsSetting    = _.get( classes, 'columns', '' ),
          percentageSetting = _.get( classes, 'percentage', '' ),
          columns           = _.get( layoutOptions, 'columns' );

      // ---------------
      // Columns

      applyClassName( fieldContainer, 'grid-block' );

      // If this column layout is a number, apply the layout  by using the first -up breakpoint class.
      if ( _.isNumber( columns ) ) {
        applyClassName( fieldContainer, columnsSetting, {
          breakpoint: firstBreakpoint,
          columns   : columns
        } )
      }

      // Otherwise, check each breakpoint individually
      else if ( _.isObject( columns ) ) {
        var columnObj = columns;

        _.forEach( breakpoints, function( breakpoint ) {
          columns = _.get( columnObj, breakpoint );

          if ( columns ) {
            // If the setting itself is an object, then sub-settings are based on field index.
            // Get the max value for specified field indices so the fieldIndex can be determined.
            // E.g., if percentage widths for columns 1, 2, and 3 are specified, maxIndex = 3.
            if ( _.isObject( columns ) ) {
              var maxIndex = _.maxBy( _.keys( columns ), function( key ) {
                return parseInt( key );
              } );

              // Apply the percentage setting to each child field in this container
              var childFields = _.get( fieldContainer, 'fields' ) || _.get( fieldContainer, 'fieldGroup' );
              _.forEach( childFields, function( field, index ) {
                var thisIndex  = (index % maxIndex) + 1,
                    percentage = tryParsePercentage( columns[thisIndex] );

                if ( percentage ) {
                  applyClassName( field, percentageSetting, {
                    percentage: percentage
                  } );
                  applyClassName( field, 'grid-content' );
                }
              } );
            }
            else {
              applyClassName( fieldContainer, columnsSetting, {
                breakpoint: breakpoint,
                columns   : columns
              } );
            }
          }
        } );
      }
    }
    
    function tryParsePercentage( value ) {
      if ( _.endsWith( value, '%' ) ) {
        return value.replace( '%', '' );
      }
    }

    function applyClassName( fieldDefinition, classNameExpression, interpolatables ) {
      var className = $interpolate( classNameExpression )( interpolatables );

      if ( fieldDefinition.className ) {
        fieldDefinition.className += ' ' + className;
      }
      else {
        fieldDefinition.className = className;
      }
    }

    function getConfig() {
      // Lazy-load config property
      if ( !config ) {
        config = _.get( iscCustomConfigService.getConfig(), 'forms.fieldLayout' );
      }
      return config;
    }
  }
})();