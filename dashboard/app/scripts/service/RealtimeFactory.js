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
    .factory('RealtimeFactory', ['$http', 'APIGATEWAY_FLINKQUERY1_ENDPOINT_URL', 'ToasterNotifierHandler',
        function ($http, APIGATEWAY_FLINKQUERY1_ENDPOINT_URL, ToasterNotifierHandler) {
            var thisCrudService = {};
            thisCrudService.realtime = {};
            var _endPointJSON1 = APIGATEWAY_FLINKQUERY1_ENDPOINT_URL;


            thisCrudService.GetAllQ1 = GetAllQ1Fn;
            thisCrudService.GetSingleQ1 = GetSingleQ1Fn;
            thisCrudService.realtime = null;

            // get all data from database
            function GetAllQ1Fn(realtime, successCB, errorCB) {

                $http({
                    method: 'GET',
                    url: _endPointJSON1,
                    params: realtime
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


            function GetSingleQ1Fn(chemical_compound, realtime, successCB, successPromise, errorCB) {

                $http({
                    method: 'GET',
                    url: _endPointJSON1 + "/" + chemical_compound,
                    params: realtime
                })
                    .then(function (response) {
                            if (successCB) {
                                successCB(response.data);
                                if (successPromise) {
                                    successPromise.resolve();
                                }
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