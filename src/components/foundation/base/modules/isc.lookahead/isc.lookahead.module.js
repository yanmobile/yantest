( function() {
  'use strict';

  angular
    .module( 'isc.lookahead', ['ngTagsInput'] )
    .config( configBlock );

  /* @ngInject */
  function configBlock( tagsInputConfigProvider ) {
    tagsInputConfigProvider.setActiveInterpolation( 'tagsInput', { template: true, placeholder: true } );
    tagsInputConfigProvider.setActiveInterpolation( 'autoComplete', { template: true } );
    tagsInputConfigProvider.setDefaults( 'tagsInput', { placeholder: 'Add Tag:', template: 'tag-template' } );
  }

} )();
