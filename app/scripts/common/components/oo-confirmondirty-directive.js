'use strict';

angular.module('openolitor-core').directive('ooConfirmOnDirty', ['dialogService', '$location', 'gettext',
    function (dialogService, $location, gettext) {
        return {
            restrict: 'A',
            require: 'form',
            link: function ($scope, element, attr, form) {
                var isDirtyFn;
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
                            var dialogText = gettext('Die Seite enthält Modifikationen. Wollen Sie diese verwerfen?');
                            e.returnValue = dialogText;
                            return dialogText;
                        } else {
                            return undefined;
                        }
                    };

                    var locationChangeStartUnbind = $scope.$on('$locationChangeStart', function (event, _nextUrl) {
                        if (isDirtyFn()) {
                            // remove the trailing ?= ...
                            var nextUrl = _nextUrl.split('?')[0];

                            event.preventDefault();
                            dialogService.displayDialogOkAbort(gettext('Die Seite enthält Modifikationen. Wollen Sie diese verwerfen?'),
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
                    };

                    $scope.$on('$destroy', function () {
                        window.onbeforeunload = undefined;
                        locationChangeStartUnbind();
                    });

                }
            }
        };
    }
]);
