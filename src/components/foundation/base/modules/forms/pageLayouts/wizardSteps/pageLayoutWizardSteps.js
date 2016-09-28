/**
 * Created by probbins on 4/26/2016
 */

( function() {
  'use strict';

  angular.module( 'isc.forms' )
    .directive( 'pageLayoutWizardSteps', pageLayoutWizardSteps );

  /* @ngInject */
  function pageLayoutWizardSteps() {
    return {
      restrict        : 'E',
      replace         : true,
      scope           : {
        context: '='
      },
      bindToController: true,
      controllerAs    : 'wizardStepsCtrl',
      controller      : _.noop,
      templateUrl     : function( elem, attrs ) {
        return attrs.templateUrl || 'forms/pageLayouts/wizardSteps/pageLayoutWizardSteps.html';
      }
    };
  }

} )();
