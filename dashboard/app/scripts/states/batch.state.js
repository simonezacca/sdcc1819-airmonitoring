'use strict';

mainAngularModule.config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('batch', {
                abstract: true,
                url: '/batch',
                templateUrl: 'views/dashboard/main.html'
                /*data: {
                    requiresLogin: true
                }*/
            })
            .state('batch.query1', {
                url: '/query1',
                templateUrl: 'views/batch/batch-query1.html',
                controller: 'Query1BatchController',
                controllerAs: 'ctrl'
            })
            .state('batch.query2', {
                url: '/query2',
                templateUrl: 'views/batch/batch-query2.html',
                controller: 'Query2BatchController',
                controllerAs: 'ctrl'
            })
    }]);