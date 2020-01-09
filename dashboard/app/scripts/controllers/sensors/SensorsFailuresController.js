'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
mainAngularModule
    .controller('SensorsFailuresController', ['$scope', "$state", 'SensorsFactory','SensorsFailuresFactory',
        function ($scope, $state, SensorsFactory,SensorsFailuresFactory ) {

            var ctrl = this;
            ctrl.sensors_failues = [];

            init();

            function init() {
                SensorsFailuresFactory.GetAll(
                    (failures)=>{
                        ctrl.sensors_failues = failures;
                    },
                    (error)=>{
                        console.error(error);
                    })
            }

        }]);