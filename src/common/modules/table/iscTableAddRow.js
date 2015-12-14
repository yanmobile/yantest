/**
 * Created by hzou on 08/03/15.
 */

(function(){
  'use strict';

  /* @ngInject */
  function iscTableAddRow( devlog, $state, $templateCache, $compile ){
    devlog.channel('').debug('iscTableAddRow.LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------

    var directive = {
      scope       : true, //prototypal inheritance
      restrict    : 'A',
      controllerAs: 'iscRowCtrl',
      controller  : 'iscTableRowController',
      compile     : compile
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------
    function compile(){

      return {
        pre: pre
      };

      function pre(scope, trElem, attrs, iscRowCtrl){
        iscRowCtrl.iscTblCtrl = scope.iscTblCtrl;
        iscRowCtrl.dataItem = scope.dataItem = {};
        iscRowCtrl.isAddRow = true;
        var defaultTemplate = scope.iscTblCtrl.tableConfig.editable === 'popup' ? 'table/popup/iscTablePopupRow.html' : 'table/iscTableAddRow.html';
        var addRowTemplate = _.get(scope, 'iscTblCtrl.tableConfig.addRowTemplate', defaultTemplate);

        if( addRowTemplate ){
          //for some reason the template doesn't like spaces nor comments
          var template = $templateCache.get(addRowTemplate);

          trElem.html(template);
          $compile(trElem.contents())(scope);
        }
      }
    }
  }

  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'isc.table' )
    .directive( 'iscTableAddRow', iscTableAddRow );

})();
