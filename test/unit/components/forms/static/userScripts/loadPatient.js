(function () {
  return function additionalModelInit(models, params) {
    models.patient = {
      id: params.patientId
    };
    return models;
  }
})();
