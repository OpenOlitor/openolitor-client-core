  'use strict';

  angular.module('openolitor-core')
    .factory('DetailNavigationService', [function() {

      // an ordered list of ids to enable in detail navigation
      var idList = [];
      var currentId;
      var subpath;
      var overviewPath;

      function detailWithNavigation(targetId, ids, originSubpath, originPath) {
        currentId = targetId;
        idList = ids;
        subpath = originSubpath;
        overviewPath = originPath;
      }

      /*
       * Pass the target id of the detail with the overview scope.
       */
      function detailFromOverview(targetId, $scope, originSubpath, originPath) {
        var ids = [];
        if (angular.isUndefined($scope.filteredEntries)) {
          angular.forEach($scope.entries, function(item) {
            ids.push(item.id);
          });
        } else {
          angular.forEach($scope.filteredEntries, function(item) {
            ids.push(item.id);
          });
        }

        detailWithNavigation(targetId, ids, originSubpath, originPath);
      }

      /*
       * Switching from within detail to another detail.
       */
      function detailFromWithin(targetId) {
        currentId = targetId;
      }

      function getWithOffset(offset) {
        var currentIndex = idList.indexOf(currentId);

        if (currentIndex !== -1) {
          return idList[currentIndex + offset];
        } else {
          return undefined;
        }
      }

      // return the id of the next detail in order
      function getNext() {
        return getWithOffset(1);
      }

      // Clean the kunde id list 
      function cleanKundeList() {
          idList = []; 
      }

      // return the id of the previous detail in order
      function getPrevious() {
        return getWithOffset(-1);
      }

      function getCurrentIndex() {
        return idList.indexOf(currentId);
      }

      function getListSize() {
        return idList.length;
      }

      function getSubpath() {
        return subpath;
      }

      function getOverviewPath() {
        return overviewPath;
      }

      return {
        detailFromOverview: detailFromOverview,
        detailFromWithin: detailFromWithin,
        cleanKundeList: cleanKundeList,
        getNext: getNext,
        getPrevious: getPrevious,
        getCurrentIndex: getCurrentIndex,
        getListSize: getListSize,
        getSubpath: getSubpath,
        getOverviewPath: getOverviewPath
      };
    }]);
