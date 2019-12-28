'use strict';

mainAngularModule.config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('sensors', {
                abstract: true,
                url: '/sensors',
                templateUrl: 'views/dashboard/main.html'
                /*data: {
                    requiresLogin: true
                }*/
            })
            .state('sensors.info', {
                url: '/info',
                templateUrl: 'views/sensors/sensors-info.html',
                controller: 'SensorsCtrl',
                controllerAs: 'ctrl'
            })
    }]);