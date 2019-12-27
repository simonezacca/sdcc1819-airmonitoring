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
            .state('realtime.info', {
                url: '/info',
                templateUrl: 'views/realtime/realtime-info.html',
                controller: 'RealtimeCtrl',
                controllerAs: 'ctrl'
            })
    }]);