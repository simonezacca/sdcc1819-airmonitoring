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
            //TODO fare la single per ogni comopoente invece di fare la getAll così i flussi sono già divisi
            ctrl.getAllCompoundData = getAllCompoundDataFn;
            ctrl.getSingleCompoundData = getSingleCompoundDataFn;
            ctrl.setDataAll = setDataAllFn;
            ctrl.setDataSingle = setDataSingleFn;
            ctrl.setTimestampForAllCompounds = setTimestampForAllCompoundsFn;
            ctrl.chemical_compounds = ["NO_2", "CO", "SO_2", "PM10"];
            ctrl.realtimeDataAll = [];
            ctrl.realtimeDataSingle = [];

            //calendar start
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
            //calendar end

            //button for single compound chart
            $scope.radioModel = 'CO';
            $scope.selected = "CO";
            //


            var ctx = document.getElementById("allChart").getContext("2d");
            var cty = document.getElementById("singleChart").getContext("2d");

            var allLine = {
                type: 'line',
                data: {
                    datasets: [{
                        //data: [[20, 50, 100, 75, 25, 0]],
                        //data: [{y: 20, x: 0.1}, {y: 50, x:0.5}, {y: 100, x: 1.0}, {y: 75, x: 2.0}],
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
                    } /*{
                        data: [0.1, 0.5, 1.0, 2.0, 1.5, 0],
                        label: 'Bottom dataset',

                        // This binds the dataset to the right y axis
                        xAxisID: 'bottom-x-axis'
                    }*/]
                    //labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                    /*color: ['rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)'],
                    series: ['Series A', 'Series B']*/
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

            var singleLine = {
                type: 'line',
                data: {
                    datasets: [{
                        //data: [[20, 50, 100, 75, 25, 0]],
                        data: [],
                        label: '',
                        borderColor: 'rgba(255, 99, 132, 0.5)',
                        // This binds the dataset to the left y axis
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
            var singleChart = new Chart(cty, singleLine);

            $scope.labels = ['Winter', 'Spring', 'Summer', 'Autumn'];
            //$scope.series = ['Series A'];

            $scope.dataAll = [];
            $scope.dataSingle = [];

            $scope.ColorBar = ['#90EE90', '#FF6600', '#0000FF', '#800517'];
            $scope.DataSetOverride = [{ yAxisID: 'y-axis-1' }, {xAxisID: 'x-axis-1'}]; //y-axis-1 is the ID defined in scales under options.

            $scope.data1 = {
                datasets: [{
                    data: [20, 50, 100, 75, 25, 0],
                    //label: 'Value dataset',

                    // This binds the dataset to the left y axis
                    yAxisID: 'y-axis-1'
                }, {
                    data: [0.1, 0.5, 1.0, 2.0, 1.5, 0],
                    //label: 'Time dataset',

                    // This binds the dataset to the right y axis
                    xAxisID: 'x-axis-1'
                }]
                    //labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
            };

            $scope.options = {
                legend: { display: true },
                responsive: true,  // set to false to remove responsiveness. Default responsive value is true.
                scales: {
                    yAxes: [
                        {
                            id: 'y-axis-1',
                            type: 'linear',
                            display: true,
                            position: 'left'
                        }],
                    xAxes:[
                        {
                            id:'x-axis-1',
                            type: 'time',
                            display: true,
                            position: 'bottom'
                        }]
                }
            };

            $scope.clickme = function($event){
                alert("You've clicked upon "+$event[0]._view.label);
            };

            $scope.hoverme = function ($event) {
                alert("You hovered over " + $event[0]._view.label);
            };

            ctrl.timestampAllDefault = {
                timestampStart:'1538405120',
                timestampEnd:'1546267520'
                //timestampStart:'1535780100',
                //timestampEnd:'1578461100'
            };

            ctrl.timestampAll = {
                timestampStart: '',
                timestampEnd: ''
            };

            ctrl.timestampSingle = {};

            getAllCompoundDataFn(ctrl.timestampAllDefault);
            getSingleCompoundDataFn(ctrl.timestampAllDefault);

            function isEmpty(obj) {
                for(var key in obj) {
                    if(obj.hasOwnProperty(key))
                        return false;
                }
                return true;
            }

            function setTimestampForAllCompoundsFn(){
                //Convert Epoch to UNIX Timestamp
                ctrl.timestampAll.timestampStart = Date.parse($scope.dateRangeStart)/1000;
                ctrl.timestampAll.timestampEnd = Date.parse($scope.dateRangeEnd)/1000;
                console.log("TimeStampStart: " + ctrl.timestampAll.timestampStart);
                console.log("TimeStampEnd: " + ctrl.timestampAll.timestampEnd);
                getAllCompoundDataFn(ctrl.timestampAll);
            }

            function setDataAllFn() {
                if (ctrl.realtimeDataAll[0].Items.length == 0) {
                console.log("ctrl.realtimeDataAll is empty: ")
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
                    console.log(allLine.data.datasets);
                    allChart.update();
                }
            }

            function setDataSingleFn() {
                singleLine.data.datasets[0].label = $scope.selected;

                var curData = ctrl.realtimeDataSingle.Items;
                curData.forEach(
                    function(cp) {
                        var dataPoint = {
                            y: parseFloat(cp.value.N),
                            x: parseFloat(cp.timestamp.N)
                        };
                        console.log(JSON.stringify(dataPoint));
                        singleLine.data.datasets[0].data.push(dataPoint);
                    }
                );
                singleChart.update();
                console.log(singleLine.data.datasets[0].data)
            }

            function getAllCompoundDataFn(timestamp) {
                console.log("refresh data");
                console.log("start " + ctrl.timestampAll.timestampStart);
                console.log("end " + ctrl.timestampAll.timestampEnd);
                clearData();
                var dataPromises = [];
                for(var i=0; i<4; i++){
                    var prom = $q.defer();
                    RealtimeFactory.GetSingleQ1(ctrl.chemical_compounds[i], timestamp,
                        function (realtimeDataSingle) {
                            ctrl.realtimeDataAll.push(realtimeDataSingle);
                            console.log("REALTIMEDATA DOPO: " + JSON.stringify(ctrl.realtimeDataAll));
                            //prom.resolve();

                        },
                        prom
                        ,function (error) {
                            ErrorStateRedirector.GoToErrorPage({Messaggio: "Errore nell'import dei dati"});
                        });
                    dataPromises.push(prom.promise);

                }

                $q.all(dataPromises).then(function (value) {
                    setDataAllFn();
                }, function (error) { console.log(error) });


            }

            function getSingleCompoundDataFn(timestamp) {
                var chemicalCompound = $scope.selected;
                RealtimeFactory.GetSingleQ1(chemicalCompound, timestamp,
                    function (realtimeData) {
                        ctrl.realtimeDataSingle = realtimeData;
                        setDataSingleFn();
                    }, null,
                    function (error) {
                        ErrorStateRedirector.GoToErrorPage({Messaggio: "Errore nell'import dei dati"});
                    });

            }

            function clearData()
            {
                for(var i =0; i<4; i++){
                    allLine.data.datasets[i].data = [];
                    console.log("Cancellazione: " + allLine.data.datasets[i].data + "i-esima: "+ i);
                }
                ctrl.realtimeDataAll = [];
            }
        }]);
