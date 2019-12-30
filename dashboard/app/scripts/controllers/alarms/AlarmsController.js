'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
mainAngularModule
    .controller('AlarmsController', ['$scope', 'AlarmsFactory', 'ErrorStateRedirector', 'DTOptionsBuilder',
        'DTColumnDefBuilder',
        function ($scope, AlarmsFactory ,ErrorStateRedirector, DTOptionsBuilder, DTColumnDefBuilder) {

            var ctrl = this;
            ctrl.refreshAlarms = refreshAlarmsFn;

            $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('C<"clear">lfrtip');
            $scope.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(3).notSortable()
            ];


            refreshAlarmsFn();
            function refreshAlarmsFn() {
                console.log("Refresh Alarms\n");
                AlarmsFactory.GetAll(
                    function (alarms) {
                        ctrl.alarms = alarms;
                    }, function (error) {
                        ErrorStateRedirector.GoToErrorPage({Messaggio: "Error during retrieve all Alarms:" + error});
                    });

            }

        }]);