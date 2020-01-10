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
    .factory('SensorsFactory', ['$http', 'APIGATEWAY_SENSORS_ENDPOINT_URL', 'ToasterNotifierHandler',
        function ($http, APIGATEWAY_SENSORS_ENDPOINT_URL, ToasterNotifierHandler) {
            let thisCrudService = {};
            thisCrudService.sensors = {};
            let _endPointAPIGATEWAY = APIGATEWAY_SENSORS_ENDPOINT_URL;


            thisCrudService.GetAll = GetAllFn;
            thisCrudService.GetSingle = GetSingleFn;
            thisCrudService.Insert = InsertFn;
            thisCrudService.Update = UpdateFn;
            thisCrudService.Remove = RemoveFn;

            thisCrudService.sensors = null;

            // get all data from database
            function GetAllFn(successCB, errorCB) {

                $http({
                    method: 'GET',
                    url: _endPointAPIGATEWAY
                })
                    .then(function (response) {
                            //console.log(response.data);
                            if (successCB) {
                                successCB(response.data);
                            }
                        },
                        function (response) {
                            if (errorCB) {
                                errorCB(response);
                            }
                            console.error(response.data);
                            ToasterNotifierHandler.handleError(response);
                        });
            }

            function GetSingleFn(sensor_id, successCB, errorCB) {

                $http({
                    method: 'GET',
                    url: _endPointAPIGATEWAY + "/" + sensor_id
                })
                    .then(function (response) {
                            if (successCB) {
                                successCB(response.data);
                            }
                            //return response.data;
                        },
                        function (response) {
                            if (errorCB) {
                                errorCB(response);
                            }
                            console.error(response.data);
                            ToasterNotifierHandler.handleError(response);
                        });
            }

            // post the data from database
            function InsertFn(sensor, successCB, errorCB) {

                $http({
                    method: 'POST',
                    url: _endPointAPIGATEWAY,
                    headers: {
                        "Access-Control-Allow-Origin" : "*"
                    },
                    data: sensor
                })
                    .then(function (response) {
                            if (successCB) {
                                successCB(response.data);
                                ToasterNotifierHandler.handleCreation(response);
                            }
                            //return response.data;
                        },
                        function (response) {
                            if (errorCB) {
                                errorCB(response.data);
                            }
                            console.error(response.data);
                            ToasterNotifierHandler.handleError(response);
                        });
            }

            // put the data from database
            function UpdateFn(sensor, successCB, errorCB) {

                $http({
                    method: 'PUT',
                    url: _endPointAPIGATEWAY + sensor.id,
                    data: sensor
                })
                    .then(function (response) {
                            if (successCB) {
                                successCB(response.data);
                            }
                            //return response.data;
                        },
                        function (response) {
                            if (errorCB) {
                                errorCB(response);
                            }
                            console.error(response.data);
                            ToasterNotifierHandler.handleError(response);
                        });
            }

            // delete the data from database
            function RemoveFn(sensor_id, successCB, errorCB) {

                $http({
                    method: 'DELETE',
                    url: _endPointAPIGATEWAY + "/" + sensor_id
                })
                    .then(function (response) {
                            if (successCB) {
                                successCB(response.data);
                            }
                            //return response.data;
                        },
                        function (response) {
                            if (errorCB) {
                                errorCB(response);
                            }
                            console.error(response.data);
                            ToasterNotifierHandler.handleError(response);
                        });
            }


            return thisCrudService;
        }]);

