'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */

mainAngularModule
    .directive('sidebar', ['AuthFactory', function (AuthFactory) {
        //console.log(AuthFactory);
        return {
            templateUrl: 'scripts/directives/sidebar/sidebar.html',
            restrict: 'E',
            replace: true,
            scope: {},
            controller: function ($scope) {
                $scope.selectedMenu = 'dashboard';
                $scope.collapseVar = 0;
                $scope.multiCollapseVar = 0;
                $scope.userInfo = null;

                $scope.counter = 5;

                $scope.setSidebar = function () {
                    //console.log("entro nella setSidebar");
                    //$scope.userInfo = AuthFactory.getAuthInfo();
                    //console.log($scope.userInfo);
                    $scope.sidebarList = {
                        lists: [
                            {
                                "title": "Batch",
                                "num": 5,
                                "icon": "fa-user",
                                "state": "batch.info"
                            },
                            {
                                "title": "Real time",
                                "num": 6,
                                "icon": "fa-ticket",
                                "state": "realtime.info"
                            },
                            {
                                "title": "Sensors",
                                "num": 7,
                                "icon": "fa-lock",
                                "state": "sensors.info"
                            }
                        ]
                    }
                };

                $scope.incrementCounter = function () {
                    $scope.counter++;
                };

                $scope.resetCounter = function () {
                    $scope.counter = 0;
                };

                $scope.$watch(function () {
                    return AuthFactory.getAuthInfo;
                }, function () {
                    $scope.setSidebar();
                });

                $scope.check = function (x) {

                    if (x == $scope.collapseVar)
                        $scope.collapseVar = 0;
                    else
                        $scope.collapseVar = x;
                };

                $scope.multiCheck = function (y) {

                    if (y == $scope.multiCollapseVar)
                        $scope.multiCollapseVar = 0;
                    else
                        $scope.multiCollapseVar = y;
                };
            }
        }
    }]);
