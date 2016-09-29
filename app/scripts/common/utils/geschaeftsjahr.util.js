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
        var geschaftsjahrInJahr = new Date(date.year.get, monat, tag, 0, 0, 0, 0);
        if(date.isBefore(geschaftsjahrInJahr)) {
            //Wir sind noch im "alten" Geschäftsjahr
            return geschaftsjahrInJahr.minusYears(1);
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
          return startDate.year.getAsText;
        } else {
          return startDate.getMonthOfYear + '/' + startDate.getYear;
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

    var getMatchingGJItem = function(array, date) {
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
        }
      });
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
