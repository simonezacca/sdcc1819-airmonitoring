'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
mainAngularModule
    .controller('SensorsController', ['$scope', 'SensorsFactory', 'ErrorStateRedirector', 'DTOptionsBuilder',
        'DTColumnDefBuilder',
        function ($scope, SensorsFactory ,ErrorStateRedirector, DTOptionsBuilder, DTColumnDefBuilder) {

            var ctrl = this;
            resetFieldsFn();
            ctrl.resetFields = resetFieldsFn;
            ctrl.createSensor = createSensorFn;
            ctrl.refreshSensor = refreshSensorFn;
            ctrl.editSensor = editSensorFN;
            ctrl.deleteSensor = deleteSensorFn;

            ctrl.currentSensor = {};
            /*
            ctrl.currentSensor = {
                "sensor_id": {
                    "S": "28079515"
                },
                "SO_2": {
                    "BOOL": true
                },
                "NO_2": {
                    "BOOL": true
                },
                "lon": {
                    "S": "-3.712"
                },
                "lat": {
                    "S": "40.42385"
                },
                "CO": {
                    "BOOL": true
                },
                "PM10": {
                    "BOOL": false
                }
            };
             */

            $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('C<"clear">lfrtip');
            $scope.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(4).notSortable()
            ];


            //refreshSensorFn();
            function resetFieldsFn() {
                ctrl.currentSensor = {};
            }
            function createSensorFn() {
                console.log("Create Sensor\n");
                SensorsFactory.Insert(ctrl.currentSensor,
                    function (response) {
                        console.log(response);
                        //$state.go('sensors.info', {}, {reload: true});
                    }, function (error) {
                        ErrorStateRedirector.GoToErrorPage({Messaggio: "Error during creation of Sensor:" + error});
                    });
                resetFieldsFn();


            }
            function refreshSensorFn() {
                console.log("Refresh Sensors\n");
                SensorsFactory.GetAll(
                    function (sensors) {
                        ctrl.sensors = sensors;
                    }, function (error) {
                        ErrorStateRedirector.GoToErrorPage({Messaggio: "Error during retrieve all Sensors:" + error});
                    });

            }

            function editSensorFN(sProduct) {
                console.log("update product with id: " + sProduct.id);
                SensorsFactory.Update(sProduct,
                    function () {
                        refreshProductFn();
                    }, function (error) {
                        ErrorStateRedirector.GoToErrorPage({Messaggio: "Error during modify Sensor: " + error});
                    });

            }

            function deleteSensorFn(id) {
                console.log("Delete Sensor with ID: " + id);
                SensorsFactory.Remove(id,
                    function () {
                        refreshProductFn();
                    }, function (error) {
                        ErrorStateRedirector.GoToErrorPage({Messaggio: "Error during elimination of Sensor: " + error});
                    });

            }

        }]);