'use strict';

mainAngularModule.config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('realtime', {
                abstract: true,
                url: '/realtime',
                templateUrl: 'views/dashboard/main.html'
                /*data: {
                    requiresLogin: true
                }*/
            })
            .state('realtime.query1', {
                url: '/query1',
                templateUrl: 'views/realtime/realtime-query1.html',
                controller: 'RealtimeController',
                controllerAs: 'ctrl'
            })
            .state('realtime.query2', {
                url: '/query2',
                templateUrl: 'views/realtime/realtime-query2.html',
                controller: 'RealtimeController',
                controllerAs: 'ctrl'
            })
    }]);