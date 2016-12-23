/**
 * Created by probbins on 4/25/2016
 */

( function() {
  'use strict';

  angular.module( 'isc.forms' )
    .factory( 'iscFormsSectionLayoutService', iscFormsSectionLayoutService );

  /* @ngInject */
  function iscFormsSectionLayoutService( $translate ) {
    var wizardButtonConfig = {
      buttons: {
        cancel: {
          className: 'button cancel float-left wizard-cancel-btn',
          text     : 'Forms_Cancel_Button',
          order    : 1
        },
        prev  : {
          className: 'button float-right wizard-prev-btn',
          text     : 'Forms_Prev_Button',
          order    : 2,
          hide     : isFirstSection,
          onClick  : _.partialRight( changeSection, -1 )
        },
        next  : {
          className: 'button float-right wizard-next-btn',
          text     : 'Forms_Next_Button',
          order    : 3,
          hide     : isLastSection,
          onClick  : _.partialRight( changeSection, +1 )
        },
        submit: {
          className: 'button float-right wizard-submit-btn',
          text     : 'Forms_Submit_Button',
          order    : 4,
          hide     : isNotLastSection
        }
      }
    };

    return {
      getWizardButtonConfig: getWizardButtonConfig
    };

    function getWizardButtonConfig() {
      return angular.copy( wizardButtonConfig );
    }

    function getCurrentIndex( context ) {
      return _.indexOf(
        _.get( context, 'mainFormConfig.selectableSections', [] ),
        context.currentSection
      );
    }

    function changeSection( context, numSections ) {
      context.selectSection( getCurrentIndex( context ) + numSections );
    }

    function isLastSection( context ) {
      return getCurrentIndex( context ) === _.get( context, 'mainFormConfig.selectableSections', [] ).length - 1;
    }

    function isNotLastSection( context ) {
      return !isLastSection( context );
    }

    function isFirstSection( context ) {
      return getCurrentIndex( context ) === 0;
    }
  }
} )();
