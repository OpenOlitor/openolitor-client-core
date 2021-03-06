'use strict';

/**
 */
angular.module('openolitor-core')
  .controller('LoginController', ['$scope', '$rootScope', '$http',
    'appConfig', 'gettext', '$rootElement',
    'alertService', '$timeout', '$location', '$route', '$routeParams', 'ooAuthService', '$interval',
    function($scope, $rootScope, $http, appConfig, gettext, $rootElement,
      alertService, $timeout, $location, $route, $routeParams, ooAuthService, $interval) {
      $scope.loginData = {};
      $scope.submitted = false;
      $scope.resetPasswordData = {};
      $scope.secondFactorData = {};
      $scope.changePwd = {
        neu: undefined,
        alt: undefined,
        neuConfirmed: undefined
      };
      $scope.initPassword = {
        neu: undefined,
        neuConfirmed: undefined,
        token: undefined
      };
      $scope.status = 'login';
      $scope.env = appConfig.get().ENV;
      $scope.secondFactorCountdown = 600;
      $scope.secondFactorCountdownDate = function() {
        return moment().add($scope.secondFactorCountdown, 'seconds');
      };

      $scope.originalTgState = $rootScope.tgState;
      $rootScope.tgState = false;

      var showWelcomeMessage = function(token, person) {
        //show welcome message
        alertService.addAlert('info', gettext('Willkommen') + ' ' +
          person.vorname + ' ' +
          person.name);
        $timeout(function() {
          $location.path('/');
          $scope.status = 'login';
          $rootScope.tgState = $scope.originalTgState;
        }, 1000);

        ooAuthService.loggedIn(token);
      };

      var showGoodbyeMessage = function(usr) {
        if(!angular.isUndefined(usr)) {
          alertService.addAlert('info', gettext('Aufwiedersehen') + ' ' +
            usr.vorname + ' ' +
            usr.name);
        }
      };

      $scope.appName = $rootElement.attr('ng-app');

      var doLogout = function(showMessage, msg) {
        var usr = ooAuthService.getUser();
        $http.post(appConfig.get().API_URL + 'auth/logout').then(function() {
          $scope.loginData.message = undefined;

          ooAuthService.loggedOut();
          if (showMessage) {
            showGoodbyeMessage(usr);
          }

          $timeout(function() {
            $scope.status = 'login';
            if (msg && msg !== '') {
              $location.path('/login').search('msg', msg);
            } else {
              $location.path('/login');
            }
          }, 1000);
        });
      };

      var showPasswordChangedMessage = function() {
        //show welcome message
        alertService.addAlert('info', gettext(
          'Passwort wurde erfolgreich geändert, Sie werden automatisch ausgelogged.'
        ));

        doLogout(false, gettext(
          'Passwort wurde erfolgreich geändert, Sie wurden automatisch ausgelogged. Bitte loggen Sie sich mit dem neuen Passwort erneut an.'
        ));
      };

      var showPasswordSetMessage = function() {
        alertService.addAlert('info', gettext(
          'Das Passwort wurde erfolgreich gesetzt. Sie können sich nun anmelden.'
        ));

        $timeout(function() {
          $location.path('/login');
        }, 1000);
      };

      var logout = $route.current.$$route.logout;
      if (logout) {
        doLogout(true);
      }
      var msg = $routeParams.msg;
      if (msg && msg !== '') {
        $scope.loginData.message = msg;
      }

      $scope.login = function() {
        if ($scope.loginForm.$valid) {
          $http.post(appConfig.get().API_URL + 'auth/login', $scope.loginData).then(
            function(
              result) {
              $scope.loginData.message = undefined;

              //check result
              if (result.data.status === 'LoginSecondFactorRequired') {
                //redirect to second factor authentication
                $scope.status = 'twoFactor';
                $scope.person = result.data.person;
                $scope.secondFactorData.token = result.data.token;

                $scope.cancelSecondFactorTimer = $interval(function() {
                  $scope.secondFactorCountdown--;
                  if($scope.secondFactorCountdown === 0) {
                    $interval.cancel($scope.cancelSecondFactorTimer);
                    $scope.resetForm();
                  }
                }, 1000, 0);
              } else {
                showWelcomeMessage(result.data.token, result.data.person);
              }
            },
            function(error) {
              $scope.loginData.message = gettext(error.data);
            });
        }
      };

      $scope.secondFactorLogin = function() {
        if ($scope.secondFactorForm.$valid) {
          $http.post(appConfig.get().API_URL + 'auth/secondFactor', $scope.secondFactorData)
            .then(function(
              result) {
              $scope.secondFactorData.message = undefined;
              if ($scope.cancelSecondFactorTimer) {
                $interval.cancel($scope.cancelSecondFactorTimer);
              }
              showWelcomeMessage(result.data.token, result.data.person);
            }, function(error) {
              $scope.secondFactorData.message = gettext(error.data);
            });
        }
      };

      $scope.changePassword = function() {
        if ($scope.changePwdForm.$valid) {
          $http.post(appConfig.get().API_URL + 'auth/passwd', $scope.changePwd)
            .then(function() {
              $scope.changePwd.message = undefined;
              showPasswordChangedMessage();
            }, function(error) {
              $scope.changePwd.message = gettext(error.data);
            });
        }
      };

      $scope.setPassword = function() {
        if ($scope.setPasswordForm.$valid) {
          $scope.initPassword.token = $routeParams.token;
          $http.post(appConfig.get().API_URL + 'auth/zugangaktivieren', $scope.initPassword)
            .then(function() {
              $scope.initPassword.message = undefined;
              showPasswordSetMessage();
            }, function(error) {
              $scope.initPassword.message = gettext(error.data);
            });
        }
      };

      $scope.resetPassword = function() {
        if ($scope.resetPasswordForm.$valid) {
          $http.post(appConfig.get().API_URL + 'auth/passwordreset', $scope.resetPasswordData).then(
            function() {
              $scope.resetPasswordData.message = undefined;
              $scope.submitted = true;
            },
            function(error) {
              $scope.resetPasswordData.message = gettext(error.data);
            });
        }
      };

      $scope.resetForm = function() {
        $scope.loginData = {};
        $scope.status = 'login';
      };
    }
  ]);
