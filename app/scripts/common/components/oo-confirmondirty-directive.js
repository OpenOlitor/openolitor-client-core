'use strict';

angular.module('openolitor-core').directive('ooConfirmOnDirty', ['dialogService', '$location',
    function (dialogService, $location) {
        return {
            restrict: 'A',
            require: 'form',
            link: function ($scope, element, attr, form) {
                var isDirtyFn = undefined;
                if (typeof form.$dirty === 'boolean') {
                    isDirtyFn = function () {
                        return form.$dirty;
                    };
                }
                if (typeof $scope.ooConfirmOnDirty === 'function') {
                    isDirtyFn = $scope.ooConfirmOnDirty;
                }

                if (isDirtyFn) {
                    window.onbeforeunload = function (e) {
                        if (isDirtyFn()) {
                            var dialogText = 'Do you want to leave this site?';
                            e.returnValue = dialogText;
                            return dialogText;
                        } else {
                            return undefined;
                        }
                    }

                    var locationChangeStartUnbind = $scope.$on('$locationChangeStart', function (event, _nextUrl, _currentUrl) {
                        if (isDirtyFn()) {
                            // remove the trailing ?= ...
                            var currentUrl = _currentUrl.split('?')[0];
                            var nextUrl = _nextUrl.split('?')[0];

                            event.preventDefault();
                            dialogService.displayDialogOkAbort('Do you want to leave?',
                                function () {
                                    window.onbeforeunload = undefined;
                                    locationChangeStartUnbind();
                                    $location.path(nextUrl.substring($location.absUrl().length - $location.url().length));
                                });


                        }
                    });


                    form.destroyConfirmOnDirty = function () {
                        window.onbeforeunload = undefined;
                        locationChangeStartUnbind();
                    }

                    $scope.$on('$destroy', function () {
                        window.onbeforeunload = undefined;
                        locationChangeStartUnbind();
                    });

                }
            }
        };
    }
]);