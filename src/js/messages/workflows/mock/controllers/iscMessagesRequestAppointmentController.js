

(function(){

  'use strict';

  iscMessagesRequestAppointmentController.$inject = [ '$log'];

  function iscMessagesRequestAppointmentController( $log ){
    //$log.debug( 'iscMessagesRequestAppointmentController LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    var self = this;


    self.isStepComplete = false;

    self.isFormComplete = false;

    self.data={
      steps:[

        {
          'name': 'ISC_MESSAGES_REQUEST_APPOINTMENT_STEP1_TITLE',
          'directives': [{
            'name':'mock-dir1',
            'complete': false

          },
            {
              'name':'mock-dir2',
              'complete': false
            }]
        },

        {
          'name':'ISC_MESSAGES_REQUEST_APPOINTMENT_STEP2_TITLE',
          'directives': [{
            'name':'mock-dir2',
            'complete': false

          },
            {
              'name':'mock-dir1',
              'complete': false
            }]
        },
        {
          'name':'ISC_MESSAGES_REQUEST_APPOINTMENT_STEP3_TITLE',
          'directives': [{
            'name':'mock-dir1',
            'complete': false

          },
            {
              'name':'mock-dir2',
              'complete': false
            }]
        }

      ]

    };

    self.allSteps = new Array(self.data.steps.length);

    self.selectedIndex = 0;


    self.doStepComplete = function(myScope,state){



      if(state ===undefined){

        return;
      }


      //move those things into vars.


      var totalSteps = self.data.steps[self.selectedIndex].directives.length;

      var myStep = self.data.steps[self.selectedIndex];

      //first set the state for the particular directive
      for (var ii=0;ii<totalSteps;ii++){

        if (myStep.directives[ii].name === myScope.directive.name)
        {
          if (myStep.directives[ii].complete==true){
            myStep.directives[ii].complete = false;
          }
          else{
            myStep.directives[ii].complete = true;
          }



        }
      }



      self.isStepComplete = true;
      //then loop again to make sure they are all true
      for (var ii=0;ii<totalSteps;ii++) {

        if (myStep.directives[ii].complete!=true){

          self.isStepComplete= false;
        }

      }


    };


    self.submitForm = function(){

      alert('logic to send to server goes here');

    };




    self.next = function(){

      if (isStepDone()){

        self.allSteps[self.selectedIndex]=true;

        if (self.selectedIndex<self.data.steps.length-1){
          self.selectedIndex ++;

          if (self.allSteps[self.selectedIndex]){
            self.isStepComplete=true;

          }
          else{
            self.isStepComplete=false;
          }
        }



      }



    };



    self.previous = function(){

      self.allSteps[self.selectedIndex]= self.isStepComplete;


      if (self.selectedIndex>0){

        self.selectedIndex--;

        self.isStepComplete=self.allSteps[self.selectedIndex];
      }



    };


    self.done = function(){

      if (isStepDone()){

        self.isFormComplete = true;

      }

    };


    self.submitForm = function(){

      alert('logic to send to server goes here');

    };


    function isStepDone(){

      if (!self.isStepComplete){
        alert('please complete the step first');
        return false;
      }

      return true;

    }

  }// END CLASS


  // ----------------------------
  // injection
  // ----------------------------
  angular.module('iscMessages')
    .controller('iscMessagesRequestAppointmentController', iscMessagesRequestAppointmentController );

})();
