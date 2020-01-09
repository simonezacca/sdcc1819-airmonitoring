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
    .factory('SensorsFailuresFactory', ['$http', 'APIGATEWAY_SENSORS_FAILURES_ENDPOINT_URL', 'ToasterNotifierHandler',
        function ($http, APIGATEWAY_SENSORS_FAILURES_ENDPOINT_URL, ToasterNotifierHandler) {
            let thisCrudService = {};
            let _endPointAPIGATEWAY = APIGATEWAY_SENSORS_FAILURES_ENDPOINT_URL;


            thisCrudService.GetAll = GetAllFn;

            // get all data from database
            function GetAllFn(successCB, errorCB) {

                $http({
                    method: 'GET',
                    url: _endPointAPIGATEWAY
                })
                    .then(function (response) {
                            console.log(response.data);
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


            return thisCrudService;
        }]);

