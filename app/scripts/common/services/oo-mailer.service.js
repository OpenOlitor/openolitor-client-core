'use strict';

/**
 */
angular.module('openolitor-core')
  .factory('MailerService', ['$http', 'API_URL',
    function($http, API_URL) {

      function getTemplates() {
        return $http.get(API_URL + 'mailtemplates');
      }

      function sendEMail(mailSendTo, Url) {
        return $http.post(API_URL + Url, mailSendTo);
      }
      
      var service = {
        getTemplates: getTemplates,
        sendEMail : sendEMail
      };

      return service;
    }
  ]);
