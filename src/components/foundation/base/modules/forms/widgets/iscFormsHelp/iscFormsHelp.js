/**
 * Created by paul robbins on 10/17/16
 *
 */

( function() {
  'use strict';

  angular.module( 'isc.forms' )
    .component( 'iscFormsHelp', {
      bindings    : {
        helpContent: '<'
      },
      transclude  : true,
      controllerAs: 'helpCtrl',
      controller  : controller,
      templateUrl : /* @ngInject */ function( $attrs ) {
        return $attrs.templateUrl || 'forms/widgets/iscFormsHelp/iscFormsHelp.html';
      }
    } );

  /* @ngInject */
  function controller( $sce, $translate ) {
    var self = this;

    _.extend( self, {
      showHelp      : false,
      toggleHelp    : toggleHelp,
      getHelpContent: getHelpContent
    } );

    function toggleHelp() {
      self.showHelp = !self.showHelp;
    }

    function getHelpContent() {
      return $sce.trustAsHtml( $translate.instant( self.helpContent ) );
    }
  }

} )();
