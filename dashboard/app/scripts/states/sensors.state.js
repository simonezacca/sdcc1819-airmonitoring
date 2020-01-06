'use strict';

mainAngularModule.config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('sensors', {
                abstract: true,
                url: '/sensors',
                templateUrl: 'views/dashboard/main.html'
            })
            .state('sensors.create', {
                url: '/create',
                templateUrl: 'views/sensors/sensor-create.html',
                controller: 'SensorsController',
                controllerAs: 'ctrl',
            })
            .state('sensors.info', {
                url: '/info',
                templateUrl: 'views/sensors/sensors-info.html',
                controller: 'SensorsController',
                controllerAs: 'ctrl'
            })
            .state('sensors.maps', {
                url: '/maps',
                templateUrl: 'views/sensors/sensors-maps.html',
                controller: 'SensorsMapsController',
                controllerAs: 'ctrl'
            })
    }]);