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
            .state('batch.info', {
                url: '/info',
                templateUrl: 'views/batch/batch-info.html',
                controller: 'BatchCtrl',
                controllerAs: 'ctrl'
            })
    }]);