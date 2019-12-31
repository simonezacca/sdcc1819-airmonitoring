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

            function timeConverter(UNIX_timestamp){
                var a = new Date(UNIX_timestamp * 1000);
                var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                var year = a.getFullYear();
                var month = months[a.getMonth()];
                var date = a.getDate();
                var hour = a.getHours();
                var min = a.getMinutes();
                var sec = a.getSeconds();
                var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
                return time;
            }

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
                    var toastMessage = "<b>Sensor ID:</b> " + data.sensor_id + '</br>'
                    + "<b>Chemical Compound: </b>" + data.chemical_compound + "</br>"
                    + "<b>Excess Value: </b>" + data.excess_value + "</br>"
                    + "<b>Time: </b>" + timeConverter(data.timestamp) + "</br>";

                    console.log("ON MESSAGE, The WebSocket Server has sent the following data: " + JSON.stringify(data));
                    console.log(data.chemical_compound);
                    console.log(data.sensor_id);
                    console.log(data.excess_value);
                    console.log(data.timestamp);
                    toastr.error(toastMessage, "ALARM!");
                });
            }

            return thisCrudService;
        }]);

