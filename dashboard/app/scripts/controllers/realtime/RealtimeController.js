'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
mainAngularModule
    .controller('RealtimeController', ['$scope', '$state', 'RealtimeFactory', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'ErrorStateRedirector',
        function ($scope, $state, RealtimeFactory, DTOptionsBuilder, DTColumnDefBuilder, ErrorStateRedirector) {

            var ctrl = this;
            //TODO fare la single per ogni comopoente invece di fare la getAll così i flussi sono già divisi
            ctrl.getAllCompoundData = getAllCompoundDataFn;
            ctrl.getSingleCompoundData = getSingleCompoundDataFn;
            ctrl.setDataAll = setDataAllFn;
            ctrl.setDataSingle = setDataSingleFn;
            ctrl.chemical_compounds = ["NO_2", "CO", "SO_2", "PM10"];
            ctrl.realtimeDataAll = [
                {
                    "Items": []
                },
                {
                    "Items": []
                },
                {
                    "Items": []
                },
                {
                    "Items": []
                }
            ];
            ctrl.realtimeDataSingle = [];

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
                        borderColor: 'rgba(255, 99, 132, 0.5)',
                        // This binds the dataset to the left y axis
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 4,
                        yAxisID: 'left-y-axis'
                    }, {
                        data: [],
                        label: '',
                        borderColor: 'rgba(54, 162, 235, 0.5)',
                        // This binds the dataset to the right y axis
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 4,
                        yAxisID: 'left-y-axis'
                    }, {
                        data: [],
                        label: '',
                        borderColor: 'rgba(75, 192, 192, 0.5)',
                        // This binds the dataset to the right y axis
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 4,
                        yAxisID: 'left-y-axis'
                    }, {
                        data: [],
                        label: '',
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
                timestampEnd:'1546267520'};

            ctrl.timestampAll = {};

            ctrl.timestampSingle = {};

            getAllCompoundDataFn(ctrl.timestampAllDefault);
            getSingleCompoundDataFn(ctrl.timestampAllDefault);

            function setDataAllFn() {
                console.log(ctrl.realtimeDataAll[0].Items);
                for(var i=4; i<8; i++){
                    allLine.data.datasets[i-4].label = ctrl.chemical_compounds[i-4];
                    for(var j=0; j<Object.keys(ctrl.realtimeDataAll[i]).length; j++){
                        var item = {
                          y: ctrl.realtimeDataAll[i].Items[j].value,
                          x: ctrl.realtimeDataAll[i].Items[j].timestamp
                        };
                        allLine.data.datasets[i-4].data.push(item);
                    }
                    console.log(allLine.data.datasets[i-4].data);
                }
            }

            function setDataSingleFn() {
                //singleLine.data.dataset[0].label = $stateParams.chemical_compound;
                singleLine.data.datasets[0].label = "NO_2";
                for(var j=0; j<ctrl.realtimeDataSingle.length; j++){
                    var item = {
                        y: ctrl.realtimeDataSingle[j].value,
                        x: ctrl.realtimeDataSingle[j].timestamp
                    };
                    singleLine.data.datasets[0].data.push(item);
                }
            }

            function getAllCompoundDataFn(timestamp) {
                console.log("refresh data");
                for(var i=0; i<4; i++){
                    RealtimeFactory.GetSingleQ1(ctrl.chemical_compounds[i], timestamp,
                        function (realtimeDataSingle) {
                            ctrl.realtimeDataAll.push(realtimeDataSingle);
                        }, function (error) {
                            ErrorStateRedirector.GoToErrorPage({Messaggio: "Errore nell'import dei dati"});
                        });
                }
                setDataAllFn();
            }

            function getSingleCompoundDataFn(timestamp) {
                //var chemicalCompound = $stateParams.chemical_compound;
                var chemicalCompound = "NO_2";
                RealtimeFactory.GetSingleQ1(chemicalCompound, timestamp,
                    function (realtimeDataSingle) {
                        ctrl.realtimeDataSingle = realtimeDataSingle;
                        setDataSingleFn();
                    }, function (error) {
                        ErrorStateRedirector.GoToErrorPage({Messaggio: "Errore nell'import dei dati"});
                    });
            }

        }]);