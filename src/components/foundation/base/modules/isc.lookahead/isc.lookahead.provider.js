( function() {
  'use strict';

  angular
    .module( 'isc.lookahead' )
    .provider( 'lookaheadConfiguration', lookaheadConfiguration );

  /**
   *
   * @returns {{defaults: *, setUserConfiguration: setUserConfiguration, $get: $get}}
   */
  function lookaheadConfiguration() {

    var self                = this;
    self.formConfig         = {};
    self.tagsInputConfig    = {};
    self.autoCompleteConfig = {};

    self.defaults = {
      "form"        : {
        debug : false,
        formId: "tags"
      },
      "tagsInput"   : {
        required               : true,
        template               : "tag-template",
        displayProperty        : "text",
        keyProperty            : "text",
        tabindex               : 10,
        placeholder            : "Add Tag:",
        minLength              : 2,
        maxLength              : 25,
        minTags                : 1,
        maxTags                : 25,
        addOnEnter             : true,
        addOnSpace             : false,
        addOnComma             : false,
        addOnBlur              : false,
        addOnPaste             : false,
        pasteSplitPattern      : ",",
        replaceSpacesWithDashes: false,
        enableEditingLastTag   : false,
        addFromAutocompleteOnly: false
      },
      "autoComplete": {
        template            : "autocomplete-template",
        displayProperty     : "text",
        debounceDelay       : 100,
        minLength           : 2,
        highlightMatchedText: true,
        maxResultsToShow    : 10,
        loadOnDownArrow     : false,
        loadOnEmpty         : false,
        loadOnFocus         : false,
        selectFirstMatch    : true
      }
    };

    ////////////

    return {
      defaults            : self.defaults,
      setUserConfiguration: function( user ) {
        self.user = user;
      },
      $get                : function() {
        angular.extend( self.formConfig, self.defaults.form, self.user.form );
        angular.extend( self.tagsInputConfig, self.defaults.tagsInput, self.user.tagsInput );
        angular.extend( self.autoCompleteConfig, self.defaults.autoComplete, self.user.autoComplete );

        self.component = {
          "form"        : self.formConfig,
          "tagsInput"   : self.tagsInputConfig,
          "autoComplete": self.autoCompleteConfig
        };

        return {
          user        : self.user,
          defaults    : self.defaults,
          component   : self.component,
          form        : self.formConfig,
          tagsInputs  : self.tagsInputConfig,
          autoComplete: self.autoCompleteConfig
        };
      }
    };
  }

} )();