/**
 * Created by probbins on 4/25/2016
 */

( function() {
  'use strict';

  angular.module( 'isc.forms' )
    .factory( 'iscFormsPageLayoutService', iscFormsPageLayoutService );

  /* @ngInject */
  function iscFormsPageLayoutService() {
    var wizardButtonConfig = {
      cancel: {
        cssClass: 'button cancel float-left wizard-cancel-btn',
        text    : 'Cancel',
        order   : 1
      },
      prev  : {
        cssClass: 'button float-right wizard-prev-btn',
        text    : 'Prev',
        order   : 2,
        hide    : isFirstPage,
        onClick : _.partialRight( changePage, -1 )
      },
      next  : {
        cssClass: 'button float-right wizard-next-btn',
        text    : 'Next',
        order   : 3,
        hide    : isLastPage,
        onClick : _.partialRight( changePage, +1 )
      },
      submit: {
        cssClass: 'button float-right wizard-submit-btn',
        text    : 'Submit this Demo Form',
        order   : 4,
        hide    : isNotLastPage
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
        _.get( context, 'mainFormConfig.selectablePages', [] ),
        context.currentPage
      );
    }

    function changePage( context, numPages ) {
      context.selectPage( getCurrentIndex( context ) + numPages );
    }

    function isLastPage( context ) {
      return getCurrentIndex( context ) === _.get( context, 'mainFormConfig.selectablePages', [] ).length - 1;
    }

    function isNotLastPage( context ) {
      return !isLastPage( context );
    }

    function isFirstPage( context ) {
      return getCurrentIndex( context ) === 0;
    }
  }
} )();
