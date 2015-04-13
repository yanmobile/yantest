(function(){

  'use strict';

  iscWellnessController.$inject = [ '$log', '$translate','iscCustomConfigService', 'iscUiHelper', 'iscWellnessModel' ];

  function iscWellnessController( $log, $translate, iscCustomConfigService, iscUiHelper,iscWellnessModel ){
//    //$log.debug( 'iscWellnessController LOADED');

    var self = this;

    self.model = iscWellnessModel;
    self.iscUiHelper = iscUiHelper;
    //self.wellnessTiles = ['one', 'two', 'three'];
    self.wellnessTiles = _.toArray(self.model.getWellnessTiles());

    self.translationParams = {
      userName: 'John Doe'
    };

    self.translate = function( language ){
      $translate.use( language );
    }
  }


  angular.module('iscWellness')
      .controller('iscWellnessController', iscWellnessController );

})();
