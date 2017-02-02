(function() {
  return {
    "api": {
      "minlength": 1,

      "threshold" : function (model, input ) {
        return true;
      },

      "get"          : function( model, input ) {
        // Keeping the zippo call for a promise
        return iscHttpapi.get( 'http://api.zippopotam.us/us/02138', { withCredentials: false } )
          .then( function( results ) {
            return [
              {
                "displayField": "Typeahead 1",
                "value"       : "1"
              },
              {
                "displayField": "Typeahead 2",
                "value"       : "2"
              },
              {
                "displayField": "Typeahead 3",
                "value"       : "3"
              }
            ];
          } );
      },
      "resultsFilter": function( results ) {
        return results;
      }
    },

    "onSelect": function( model, item ) {
    }
  }
})();