'use strict';

/**
 */
angular.module('openolitor-core')
  .controller('LoginController', ['$scope', '$rootScope', '$http',
    'appConfig', 'gettext', '$rootElement',
    'alertService', '$timeout', '$location', '$route', '$routeParams', 'ooAuthService', '$interval',
    '$window','SECOND_FACTOR_TYPES','ProjektService','EnumUtil','$uibModal',
    function($scope, $rootScope, $http, appConfig, gettext, $rootElement,
      alertService, $timeout, $location, $route, $routeParams, ooAuthService, $interval, $window, SECOND_FACTOR_TYPES,
      ProjektService, EnumUtil,$uibModal) {
      $scope.loginData = {};
      $scope.submitted = false;
      $scope.user = undefined;
      $scope.modalDialogShown = false;
      $scope.resetPasswordData = {};
      $scope.secondFactorData = {};       
      $scope.initPassword = {
        neu: undefined,
        neuConfirmed: undefined,
        token: undefined
      };
      $scope.secondFactorSettings = {
        secondFactorEnabled: undefined,
        secondFactorType: 'otp',
        canChangeSecondFactor: false
      };
      $scope.status = 'login';
      $scope.env = appConfig.get().ENV;
      $scope.secondFactorCountdown = 600;      

      var getSecondFactorCountdownDate = function(scope) {
        return moment().add(scope.secondFactorCountdown, 'seconds');
      }
      var startSecondFactorCountdownTimer = function(scope) {
        if (scope.cancelSecondFactorTimer) {
          $interval.cancel(scope.cancelSecondFactorTimer);
        }
        scope.secondFactorCountdown = 600;  
        scope.cancelSecondFactorTimer = $interval(function() {
          scope.secondFactorCountdown--;
          if(scope.secondFactorCountdown === 0) {
            $interval.cancel(scope.cancelSecondFactorTimer);
            scope.resetForm();
          }
        }, 1000, 0);
      }
      $scope.secondFactorCountdownDate = function() {
        return getSecondFactorCountdownDate($scope);
      };
      $scope.secondFactorType = ooAuthService.getSecondFactorType();
      $scope.secondFactorTypes = EnumUtil.asArray(SECOND_FACTOR_TYPES);

      $scope.originalTgState = $rootScope.tgState;
      $rootScope.tgState = false;

      $scope.secondFactorSettingsForm = {};
      $scope.projekt = undefined;

      var showWelcomeMessage = function(token, person, secondFactorType) {
        //show welcome message
        alertService.addAlert('info', gettext('Willkommen') + ' ' +
          person.vorname + ' ' +
          person.name);
        $timeout(function() {
          $location.path('/');
          $scope.status = 'login';
          $rootScope.tgState = $scope.originalTgState;
        }, 1000);

        ooAuthService.loggedIn(token, secondFactorType);
      };

      var showGoodbyeMessage = function(usr) {
        if(!angular.isUndefined(usr)) {
          alertService.addAlert('info', gettext('Aufwiedersehen') + ' ' +
            usr.vorname + ' ' +
            usr.name);
        }
      };

      var unwatchLoggedIn = $scope.$watch(function() {
        return ooAuthService.getUser();
      }, function(user) {
        $scope.loggedIn = ooAuthService.isUserLoggedIn(user);
        if ($scope.user !== user && $scope.loggedIn) {
          $scope.user = user;
          ProjektService.resolveProjekt().then(function(projekt) {
            $scope.projekt = projekt;            
            $scope.secondFactorSettings.canChangeSecondFactor = !projekt.twoFactorAuthentication[user.rolle];
            $scope.secondFactorSettings.secondFactorEnabled = user.secondFactorType !== undefined || projekt.twoFactorAuthentication[user.rolle];
            $scope.secondFactorSettings.secondFactorType = user.secondFactorType || projekt.defaultSecondFactorType;
            $scope.secondFactorType = ooAuthService.getSecondFactorType(); 
          });
        } 
      });


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

      var sanitizeSecretBase32 = function(secretBase32) {
        // replace base32 padding signs to make it work for all clients
        return secretBase32.replace('=', '');
      }

      var getOtpUrl = function(username, secretBase32) {
        return (
          'otpauth://totp/' +
          $window.location.hostname +
          ':' +
          username +
          '?secret=' +
          sanitizeSecretBase32(secretBase32) +
          '&algorithm=SHA1&digits=6&period=30'
        );
      };

      $scope.login = function() {
        if ($scope.loginForm.$valid) {
          $http.post(appConfig.get().API_URL + 'auth/login', $scope.loginData).then(
            function(
              result) {
              $scope.loginData.message = undefined;

              //check result
              if (result.data.status === 'SecondFactorRequired') {
                //redirect to second factor authentication
                $scope.status = result.data.secondFactorType == 'email'?'emailTwoFactor':'otpTwoFactor';
                $scope.person = result.data.person;
                $scope.secondFactorType = result.data.secondFactorType;
                if (result.data.otpSecret) {
                  $scope.otpSecret = getOtpUrl(result.data.person.email, result.data.otpSecret);
                }
                $scope.secondFactorData.token = result.data.token;

                startSecondFactorCountdownTimer($scope);
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
              showWelcomeMessage(result.data.token, result.data.person, result.data.secondFactorType);
            }, function(error) {
              $scope.secondFactorData.message = gettext(error.data);
            });
        }
      };

      $scope.showChangePassword = function() {
        $scope.modalDialogShown = true;
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'scripts/login/change_password.html',
          controller:function($uibModalInstance ,$scope){
            $scope.changePwd = {
              neu: undefined,
              alt: undefined,
              neuConfirmed: undefined
            };

            $scope.secondFactorCountdownDate = function() {
              return getSecondFactorCountdownDate($scope);
            };

            $scope.changePassword = function() {
              if ($scope.changePwdForm.$valid) {
                if ($scope.changePwd && $scope.changePwd.secondFactorAuth && !$scope.changePwd.secondFactorAuth.code){
                  // reset incomplete secondfactor auth form
                  $scope.changePwd.secondFactorAuth = undefined;
                }
                $http.post(appConfig.get().API_URL + 'auth/passwd', $scope.changePwd)
                  .then(function(result) {

                    if (result.data.status === 'SecondFactorRequired') {
                      //redirect to second factor authentication
                      $scope.status = result.data.secondFactorType == 'email'?'emailTwoFactor':'otpTwoFactor';
                      $scope.person = result.data.person;
                      $scope.changePwd.secondFactorAuth = {
                        token: result.data.token
                      };

                      startSecondFactorCountdownTimer($scope);
                    }
                    else if (result.data.status === 'Ok') {
                      $scope.changePwd.message = undefined;
                      $scope.changePwd.secondFactorAuth = undefined;
                      $uibModalInstance.close();
                    }    
                  }, function(error) {
                    $scope.changePwd.message = gettext(error.data);
                    $scope.changePwd.secondFactorAuth = undefined;
                  });
              }
            };
          }
        });
        
        modalInstance.closed.then(function(){          
          $rootScope.alerts = [];
          $scope.modalDialogShown = false;
        });

        modalInstance.result.then(function() {
          $rootScope.alerts = [];
          $scope.modalDialogShown = false;
          showPasswordChangedMessage();
        });
      };

      $scope.showResetOtp = function() {
        $scope.modalDialogShown = true;
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'scripts/login/reset_otp.html',
          controller:function($uibModalInstance ,$scope){

            $scope.resetOtpData = {};
            $scope.resetOtpConfirmData = {};     

            $scope.resetOtp = function() {
              if ($scope.resetOtpData.$valid) {
                // fetch new OTP secret from server
                $http.post(appConfig.get().API_URL + 'auth/otp/requestSecret', $scope.resetOtpData)
                    .then(function(
                      result) {
                  $scope.status = 'otp_reset';
                  $scope.otpSecret = getOtpUrl(result.data.person.email, result.data.otpSecret);          
                  $scope.resetOtpConfirmData.token = result.data.token;
                });
              }
            }
      
            $scope.submitSecondFactorReset = function() {
              if ($scope.resetOtpConfirmData.$valid) {
                $http.post(appConfig.get().API_URL + 'auth/otp/changeSecret', $scope.resetOtpConfirmData)
                  .then(function() {
                    $scope.resetOtpConfirmData.message = undefined;              
                    $scope.status = undefined;
                    $uibModalInstance.close();      
                  }, function(error) {
                    $scope.resetOtpConfirmData.message = gettext(error.data);
                  });
              }
            };
          }
        });
        
        modalInstance.closed.then(function(){
          $rootScope.alerts = [];
          $scope.modalDialogShown = false;
        });

        modalInstance.result.then(function() {
          $rootScope.alerts = [];
          $scope.modalDialogShown = false;
          alertService.addAlert('info', gettext('OTP Passwort Erfolgreich zurückgesetzt'));          
        });
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
    
      $scope.saveSecondFactorSettings = function() {
        if ($scope.secondFactorSettingsForm.$valid) {
          if ($scope.secondFactorSettings && $scope.secondFactorSettings.secondFactorAuth && !$scope.secondFactorSettings.secondFactorAuth.code){
            // reset incomplete secondfactor auth form
            $scope.secondFactorSettings.secondFactorAuth = undefined;
          }
          $http.post(appConfig.get().API_URL + 'auth/user/settings', $scope.secondFactorSettings)
            .then(function(result) {

              if (result.data.status === 'SecondFactorRequired') {
                 $scope.secondFactorSettings.secondFactorAuth = {
                   token: result.data.token
                 };

                var modalInstance = $uibModal.open({
                  animation: true,
                  templateUrl: 'scripts/login/login_settings_second_factor.html',
                  controller:function($uibModalInstance ,$scope){
                     $scope.status = result.data.secondFactorType == 'email'?'emailTwoFactor':'otpTwoFactor';
              
                    $scope.secondFactorData = {
                      code:undefined
                    };

                    $scope.secondFactorCountdownDate = function() {
                      return getSecondFactorCountdownDate($scope);
                    };

                    $scope.submit = function() {
                      if ($scope.secondFactorDataForm.$valid) {
                        $uibModalInstance.close($scope.secondFactorData)
                      }
                    } 
                    
                    startSecondFactorCountdownTimer($scope);
                  }
                });
                
                modalInstance.closed.then(function(){
                  $rootScope.alerts = [];
                  $scope.modalDialogShown = false;
                });
        
                modalInstance.result.then(function(result) {
                  $scope.secondFactorSettings.secondFactorAuth.code = result.code;
                  $scope.saveSecondFactorSettings();          
                });
              }
              else if (result.data.status === 'Ok') {
                alertService.addAlert('info', gettext('Einstellungen erfolgreich gespeichert')); 
                $scope.secondFactorType = $scope.secondFactorSettings.secondFactorType;  
                $scope.secondFactorSettings.secondFactorAuth = undefined;       
              }
            }, function(error) {
              alertService.addAlert('error', gettext('Einstellungen konnten nicht gespeichert werden'), error.data);          
              $scope.secondFactorSettings.secondFactorAuth = undefined;
            });
        }
      };

      $scope.$on('destroy', function() {
        unwatchLoggedIn();        
      });    
    }
  ]);
