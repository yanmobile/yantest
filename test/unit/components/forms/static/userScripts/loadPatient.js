(function () {
  return function dataModelInit(models, params) {
    models.patient = {
      id: params.patientId
    };
    return models;
  }
})();
