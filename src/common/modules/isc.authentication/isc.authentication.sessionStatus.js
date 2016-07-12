(function() {
  'use strict';

  /**
   * @memberof core-ui-authentication
   * @ngdoc constant
   * @name SESSION_STATUS
   * @description
   * Please click the "source" link on the header to see the constants
   */
  angular
    .module( 'isc.authentication' )
    .constant( 'SESSION_STATUS', {
      alive     : 'iscAlive',
      noResponse: 'iscNoResponse',
      killed    : 'iscKilled',
      active    : 'iscActive',
      warn      : 'iscWarn',
      expired   : 'iscExpired'
    } );

})();
