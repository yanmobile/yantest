(function () {
  return {
    /**
     * Function called when selecting an item from the typeahead
     * @param model {Object} - The model for this form
     * @param item {*} - The selected item, typed as in api.resultsFilter
     */
    "onSelect": function (model, item) {
      model.city  = item.value.city;
      model.state = {
        'name' : item.value.state,
        'value': item.value.abbr
      };
      model.zip   = {
        'name' : item.value.zip,
        'value': item.value.zip
      };
    },
    "api"     : {
      /**
       * The minimum length of the input string, before api.get is called
       */
      "minlength"    : 5,

      /**
       * A function called to determine whether the threshold for calling api.get has been met.
       * @param model {Object} - The model for this form
       * @param input {string} - The model value of the input using this typeahead control
       * @returns {boolean} - Whether api.get should be invoked
       */
      "threshold": function (model, input) {
        var city  = _.get(model, 'city'),
            state = _.get(model, 'state.value');

        return _.get(input, 'length', 0) >= 5 || !!(city && state);
      },

      /**
       * The external api call to make. iscHttpapi is injected to this function by the forms engine.
       * @param model {Object} - The model for this form
       * @param input {string} - The model value of the input using this typeahead control; may be used in the api call.
       * @returns {Promise} - iscHttpapi.get is a Promise, so can be returned
       */
      "get"          : function (model, input) {
        var city  = _.get(model, 'city'),
            state = _.get(model, 'state.value');

        // Needs withCredentials: false to circumvent CORS for a public api
        var apiParams = (city && state)
          ? state + '/' + city
          : input;

        return iscHttpapi.get('http://api.zippopotam.us/us/' + apiParams, {withCredentials: false});
      },
      /**
       * A filter executed on the results from api.get, which can transform the results into a form
       * more easily usable by the typeahead control.
       * @param results - Server results from api.get
       * @returns {Array} - The array of results to display in the typeahead.
       * The template's data.displayField property should be one of the properties returned to the typeahead control.
       */
      "resultsFilter": function (results) {
        return _.map(results.places, function (result) {
          // State and post code may be either in the root object or in each result,
          // depending on whether the api was called for city+state by zip, or for zip by city+state.
          var city  = _.get(result, 'place name', ''),
              state = _.get(result, 'state', '')
                || _.get(results, 'state', ''),
              abbr  = _.get(result, 'state abbreviation', '')
                || _.get(results, 'state abbreviation', ''),
              zip   = _.get(result, 'post code', '')
                || _.get(results, 'post code', '');
          return {
            'name' : city + ', ' + abbr + ' ' + zip,
            'value': {
              city : city,
              state: state,
              abbr : abbr,
              zip  : zip
            }
          }
        });
      }
    }
  }
})();