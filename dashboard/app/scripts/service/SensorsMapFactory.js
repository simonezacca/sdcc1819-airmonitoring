'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */

mainAngularModule
    .factory('SensorsMapFactory', ['SensorsFactory',
        function (SensorsFactory) {
            let thisCrudService = {};

            thisCrudService.sensors = [];
            thisCrudService.sensorsAdapted = [];
            thisCrudService.GetAdaptedSensors = GetAdaptedSensorsFn;

            function loadSensorsFromFactory(cb) {
                SensorsFactory.GetAll(
                    (sensors) => {
                        cb(sensors);
                    },
                    (error) => {
                        console.error(error);
                    },

                );
            }

            function adaptSensorData() {
                thisCrudService.sensors.forEach(
                    (sensor) => {
                        thisCrudService.sensorsAdapted.push(createAdaptedObject(sensor));
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

            function GetAdaptedSensorsFn(successCB) {
                loadSensorsFromFactory(
                    (sensors) => {
                            thisCrudService.sensors = sensors;
                            adaptSensorData();
                            successCB(thisCrudService.sensorsAdapted);
                    }
                );
            }

            return thisCrudService;
        }]);

