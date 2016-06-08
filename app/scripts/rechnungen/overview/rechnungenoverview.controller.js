'use strict';

/**
 */
angular.module('openolitor')
  .controller('RechnungenOverviewController', ['$q', '$scope', '$filter',
    '$location',
    'RechnungenOverviewModel', 'ngTableParams',
    function($q, $scope, $filter, $location, RechnungenOverviewModel,
      ngTableParams) {

      $scope.entries = [];
      $scope.filteredEntries = [];
      $scope.loading = false;
      $scope.model = {};

      $scope.search = {
        query: ''
      };

      $scope.hasData = function() {
        return $scope.entries !== undefined;
      };

      $scope.checkboxes = {
        checked: false,
        checkedAny: false,
        items: {},
        css: '',
        ids: []
      };

      // watch for check all checkbox
      $scope.$watch(function() {
        return $scope.checkboxes.checked;
      }, function(value) {
        angular.forEach($scope.filteredEntries, function(item) {
          $scope.checkboxes.items[item.id] = value;
        });
      });

      // watch for data checkboxes
      $scope.$watch(function() {
        return $scope.checkboxes.items;
      }, function() {
        var checked = 0,
          unchecked = 0,
          total = $scope.filteredEntries.length;
        $scope.checkboxes.ids = [];
        angular.forEach($scope.filteredEntries, function(item) {
          checked += ($scope.checkboxes.items[item.id]) || 0;
          unchecked += (!$scope.checkboxes.items[item.id]) || 0;
          if ($scope.checkboxes.items[item.id]) {
            $scope.checkboxes.ids.push(item.id);
          }
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
      }, true);

      $scope.actions = [{
        labelFunction: function() {
          return 'Rechnung erstellen';
        },
        noEntityText: true,
        iconClass: 'glyphicon glyphicon-plus',
        onExecute: function() {
          return $location.path('/rechnungen/new');
        }
      }, {
        label: 'Rechnungen drucken',
        iconClass: 'fa fa-print',
        onExecute: function() {
          $scope.showGenerateReport = true;
          return true;
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
        }
      }];

      if (!$scope.tableParams) {
        //use default tableParams
        $scope.tableParams = new ngTableParams({ // jshint ignore:line
          page: 1,
          count: 10,
          sorting: {
            name: 'asc'
          },
          filter: {
            status: ''
          }
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          getData: function($defer, params) {
            if (!$scope.entries) {
              return;
            }
            // use build-in angular filter
            var filteredData = $filter('filter')($scope.entries,
              $scope.search.query);
            var orderedData = $filter('filter')(filteredData, params.filter());
            orderedData = params.sorting ?
              $filter('orderBy')(orderedData, params.orderBy()) :
              orderedData;

            $scope.filteredEntries = filteredData;

            params.total(orderedData.length);
            $defer.resolve(orderedData.slice((params.page() - 1) *
              params.count(), params.page() * params.count()));
          }

        });
      }

      function search() {
        if ($scope.loading) {
          return;
        }
        //  $scope.entries = $scope.dummyEntries;
        $scope.tableParams.reload();

        $scope.loading = true;
        $scope.entries = RechnungenOverviewModel.query({
          q: $scope.query
        }, function() {
          $scope.tableParams.reload();
          $scope.loading = false;
        });
      }

      search();

      $scope.$watch('search.query', function() {
        search();
      }, true);

      $scope.closeBericht = function() {
        $scope.showGenerateReport = false;
      };
    }
  ]);
