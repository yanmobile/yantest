(function () {
  'use strict';

  angular.module('isc.forms')
      .filter('iscFormsContext', iscFormsContext);

  /**
   * @ngdoc filter
   * @memberOf isc.forms
   * @returns {Function}
   * @description
   * Filters a set of annotation data by the given context
   */
  /* @ngInject */
  function iscFormsContext() {
    return function (data, context) {
      var filteredData = _.filter(data, function (item) {
        var dataItem    = item.context;
        var thisContext = context;

        // Walk the context object to the end
        while (thisContext.context !== undefined) {
          thisContext = thisContext.context;
          dataItem    = dataItem.context;

          // If there is a mismatch along the way, short-circuit
          if (!isMatch()) {
            return false;
          }
        }

        // If we are here, we have matched down to the last context property
        return isMatch();

        function isMatch() {
          // If we have left the scope of the data item, this is not a match
          return thisContext && dataItem &&
              // Include iff both the key and the contextId (form id or item id) match
            dataItem.key === thisContext.key &&
            dataItem.contextId === thisContext.contextId;
        }
      });

      // Get linked conversations by annotation ID
      var annotationsIds = _.map(filteredData, 'id');
      filteredData       = filteredData.concat(_.filter(data, function (item) {
        return item.context.type === 'message' &&
          _.includes(annotationsIds, item.context.contextId);
      }));

      return filteredData;
    };
  }

})();
