'use strict';

mainAngularModule.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/dashboard/home');

        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'views/dashboard/main.html',
                /*data: {
                    requiresLogin: true
                }*/
            })
            .state('dashboard.home', {
                url: '/home',
                controller: 'RealtimeController',
                templateUrl: 'views/realtime/realtime-query1.html',
                /*data: {
                    requiresLogin: true
                }*/
            })
            .state('login', {
                templateUrl: 'views/auth/login.html',
                url: '/login',
                controller: 'LoginCtrl',
                controllerAs: 'ctrl'
            })
    }]);