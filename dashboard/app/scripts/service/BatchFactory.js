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
    .factory('BatchFactory', ['$http', 'APIGATEWAY_INFLUXQUERY1_ENDPOINT_URL', 'APIGATEWAY_INFLUXQUERY2_ENDPOINT_URL', 'ToasterNotifierHandler',
        function ($http, APIGATEWAY_INFLUXQUERY1_ENDPOINT_URL, APIGATEWAY_INFLUXQUERY2_ENDPOINT_URL, ToasterNotifierHandler) {
            let thisCrudService = {};
            thisCrudService.batchData = {};
            let _endPointJSON1 = APIGATEWAY_INFLUXQUERY1_ENDPOINT_URL;
            let _endPointJSON2 = APIGATEWAY_INFLUXQUERY2_ENDPOINT_URL;


            thisCrudService.GetAllQ1 = GetAllQ1Fn;
            thisCrudService.GetAllQ2 = GetAllQ2Fn;
            thisCrudService.GetSingle = GetSingleFn;
            thisCrudService.batchData = null;

            // get all data from database
            function GetAllQ1Fn(successCB, errorCB) {

                $http({
                    method: 'GET',
                    url: _endPointJSON1
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

            function GetAllQ2Fn(successCB, errorCB) {

                $http({
                    method: 'GET',
                    url: _endPointJSON2
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


            function GetSingleFn(chemical_compound, successCB, errorCB) {

                $http({
                    method: 'GET',
                    url: _endPointJSON1 + "/" + chemical_compound
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