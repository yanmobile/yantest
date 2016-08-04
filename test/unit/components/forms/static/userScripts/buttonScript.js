(function() {
  return {
    /**
     * @description The callback for the button.
     * @param scope - The button field's scope
     */
    "onClick": function( scope ) {
      scope.formState.buttonUserScriptCalled = true;
    }
  };
})();