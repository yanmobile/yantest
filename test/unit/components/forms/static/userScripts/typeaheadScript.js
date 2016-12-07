(function() {
  return {
    "api": {
      "minlength": 3,

      "get"          : function( model, input ) {
        // Keeping the zippo call for a promise
        return iscHttpapi.get( 'http://api.zippopotam.us/us/02138', { withCredentials: false } )
          .then( function( results ) {
            return [
              {
                "displayField": "TypeaheadWithScript 1",
                "value"       : "1"
              },
              {
                "displayField": "TypeaheadWithScript 2",
                "value"       : "2"
              },
              {
                "displayField": "TypeaheadWithScript 3",
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
      if ( !item ) {
        return;
      }
      model.templates.typeaheadWithScript = item;
    }
  }
})();