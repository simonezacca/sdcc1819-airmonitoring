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
    .factory('WSAlarmFactory', ['$websocket', 'WEBSOCKET_ALARM_ENDPOINT_URL', 'toastr',
        function ($websocket, WEBSOCKET_ALARM_ENDPOINT_URL, toastr) {
            let thisCrudService = {};

            thisCrudService.ws = undefined;
            thisCrudService.start = startFn;

            function startFn() {
                thisCrudService.ws = $websocket.$new({
                    url: WEBSOCKET_ALARM_ENDPOINT_URL,
                    reconnect: true,
                    reconnectInterval: 2000,
                    protocols: []
                });
                thisCrudService.ws.$on('$open', function () {
                    console.log("WEB SOCKET OPENED!\n");
                });
                thisCrudService.ws.$on('$close', function () {
                    console.log("WEB SOCKET CLOSED!\n");

                });
                thisCrudService.ws.$on('pong', function (data) {
                    console.log("The WebSocket Server has sent the following data: " + data);
                });
                thisCrudService.ws.$on('$message', function (data) {
                    console.log("ON MESSAGE, The WebSocket Server has sent the following data: " + JSON.stringify(data));
                    let response = JSON.stringify(data);
                    toastr.error(response, "ALARM!");
                });
            }

            return thisCrudService;
        }]);

