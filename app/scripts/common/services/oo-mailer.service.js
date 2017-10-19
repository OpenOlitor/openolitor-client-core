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
        return $http.post(API_URL + 'mailing/sendEMailToKunden',
          mailSendTo);
      }

      var service = {
        getTemplates: getTemplates,
        sendEMailToKunden: sendEMailToKunden
      };

      return service;
    }
  ]);
