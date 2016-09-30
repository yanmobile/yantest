( function() {
  'use strict';

  angular
    .module( 'isc.lookahead', ['ngTagsInput'] )
    .config( configBlock );

  /**
   *
   * @param tagsInputConfigProvider
   * @param lookaheadConfigurationProvider
   */
  /* @ngInject */
  function configBlock( tagsInputConfigProvider, lookaheadConfigurationProvider ) {

    // If a property is set to true the value can be updated in real-time.
    tagsInputConfigProvider.setActiveInterpolation( 'tagsInput', {
      template               : true,
      displayProperty        : true,
      keyProperty            : true,
      placeholder            : true,
      minLength              : true,
      maxLength              : true,
      minTags                : true,
      maxTags                : true,
      addOnEnter             : false,
      addOnSpace             : false,
      addOnComma             : false,
      addOnBlur              : false,
      addOnPaste             : false,
      pasteSplitPattern      : false,
      replaceSpacesWithDashes: false,
      enableEditingLastTag   : false,
      addFromAutocompleteOnly: true
    } );

    tagsInputConfigProvider.setActiveInterpolation( 'autoComplete', {
      template            : true,
      displayProperty     : true,
      debounceDelay       : true,
      minLength           : true,
      highlightMatchedText: true,
      maxResultsToShow    : true,
      loadOnDownArrow     : false,
      loadOnEmpty         : false,
      loadOnFocus         : false,
      selectFirstMatch    : false
    } );

    ////////////

    var formProperties         = {},
        tagsInputProperties    = {},
        autoCompleteProperties = {};

    _.forIn( lookaheadConfigurationProvider.defaults.form, function( value, key ) {
      formProperties[key] = value;
    } );

    _.forIn( lookaheadConfigurationProvider.defaults.tagsInput, function( value, key ) {
      tagsInputProperties[key] = value;
    } );

    _.forIn( lookaheadConfigurationProvider.defaults.autoComplete, function( value, key ) {
      autoCompleteProperties[key] = value;
    } );

    tagsInputConfigProvider.setDefaults( 'tagsInput', tagsInputProperties );
    tagsInputConfigProvider.setDefaults( 'autoComplete', autoCompleteProperties );
  }

} )();
