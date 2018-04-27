'use strict';

/**
 */
angular.module('openolitor-core')
  .factory('MailerService', ['$http', 'API_URL',
    function($http, API_URL) {

      function getTemplates() {
        return $http.get(API_URL + 'mailtemplates');
      }

      function sendEMailToKunden(mailSendTo) {
        return $http.post(API_URL + 'mailing/sendEmailToKunden',
          mailSendTo);
      }
    
      function sendEMailToPersonen(mailSendTo) {
        return $http.post(API_URL + 'mailing/sendEmailToPersonen',
          mailSendTo);
      }
      
      function sendEMailToAbosSubscribers(mailSendTo) {
        return $http.post(API_URL + 'mailing/sendEmailToAbosSubscribers',
          mailSendTo);
      }

      var service = {
        getTemplates: getTemplates,
        sendEMailToKunden: sendEMailToKunden,
        sendEMailToPersonen : sendEMailToPersonen,
        sendEMailToAbosSubscribers : sendEMailToAbosSubscribers
      };

      return service;
    }
  ]);
