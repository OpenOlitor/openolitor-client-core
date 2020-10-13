'use strict';

/**
 */
angular.module('openolitor-core')
  .factory('MailerService', ['$http', 'appConfig',
    function($http, appConfig) {

      function getTemplates() {
        return $http.get(appConfig.get().API_URL + 'mailtemplates');
      }

      function sendEMail(mailSendTo, Url) {
        return $http.post(appConfig.get().API_URL + Url, mailSendTo);
      }

      var service = {
        getTemplates: getTemplates,
        sendEMail : sendEMail
      };

      return service;
    }
  ]);
