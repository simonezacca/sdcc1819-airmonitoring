'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
mainAngularModule
    .controller('SensorsMapsController', ['$scope', "$state", 'SensorsMapFactory', 'NgMap',
        function ($scope, $state, SensorsMapFactory, NgMap ) {

            var ctrl = this;

            ctrl.sensors = [];
            ctrl.sensorsAdapted = [];
            ctrl.showSensorDetail = showSensorDetailFn;
            ctrl.canMeasure = canMeasureFn;

            function showSensorDetailFn(e, sensor) {
                ctrl.selectedSensor = sensor;
                ctrl.map.showInfoWindow('sensor-iw', sensor.sensor_id);
            };

            init();

            function init() {
                loadSensors();
                NgMap.getMap().then(function(map) {
                    console.log('map', map);
                    ctrl.map = map;
                });
            }

            function loadSensors() {
                SensorsMapFactory.GetAdaptedSensors(
                    (adaptedSensors) => {
                        ctrl.sensorsAdapted =  adaptedSensors;
                    }
                );
            }

            function canMeasureFn(sensor_id) {

                function extractCompound(sensor) {
                    let result = []
                    let attributes = ["SO_2","NO_2","CO","PM10"]
                    attributes.forEach(
                        (compoundName) => {
                            if (sensor[compoundName].BOOL) {
                                result.push(compoundName);
                            }
                        }
                    )

                    return result;
                }

                let result = [];

                let filterArray = ctrl.sensors.filter(
                    (sensor) => sensor.sensor_id.S == sensor_id
                )

                filterArray.forEach(
                (sensor) => {
                    result = extractCompound(sensor);
                }
            );
                return result;

            }

        }]);