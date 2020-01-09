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
                    $scope.sidebarList = {
                        lists: [
                            {
                                "title": "Real Time",
                                "num": 1,
                                "icon": "fa-cloud",
                                item:[
                                    {
                                        "nome": "Query1",
                                        "state": "realtime.query1"
                                    },
                                    {
                                        "nome": "Query2",
                                        "state": "realtime.query2"
                                    }
                                ]
                            },
                            {
                                "title": "Batch",
                                "num": 2,
                                "icon": "fa-cogs",
                                item:[
                                    {
                                        "nome": "Query1",
                                        "state": "batch.query1"
                                    },
                                    {
                                        "nome": "Query2",
                                        "state": "batch.query2"
                                    }
                                ]
                            },
                            {
                                "title": "Sensors",
                                "num": 3,
                                "icon": "fa-sitemap",
                                item: [
                                    {
                                        "nome": "Sensors",
                                        "state": "sensors.info"
                                    },
                                    {
                                        "nome": "Maps",
                                        "state": "sensors.maps"
                                    },
                                    {
                                        "nome": "Failures",
                                        "state": "sensors.failures"
                                    },
                                    {
                                        "nome": "Add Sensor",
                                        "state": "sensors.create"
                                    }
                                ]
                            },
                            {
                                "title": "Alarms",
                                "num": 4,
                                "icon": "fa-bell",
                                item: [
                                    {
                                        "nome": "Alarms",
                                        "state": "alarms.info"
                                    }
                                ]
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
