'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
mainAngularModule
    .controller('RealtimeController', ['$scope', '$state', 'RealtimeFactory', 'DTOptionsBuilder',
        'DTColumnDefBuilder', 'ErrorStateRedirector', '$q',
        function ($scope, $state, RealtimeFactory, DTOptionsBuilder,
                  DTColumnDefBuilder, ErrorStateRedirector, $q) {

            var ctrl = this;
            ctrl.getAllCompoundData1 = getAllCompoundData1Fn;
            ctrl.getAllCompoundData2 = getAllCompoundData2Fn;
            ctrl.setDataAll1 = setDataAll1Fn;
            ctrl.setDataAll2 = setDataAll2Fn;
            ctrl.setTimestampForAllCompounds1 = setTimestampForAllCompounds1Fn;
            ctrl.setTimestampForAllCompounds2 = setTimestampForAllCompounds2Fn;
            ctrl.chemical_compounds = ["NO_2", "CO", "SO_2", "PM10"];
            ctrl.realtimeDataAll = [];
            ctrl.realtimeDataAll2 = [];
            ctrl.realtimeDataSingle = [];
            ctrl.realtimeDataSingle2 = [];

            //CALENDAR START
            $scope.endDateBeforeRender = endDateBeforeRender;
            $scope.endDateOnSetTime = endDateOnSetTime;
            $scope.startDateBeforeRender = startDateBeforeRender;
            $scope.startDateOnSetTime = startDateOnSetTime;

            function startDateOnSetTime () {
                $scope.$broadcast('start-date-changed');
            }

            function endDateOnSetTime () {
                $scope.$broadcast('end-date-changed');
            }
            function startDateBeforeRender ($dates) {
                if ($scope.dateRangeEnd) {
                    var activeDate = moment($scope.dateRangeEnd);

                    $dates.filter(function (date) {
                        return date.localDateValue() >= activeDate.valueOf()
                    }).forEach(function (date) {
                        date.selectable = false;
                    })
                }
            }

            function endDateBeforeRender ($view, $dates) {
                if ($scope.dateRangeStart) {
                    var activeDate = moment($scope.dateRangeStart).subtract(1, $view).add(1, 'minute');

                    $dates.filter(function (date) {
                        return date.localDateValue() <= activeDate.valueOf()
                    }).forEach(function (date) {
                        date.selectable = false;
                    })
                }
            }
            //CALENDAR END


            var ctx = document.getElementById("allChart").getContext("2d");
            var cty = document.getElementById("allChart2").getContext("2d");

            var allLine = {
                type: 'line',
                data: {
                    datasets: [{
                        data: [],
                        label: '',
                        labels: [],
                        borderColor: 'rgba(255, 99, 132, 0.5)',
                        // This binds the dataset to the left y axis
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 4,
                        yAxisID: 'left-y-axis'
                    }, {
                        data: [],
                        label: '',
                        labels: [],
                        borderColor: 'rgba(54, 162, 235, 0.5)',
                        // This binds the dataset to the right y axis
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 4,
                        yAxisID: 'left-y-axis'
                    }, {
                        data: [],
                        label: '',
                        labels: [],
                        borderColor: 'rgba(75, 192, 192, 0.5)',
                        // This binds the dataset to the right y axis
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 4,
                        yAxisID: 'left-y-axis'
                    }, {
                        data: [],
                        label: '',
                        labels: [],
                        borderColor: 'rgba(255, 159, 64, 0.5)',
                        // This binds the dataset to the right y axis
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 4,
                        yAxisID: 'left-y-axis'
                    }]
                },
                options: {
                    legend: { display: true },
                    responsive: true,
                    scales: {
                        yAxes: [{
                            id: 'left-y-axis',
                            type: 'linear',
                            position: 'left'
                        }],
                        xAxes: [
                            {
                            id: 'bottom-x-axis',
                            type: 'linear',
                            position: 'bottom'
                        }]
                    }
                }
            };

            var allLine2 = {
                type: 'line',
                data: {
                    datasets: [{
                        data: [],
                        label: '',
                        labels: [],
                        borderColor: 'rgba(255, 99, 132, 0.5)',
                        // This binds the dataset to the left y axis
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 4,
                        yAxisID: 'left-y-axis'
                    }, {
                        data: [],
                        label: '',
                        labels: [],
                        borderColor: 'rgba(54, 162, 235, 0.5)',
                        // This binds the dataset to the right y axis
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 4,
                        yAxisID: 'left-y-axis'
                    }, {
                        data: [],
                        label: '',
                        labels: [],
                        borderColor: 'rgba(75, 192, 192, 0.5)',
                        // This binds the dataset to the right y axis
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 4,
                        yAxisID: 'left-y-axis'
                    }, {
                        data: [],
                        label: '',
                        labels: [],
                        borderColor: 'rgba(255, 159, 64, 0.5)',
                        // This binds the dataset to the right y axis
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 4,
                        yAxisID: 'left-y-axis'
                    }]
                },
                options: {
                    legend: { display: true },
                    responsive: true,
                    scales: {
                        yAxes: [{
                            id: 'left-y-axis',
                            type: 'linear',
                            position: 'left'
                        }],
                        xAxes: [
                            {
                                id: 'bottom-x-axis',
                                type: 'linear',
                                position: 'bottom'
                            }]
                    }
                }
            };

            var allChart = new Chart(ctx, allLine);
            var allChart2 = new Chart(cty, allLine2);

            $scope.clickme = function($event){
                alert("You've clicked upon "+$event[0]._view.label);
            };

            $scope.hoverme = function ($event) {
                alert("You hovered over " + $event[0]._view.label);
            };

            ctrl.timestampDefault = {
                timestampStart:'1451606400000',
                timestampEnd:'1451761200000'
            };

            ctrl.timestampAll1 = {
                timestampStart: '',
                timestampEnd: ''
            };


            ctrl.timestampAll2 = {
                timestampStart: '',
                timestampEnd: ''
            };


            getAllCompoundData1Fn(ctrl.timestampDefault);
            getAllCompoundData2Fn(ctrl.timestampDefault);

            function setTimestampForAllCompounds1Fn(){
                //Convert Epoch to UNIX Timestamp
                ctrl.timestampAll1.timestampStart = Date.parse($scope.dateRangeStart);
                ctrl.timestampAll1.timestampEnd = Date.parse($scope.dateRangeEnd);
                getAllCompoundData1Fn(ctrl.timestampAll1);
            }

            function setDataAll1Fn() {
                if (ctrl.realtimeDataAll[0].Items.length == 0) {
                    allChart.update();
                } else {
                    for (var i = 0; i < 4; i++) {
                        allLine.data.datasets[i].label = ctrl.realtimeDataAll[i].Items[0].chemical_compound.S;

                        var curData = ctrl.realtimeDataAll[i].Items;
                        curData.forEach(
                            function (cp) {
                                var dataPoint = {
                                    y: parseFloat(cp.value.N),
                                    x: parseFloat(cp.timestamp.N)
                                };
                                allLine.data.datasets[i].data.push(dataPoint);
                                allLine.data.datasets[i].labels.push("Ciao");
                            }
                        );

                    }
                    allChart.update();
                }
            }

            function getAllCompoundData1Fn(timestamp) {
                console.log("refresh data");
                clearData();
                var dataPromises = [];
                for(var i=0; i<4; i++){
                    var prom = $q.defer();
                    RealtimeFactory.GetSingleQ1(ctrl.chemical_compounds[i], timestamp,
                        function (realtimeDataSingle) {
                            ctrl.realtimeDataAll.push(realtimeDataSingle);

                        },
                        prom
                        ,function (error) {
                            ErrorStateRedirector.GoToErrorPage({Messaggio: "Errore nell'import dei dati"});
                        });
                    dataPromises.push(prom.promise);

                }

                $q.all(dataPromises).then(function (value) {
                    setDataAll1Fn();
                }, function (error) { console.log(error) });


            }

            function clearData() {
                for(var i =0; i<4; i++){
                    allLine.data.datasets[i].data = [];
                    //console.log("Cancellazione: " + allLine.data.datasets[i].data + "i-esima: "+ i);
                }
                ctrl.realtimeDataAll = [];
            }


            function setTimestampForAllCompounds2Fn(){
                //Convert Epoch to UNIX Timestamp
                ctrl.timestampAll2.timestampStart = Date.parse($scope.dateRangeStart2);
                ctrl.timestampAll2.timestampEnd = Date.parse($scope.dateRangeEnd2);
                console.log("TimeStampStart: " + ctrl.timestampAll2.timestampStart);
                console.log("TimeStampEnd: " + ctrl.timestampAll2.timestampEnd);
                getAllCompoundData2Fn(ctrl.timestampAll2);
            }

            function setDataAll2Fn() {
                if (ctrl.realtimeDataAll2[0].Items.length === 0) {
                    console.log("ctrl.realtimeDataAll2 is empty: ");
                    allChart2.update();
                } else {
                    for (var i = 0; i < 4; i++) {
                        allLine2.data.datasets[i].label = ctrl.realtimeDataAll2[i].Items[0].chemical_compound.S;

                        var curData = ctrl.realtimeDataAll2[i].Items;
                        curData.forEach(
                            function (cp) {
                                var dataPoint = {
                                    y: parseFloat(cp.value.N),
                                    x: parseFloat(cp.timestamp.N)
                                };
                                allLine2.data.datasets[i].data.push(dataPoint);
                                allLine2.data.datasets[i].labels.push("Ciao");
                            }
                        );

                    }
                    console.log(allLine2.data.datasets);
                    allChart2.update();
                }
            }

            function getAllCompoundData2Fn(timestamp) {
                clearData2();
                var dataPromises = [];
                for(var i=0; i<4; i++){
                    var prom = $q.defer();
                    RealtimeFactory.GetSingleQ1(ctrl.chemical_compounds[i], timestamp,
                        function (realtimeDataSingle2) {
                            ctrl.realtimeDataAll2.push(realtimeDataSingle2);

                        },
                        prom
                        ,function (error) {
                            ErrorStateRedirector.GoToErrorPage({Messaggio: "Errore nell'import dei dati"});
                        });
                    dataPromises.push(prom.promise);

                }

                $q.all(dataPromises).then(function (value) {
                    setDataAll2Fn();
                }, function (error) { console.log(error) });


            }

            function clearData2() {
                for(var i =0; i<4; i++){
                    allLine2.data.datasets[i].data = [];
                    console.log("Cancellazione: " + allLine2.data.datasets[i].data + "i-esima: "+ i);
                }
                ctrl.realtimeDataAll2 = [];
            }

        }]);