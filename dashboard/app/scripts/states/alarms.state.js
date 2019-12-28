'use strict';

mainAngularModule.config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('alarms', {
                abstract: true,
                url: '/alarms',
                templateUrl: 'views/dashboard/main.html'
                /*data: {
                    requiresLogin: true
                }*/
            })
            .state('alarms.info', {
                url: '/info',
                templateUrl: 'views/alarms/alarms-info.html',
                controller: 'AlarmsController',
                controllerAs: 'ctrl'
            })
    }]);