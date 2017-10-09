'use strict';

angular.module('openolitor-core').directive('ooConfirmOnDirty', ['dialogService', '$location',
    function (dialogService, $location) {
        return {
            restrict: 'A',
            require: 'form',
            //scope: {
                //    isDirty: '?='
            //    ooConfirmOnDirty: '&'
            //},
            link: function ($scope, element, attr, form) {
                console.log('form: ' + form);
                //console.log('attr: ' + attr.ooConfirmOnDirty);
                //console.log('isDirty: ' + isDity);
                var isDirtyFn = undefined;
                if (typeof form.$dirty === 'boolean') {
                    console.log('lamda creation: ' + form.$dirty);
                    var fn = function () {
                        console.log('lamda execution: ' + form.$dirty);
                        return form.$dirty;
                    };
                    isDirtyFn = fn;
                }
                if (typeof $scope.ooConfirmOnDirty === 'function') {
                    isDirtyFn = $scope.ooConfirmOnDirty;
                }

                if (isDirtyFn) {
                    console.log('dirty function found!');
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

                            // var nextUrlSplitPoint = nextUrl.lastIndexOf('/') + 1;
                            // var nextUrlBasePart = nextUrl.substring(0, nextUrlSplitPoint);
                            // var nextUrlSpezPart = nextUrl.substring(nextUrlSplitPoint);

                            // var currentUrlSplitPoint = currentUrl.lastIndexOf('/') + 1;
                            // var currentUrlBasePart = currentUrl.substring(0, currentUrlSplitPoint);
                            // var currentUrlSpezPart = currentUrl.substring(currentUrlSplitPoint);

                            // console.log('nextUrl: ' + nextUrl);
                            // console.log('nextUrlSplitPoint: ' + nextUrlSplitPoint);
                            // console.log('nextUrlBasePart: ' + nextUrlBasePart);
                            // console.log('nextUrlSpezPart: ' + nextUrlSpezPart);

                            // console.log('currentUrl: ' + currentUrl);
                            // console.log('currentUrlSplitPoint: ' + currentUrlSplitPoint);
                            // console.log('currentUrlBasePart: ' + currentUrlBasePart);
                            // console.log('currentUrlSpezPart: ' + currentUrlSpezPart);

                            // var pressedSaveButton = false;

                            // if (currentUrlBasePart == nextUrlBasePart) {
                            // 	if (currentUrlSpezPart == 'new') {
                            // 		pressedSaveButton = true;
                            // 	}
                            // }

                            //if (!pressedSaveButton) {
                            event.preventDefault();
                            dialogService.displayDialogOkAbort('Do you want to leave?',
                                function () {
                                    window.onbeforeunload = undefined;
                                    locationChangeStartUnbind();
                                    $location.path(nextUrl.substring($location.absUrl().length - $location.url().length));
                                });

                            //}

                        }
                    });


                    form.destroyConfirmOnDirty = function () {
                        console.log('form.destroConfirmOnDirty called');
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