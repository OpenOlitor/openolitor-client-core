'use strict';

angular.module('openolitor-core')
  .factory('GeschaeftsjahrUtil', function() {
    /*
    * Der Moment beschreibt den Start des Geschäftsjahrs. Dieses dauert dann ein Jahr lang.
    */
    function Geschaeftsjahr(monat, tag, jahr) {
      /**
       * Errechnet den Start des Geschäftsjahres aufgrund eines Datums
       */
      this.start = function(date) {
        if(angular.isUndefined) {
          date = new Date();
        }
        var geschaftsjahrInJahr = new Date(date.getFullYear(), monat, tag, 0, 0, 0, 0);
        if(date < geschaftsjahrInJahr) {
            //Wir sind noch im "alten" Geschäftsjahr
            geschaftsjahrInJahr.setFullYear(geschaftsjahrInJahr.getFullYear() - 1);
            return geschaftsjahrInJahr;
        } else {
            //Wir sind bereits im neuen Geschäftsjahr
            return geschaftsjahrInJahr;
        }
      };

      /**
       * Errechnet der Key für ein Geschäftsjahr aufgrund eines Datum. Der Key des Geschäftsjahres leitet sich aus dem Startdatum
       * des Geschäftsjahres ab. Wird der Start des Geschäftsjahres auf den Start des Kalenderjahres gesetzt, wird das Kalenderjahr als
       * key benutzt, ansonsten setzt sich der Key aus Monat/Jahr zusammen
       */
      this.key = function(date) {
        if(angular.isUndefined) {
          date = new Date();
        }
        var startDate = this.start(date);
        if (monat === 1 && tag === 1) {
          return startDate.getFullYear();
        } else {
          return (startDate.getMonth() + 1) + '/' + startDate.getFullYear;
        }
      };

      this.isIn = function(date) {
        var usedJahr = jahr;
        if(angular.isUndefined(usedJahr)) {
          //using this year
          usedJahr = new Date().getFullYear();
        }
        var usedTag = tag;
        if(angular.isUndefined(usedTag)) {
          usedTag = 1;
        }
        var gjStart = new Date(usedJahr, monat - 1, usedTag);
        var gjEnd = new Date(usedJahr + 1, monat - 1, usedTag);
        return date > gjStart && date < gjEnd;

      };

      this.isInOrLater = function(date) {
        var usedJahr = jahr;
        if(angular.isUndefined(usedJahr)) {
          //using this year
          usedJahr = new Date().getFullYear();
        }
        var usedTag = tag;
        if(angular.isUndefined(usedTag)) {
          usedTag = 1;
        }
        var gjStart = new Date(usedJahr, monat - 1, usedTag);
        return date > gjStart;

      };
    }

    var isInCurrentGJ = function(projekt, date) {
      return new Geschaeftsjahr(projekt.geschaeftsjahrMonat, projekt.geschaeftsjahrTag).isIn(date);
    };

    var isInCurrentOrLaterGJ = function(projekt, date) {
      return new Geschaeftsjahr(projekt.geschaeftsjahrMonat, projekt.geschaeftsjahrTag).isInOrLater(date);
    };

    var getMatchingGJItem = function(array, projekt, date) {
      if(angular.isUndefined(date)) {
        date = new Date();
      }
      var matchingElement;
      angular.forEach(array, function(value) {
        if(!angular.isUndefined(value.key) && value.key.indexOf('/') !== -1) {
          var elem = value.key.split('/');
          var gj = new Geschaeftsjahr(elem[0], 1, elem[1]);
          if(gj.isIn(date)) {
            matchingElement = value;
          }
        } else {
          var gj2 = new Geschaeftsjahr(1, 1, value.key);
          if(gj2.isIn(date)) {
            matchingElement = value;
          }
        }
      });
      if(angular.isUndefined(matchingElement) && !angular.isUndefined(projekt)) {
        matchingElement = {
          key: new Geschaeftsjahr(projekt.geschaeftsjahrMonat, projekt.geschaeftsjahrTag).key(date),
          value: 0
        };
      }
      return matchingElement;
    };

    var setOnMatchingGJItem = function(array, val2set, date) {
      var match = getMatchingGJItem(array, date);
      if(!angular.isUndefined(match)) {
        match.value = val2set;
      }
    };

    return {
      isInCurrentGJ: isInCurrentGJ,
      isInCurrentOrLaterGJ: isInCurrentOrLaterGJ,
      getMatchingGJItem: getMatchingGJItem,
      setOnMatchingGJItem: setOnMatchingGJItem
    };
  });
