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
            ctrl.chemical_compounds = ["NO_2", "CO", "SO_2", "PM10"];

            $scope.labels = ['Winter', 'Spring', 'Summer', 'Autumn'];
            $scope.series = ['Series A'];

            $scope.dataAll = [];
            $scope.dataSingle = [];

            $scope.ColorBar = ['#90EE90', '#FF6600', '#0000FF', '#800517'];
            $scope.DataSetOverride = [{ yAxisID: 'y-axis-1' }, {xAxisID: 'x-axis-1'}]; //y-axis-1 is the ID defined in scales under options.

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
                    xAxes: [
                        {
                            id:'x-axis-1',
                            type: 'time',
                            display: true,
                            position: 'bottom'
                            //time: 'timeinfo'
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
                timestampStart:'1540046761',
                timestampEnd:'1544453161'};

            ctrl.timestampAll = {};

            ctrl.timestampSingle = {};

            /*$scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('C<"clear">');
            $scope.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(6).notSortable()
            ];*/
            getAllCompoundDataFn(ctrl.timestampAllDefault);
            getSingleCompoundDataFn(ctrl.timestampAllDefault);

            function getAllCompoundDataFn(timestamp) {
                console.log("refresh data");
                RealtimeFactory.GetAllQ1(timestamp,
                    function (realtimeDataAll) {
                        ctrl.realtimeDataAll = realtimeDataAll;

                    }, function (error) {
                        ErrorStateRedirector.GoToErrorPage({Messaggio: "Errore nell'import dei dati"});
                    });
            }

            function getSingleCompoundDataFn(timestamp) {
                //var chemicalCompound = $stateParams.chemical_compound;
                var chemicalCompound = "NO";
                RealtimeFactory.GetSingleQ1(chemicalCompound, timestamp,
                    function (realtimeDataSingle) {
                        ctrl.realtimeDataSingle = realtimeDataSingle;

                    }, function (error) {
                        ErrorStateRedirector.GoToErrorPage({Messaggio: "Errore nell'import dei dati"});
                    });
            }

        }]);