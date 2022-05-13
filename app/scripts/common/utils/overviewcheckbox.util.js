'use strict';

angular.module('openolitor-core')
  .factory('OverviewCheckboxUtil', function() {
    var checkboxWatchCallback = function($scope, value) {
      if(angular.isUndefined($scope.filteredEntries)) {
        angular.forEach($scope.entries, function(item) {
          $scope.checkboxes.items[item.id] = value;
        });
      } else {
        angular.forEach($scope.filteredEntries, function(item) {
          $scope.checkboxes.items[item.id] = value;
        });
      }

    };

    var dataCheckboxWatchCallback = function($scope) {
      var alreadyChecked = false;
      var checked = angular.isDefined($scope.checkboxes.checkedItems) ? $scope.checkboxes.checkedItems.length : 0,
        unchecked = angular.isDefined($scope.checkboxes.ids) ? $scope.checkboxes.ids.length : 0 - angular.isDefined($scope.checkboxes.checkedItems) ? $scope.checkboxes.checkedItems.length : 0,
        total = angular.isDefined($scope.filteredEntries) ? $scope.filteredEntries.length : 0;
      $scope.checkboxes.ids = [];
      $scope.checkboxes.checkedItems = [];
      if (!$scope.checkboxes.data) {
        $scope.checkboxes.data = {};
      }
      angular.forEach($scope.entries, function(item) {
        alreadyChecked = false;
        checked += ($scope.checkboxes.items[item.id]) || 0;
        unchecked += (!$scope.checkboxes.items[item.id]) || 0;
        if ($scope.checkboxes.items[item.id] && $scope.checkboxes.ids.length > 0) {
          angular.forEach($scope.checkboxes.ids, function(id){
            if (!alreadyChecked && (id === item.id)){
               alreadyChecked = true;
            }
          });
        }
        if (!alreadyChecked){
          if ($scope.checkboxes.items[item.id]) {
            $scope.checkboxes.ids.push(item.id);
            $scope.checkboxes.checkedItems.push(item);
          }
        }
        $scope.checkboxes.data[item.id] = item;
      });
      if ((unchecked === 0) || (checked === 0)) {
        $scope.checkboxes.checked = (checked === total) && checked > 0;
        $scope.checkboxes.checkedAny = (checked > 0);
      }
      // grayed checkbox
      else if ((checked !== 0 && unchecked !== 0)) {
        $scope.checkboxes.css = 'select-all:indeterminate';
        $scope.checkboxes.checkedAny = true;
      } else {
        $scope.checkboxes.css = 'select-all';
        $scope.checkboxes.checkedAny = true;
      }
    };

    return {
      checkboxWatchCallback: checkboxWatchCallback,
      dataCheckboxWatchCallback: dataCheckboxWatchCallback
    };
  });
