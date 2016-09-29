( function() {
  'use strict';

  angular
    .module( 'isc.lookahead' )
    .component( 'iscLookaheadComponent', {
      bindings    : {
        tags      : '=',
        source    : '=',
        rule      : '<',
        config    : '<',
        onAdd     : '&',
        onAdding  : '&',
        onRemove  : '&',
        onRemoving: '&',
        onInvalid : '&',
        onClicked : '&'
      },
      controller  : lookaheadController,
      controllerAs: 'lookCtrl',
      templateUrl : ['$element', '$attrs', function( $element, $attrs ) {
        return $attrs.templateUrl || 'isc.lookahead/isc.lookahead.html';
      }]
    } );

  /**
   * @ngdoc component
   * @memberOf isc.lookahead
   * @description Tag styled input text box with auto-complete functionality
   * @param devlog
   * @param lookaheadConfiguration
   */
  /* @ngInject */
  function lookaheadController( devlog, lookaheadConfiguration ) {
    var log = devlog.channel( 'iscLookaheadComponent' );
    log.info( 'isc.lookahead.js LOADED' );

    var self   = this;
    self.props = {};

    _.extend( self, {
      $onChanges : $onChanges,
      $onInit    : $onInit,
      $postLink  : $postLink,
      $onDestroy : $onDestroy,
      tagAdded   : tagAdded,
      tagAdding  : tagAdding,
      tagRemoved : tagRemoved,
      tagRemoving: tagRemoving,
      invalidTag : invalidTag,
      tagClicked : tagClicked
    } );

    ////////////

    // ****************************************
    // COMPONENT LIFECYCLE EVENTS
    // ****************************************
    function $onChanges( changes ) {
      log.info( '$onChanges' );
      if ( changes.rule ) {
        self.rule = angular.copy( self.rule );
        if ( !changes.rule.isFirstChange() ) {
          singleSelectRule();
        }
      }
    }

    function $onInit() {
      initProps();
      initRules();
    }

    function $postLink() {
    }

    function $onDestroy() {
    }

    // ****************************************
    // NG-TAGS-INPUT FUNCTIONS
    // ****************************************
    function tagAdded( $tag ) {
      initRules();
      self.onAdd( { $event: { tags: self.tags } } );
    };

    function tagAdding( $tag ) {
      self.onAdding( { $event: { tag: $tag } } );
    };

    function tagRemoved( $tag ) {
      initRules();
      self.onRemove( { $event: { tags: self.tags } } );
    };

    function tagRemoving( $tag ) {
      self.onRemoving( { $event: { tag: $tag } } );
    };

    function invalidTag( $tag ) {
      self.onInvalid( { $event: { tag: $tag } } );
    };

    function tagClicked( $tag ) {
      self.onClicked( { $event: { tag: $tag } } );
    };

    // ****************************************
    // COMPONENT FUNCTIONS
    // ****************************************
    function initProps() {
      setComponentProperties();
    }

    function initRules() {
      singleSelectRule();
    }

    function setComponentProperties() {

      var formConfig    = lookaheadConfiguration.form;
      var tagsInputs    = lookaheadConfiguration.tagsInputs;
      var autoCompletes = lookaheadConfiguration.autoComplete;

      log.debug( 'formConfig', formConfig );
      log.debug( 'tagsInputs', tagsInputs );
      log.debug( 'autoComplete', autoCompletes );

      var props = { form: {}, tagsInput: {}, autoComplete: {} };

      _.forIn( formConfig, function( value, key ) {
        props.form[key] = value;
      } );

      _.forIn( tagsInputs, function( value, key ) {
        props.tagsInput[key] = value;
      } );

      _.forIn( autoCompletes, function( value, key ) {
        props.autoComplete[key] = value;
      } );

      self.props = props;
      log.debug( self.props );
    }

    // Rule checks to see if only one tag selection is allowed in component
    function singleSelectRule() {
      self.props.autoComplete.maxResultsToShow = 10;
      self.props.tagsInput.placeholder         = 'User:';

      if ( self.rule.singleSelectMode && self.tags.length === 1 ) {
        self.props.autoComplete.maxResultsToShow = 0;
        self.props.tagsInput.placeholder         = '(SINGLE SELECT MODE)';
      } else if ( self.rule.singleSelectMode && self.tags.length === 2 ) {
        self.tags.splice( 1, 1 );
        self.props.autoComplete.maxResultsToShow = 0;
        self.props.tagsInput.placeholder         = '(SINGLE SELECT MODE)';
      } else if ( self.rule.singleSelectMode && self.tags.length > 2 ) {
        for ( var i = self.tags.length; i--; ) {
          self.tags.splice( i, 1 );
        }
      }
    }
  }

} )();
