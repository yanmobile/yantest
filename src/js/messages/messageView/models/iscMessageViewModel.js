/**
 * Created by douglasgoodman on 11/18/14.
 */

(function(){
  'use strict';

  iscMessageViewModel.$inject = [ '$log'];

  function iscMessageViewModel( $log ){
//    //$log.debug( 'iscMessageViewModel LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    var selectedMail;

    var currentMailReply = {
      to: '',
      from: '',
      subject: '',
      body: ''
    };

    // ----------------------------
    // class factory
    // ----------------------------
    var model = {
      getSelectedMail: getSelectedMail,
      setSelectedMail: setSelectedMail,

      getCurrentMailReply: getCurrentMailReply,
      initReply: initReply,
      replyIsValid: replyIsValid
    };

    return model;

    // ----------------------------
    // functions
    // ----------------------------

    // ----------------
    // selected mail
    function getSelectedMail(){
      return selectedMail;
    }

    function setSelectedMail( val ){
      //$log.debug( 'iscMessageViewModel.setSelectedMail', val );
      selectedMail = val;
    }

    // ----------------
    // reply functions
    function getCurrentMailReply(){
      return currentMailReply;
    }

    function initReply( mail ){
      currentMailReply.subject = 'RE: ' + mail.Subject;
      currentMailReply.from =  mail.To;
      currentMailReply.to = mail.From;
      currentMailReply.body = '';

      return currentMailReply;
    }

    function replyIsValid(){
      //$log.debug( 'iscMessageViewModel.replyIsValid', currentMailReply );
      var retVal = _.every( currentMailReply, function( val, key ){
        return !!val;
      });
      return retVal;
    }

  }// END CLASS

  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'iscMessages' )
      .factory( 'iscMessageViewModel', iscMessageViewModel );

})();
