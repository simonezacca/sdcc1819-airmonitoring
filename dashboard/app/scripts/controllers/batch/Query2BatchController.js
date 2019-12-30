'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
mainAngularModule
    .controller('Query2BatchController', ['$scope', '$state', 'BatchFactory', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'ErrorStateRedirector',
        function ($scope, $state, BatchFactory, DTOptionsBuilder, DTColumnDefBuilder, ErrorStateRedirector) {

            var ctrl = this;
            ctrl.refreshInfluxData = refreshInfluxDataFn;
            ctrl.chemical_compounds = ["NO_2", "CO", "SO_2", "PM10"];

            $scope.labels = ['Winter', 'Spring', 'Summer', 'Autumn'];
            $scope.series = ['Series A'];

            $scope.dataCO = [];
            $scope.dataNO_2 = [];
            $scope.dataSO_2 = [];
            $scope.dataPM10 = [];

            $scope.ColorBar = ['#90EE90', '#FF6600'];
            $scope.DataSetOverride = [{ yAxisID: 'y-axis-1' }]; //y-axis-1 is the ID defined in scales under options.

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
                        }]
                }
            };

            $scope.clickme = function($event){
                alert("You've clicked upon "+$event[0]._view.label);
            };

            $scope.hoverme = function ($event) {
                alert("You hovered over " + $event[0]._view.label);
            };

            /*$scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('C<"clear">');
            $scope.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(6).notSortable()
            ];*/
            refreshInfluxDataFn();

            function refreshInfluxDataFn() {
                console.log("refresh data");
                BatchFactory.GetAllQ2(
                    function (batchData) {
                        ctrl.batchData = JSON.parse(batchData);
                        let COresult = ctrl.batchData[0].result1;
                        let COresultSplit = COresult.split(',');
                        $scope.dataCO.push(COresultSplit[27]);
                        $scope.dataCO.push(COresultSplit[34]);
                        $scope.dataCO.push(COresultSplit[41]);
                        $scope.dataCO.push(COresultSplit[48]);
                        let NO_2result = ctrl.batchData[1].result2;
                        let NO_2resultSplit = NO_2result.split(',');
                        $scope.dataNO_2.push(NO_2resultSplit[27]);
                        $scope.dataNO_2.push(NO_2resultSplit[34]);
                        $scope.dataNO_2.push(NO_2resultSplit[41]);
                        $scope.dataNO_2.push(NO_2resultSplit[48]);
                        let SO_2result = ctrl.batchData[2].result3;
                        let SO_2resultSplit = SO_2result.split(',');
                        $scope.dataSO_2.push(SO_2resultSplit[27]);
                        $scope.dataSO_2.push(SO_2resultSplit[34]);
                        $scope.dataSO_2.push(SO_2resultSplit[41]);
                        $scope.dataSO_2.push(SO_2resultSplit[48]);
                        let PM10result = ctrl.batchData[3].result4;
                        let PM10resultSplit = PM10result.split(',');
                        $scope.dataPM10.push(PM10resultSplit[27]);
                        $scope.dataPM10.push(PM10resultSplit[34]);
                        $scope.dataPM10.push(PM10resultSplit[41]);
                        $scope.dataPM10.push(PM10resultSplit[48]);
                    }, function (error) {
                        ErrorStateRedirector.GoToErrorPage({Messaggio: "Errore nell'import dei dati"});
                    });
            }

        }]);