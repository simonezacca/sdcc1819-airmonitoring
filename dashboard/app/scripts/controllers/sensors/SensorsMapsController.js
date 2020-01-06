'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
mainAngularModule
    .controller('SensorsMapsController', ['$scope', "$state", 'SensorsFactory', 'NgMap',
        function ($scope, $state, SensorsFactory, NgMap ) {

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
            function adaptSensorData() {
                ctrl.sensors.forEach(
                    (sensor) => {
                        ctrl.sensorsAdapted.push(createAdaptedObject(sensor));
                    }
                )
            }

            function createAdaptedObject(sensorsData) {
                let sensorsObj = {}

                sensorsObj.sensor_id = sensorsData.sensor_id.S

                let lat = parseFloat(sensorsData.lat.S.replace(',','.'));
                let lon = parseFloat(sensorsData.lon.S.replace(',','.'));
                sensorsObj.pos = [lat,lon];

                return sensorsObj;

            }

            function loadSensors() {
                SensorsFactory.GetAll(
                    (sensors) => {
                        ctrl.sensors = sensors;
                        adaptSensorData();
                    },
                    (error) => {
                        console.error(error);
                    });
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

                let pippo = ctrl.sensors.filter(
                    (sensor) => sensor.sensor_id.S == sensor_id
                )

                pippo.forEach(
                (sensor) => {
                    result = extractCompound(sensor);
                }
            );

                return result;

            }

        }]);