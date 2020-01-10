'use strict';

mainAngularModule.config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('realtime', {
                abstract: true,
                url: '/realtime',
                templateUrl: 'views/dashboard/main.html'
            })
            .state('realtime.query1', {
                url: '/query1',
                templateUrl: 'views/realtime/realtime-query1.html',
                controller: 'RealtimeController',
                controllerAs: 'ctrl'
            })
    }]);