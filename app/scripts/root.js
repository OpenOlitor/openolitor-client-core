'use strict';

/**
 */
angular.module('openolitor-core')
  .controller('OpenOlitorRootController', ['$scope', '$rootScope',
    'ServerService', 'ProjektService', 'gettextCatalog', 'amMoment',
    '$location', 'msgBus', 'checkSize', '$window', '$timeout', 'BUILD_NR',
    'ooAuthService', '$cookies', 'appConfig',
    function($scope, $rootScope, ServerService, ProjektService,
      gettextCatalog, amMoment, $location, msgBus, checkSize, $window,
      $timeout, BUILD_NR, ooAuthService, $cookies, appConfig) {
      angular.element($window).bind('resize', function() {
        checkSize();
      });

      $scope.currentPathContains = function(pathJunk) {
        return $location.url().indexOf(pathJunk) !== -1;
      };

      //initial launch
      checkSize();

      $scope.connected = false;

      var unwatchLoggedIn = $scope.$watch(function() {
        return ooAuthService.getUser();
      }, function(user) {
        $scope.loggedIn = ooAuthService.isUserLoggedIn(user);
        $scope.user = user;        

        if($scope.loggedIn) {
          $scope.secondFactorType = ooAuthService.getSecondFactorType();
          ProjektService.resolveProjekt().then(function(projekt) {
            $scope.projekt = projekt;
            $rootScope.projekt = projekt;
          });
        }
      });

      $timeout(function() {
        $scope.menushow[angular.element('.sidebar-nav .active').parent()
          .attr(
            'activate-id')] = true;
      }, 0);

      var unwatchStaticServerInfo = $scope.$watch(ServerService.getStaticServerInfo,
        function(info) {
          if (!angular.isUndefined(info)) {
            $scope.serverInfo = info;
            $scope.connected = true;
          }
        });

      $scope.buildNr = BUILD_NR;
      $scope.env = appConfig.get().ENV;

      msgBus.onMsg('WebSocketClosed', $rootScope, function(event, msg) {
        $scope.connected = false;
        $scope.messagingSocketClosedReason = msg.reason;
        if(angular.isUndefined($scope.messagingSocketClosedSetter)) {
          $scope.messagingSocketClosedSetter = $timeout(function() {
            $scope.showConnectionErrorMessage = true;
            $scope.messagingSocketClosedSetter = undefined;
          }, 30000);
        }
        $scope.$apply();
      });

      msgBus.onMsg('WebSocketOpen', $rootScope, function() {
        $scope.connected = true;
        $scope.showConnectionErrorMessage = false;
        if(!angular.isUndefined($scope.messagingSocketClosedSetter) &&
          !angular.isUndefined($scope.messagingSocketClosedSetter.close)) {
          $scope.messagingSocketClosedSetter.close();
          $scope.messagingSocketClosedSetter = undefined;
        }
        $scope.messagingSocketClosedReason = '';
        $scope.$apply();
      });

      $scope.changeLang = function(lang) {
        if (!angular.isUndefined(lang)) {
          gettextCatalog.setCurrentLanguage(lang);
          amMoment.changeLocale(lang);
          $scope.storeActiveLang(lang);
          $scope.$emit('languageChanged');
        }
      };

      $scope.displayActiveLang = function() {
        switch(gettextCatalog.getCurrentLanguage()){
          case 'en_US': return 'en';
          case 'cs_CZ': return 'cs';
          case 'es_ES': return 'es';
          case 'hu_HU': return 'hu';
          default: return(gettextCatalog.getCurrentLanguage());
        }
      };

      $scope.activeLang = function() {
        return gettextCatalog.getCurrentLanguage();
      };

      $scope.storedActiveLang = function() {
        return $cookies.get('activeLang');
      };

      $scope.storeActiveLang = function(lang) {
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 3650);
        $cookies.put('activeLang', lang, {'expires':expireDate});
      };

      if (angular.isUndefined($scope.storedActiveLang())) {
        var lang = $window.navigator.language || $window.navigator.userLanguage;
        if (lang.startsWith('de-CH')) {
          $scope.changeLang('de_CH');
        } else if (lang.startsWith('de-DE')) {
          $scope.changeLang('de_DE');
        } else if (lang.startsWith('de-DO')) {
          $scope.changeLang('de_DO');
        } else if (lang.startsWith('de')) {
          $scope.changeLang('de_DE');
        } else if (lang.startsWith('fr-BE')) {
          $scope.changeLang('fr_BE');
        } else if (lang.startsWith('fr-CH')) {
          $scope.changeLang('fr_CH');
        } else if (lang.startsWith('fr')) {
          $scope.changeLang('fr_CH');
        } else if (lang.startsWith('en')) {
          $scope.changeLang('en_US');
        } else if (lang.startsWith('es')) {
          $scope.changeLang('es_ES');
        } else if (lang.startsWith('cs')) {
          $scope.changeLang('cs_CZ');
        } else if (lang.startsWith('hu')) {
          $scope.changeLang('hu_HU');
        } else {
          $scope.changeLang('en_US');
        }
      } else {
        $scope.changeLang($scope.storedActiveLang());
      }

      $scope.$on('destroy', function() {
        unwatchLoggedIn();
        unwatchStaticServerInfo();
      });

    }
  ]);
