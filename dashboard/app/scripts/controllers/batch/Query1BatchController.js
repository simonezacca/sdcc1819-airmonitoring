'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
mainAngularModule
    .controller('Query1BatchController', ['$scope', '$state', 'BatchFactory', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'ErrorStateRedirector',
        function ($scope, $state, BatchFactory, DTOptionsBuilder, DTColumnDefBuilder, ErrorStateRedirector) {

            var ctrl = this;
            ctrl.refreshInfluxData = refreshInfluxDataFn;
            ctrl.chemical_compounds = ["NO_2", "CO", "SO_2", "PM10"];

            $scope.labels = ['Spring', 'Summer', 'Autumn', 'Winter'];
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

            function cleanValue(rawText) {
                return rawText.replace("#datatype","");
            }

            function refreshInfluxDataFn() {
                console.log("refresh data");
                BatchFactory.GetAllQ1(
                    function (batchData) {
                        console.log(batchData);
                        ctrl.batchData = JSON.parse(batchData);


                        let COresult = ctrl.batchData[0].result;
                        let COresultSplit = COresult.split(',');
                        $scope.dataCO.push(cleanValue(COresultSplit[15]));
                        $scope.dataCO.push(cleanValue(COresultSplit[30]));
                        $scope.dataCO.push(cleanValue(COresultSplit[45]));
                        $scope.dataCO.push(cleanValue(COresultSplit[60]));

                        let NO_2result = ctrl.batchData[1].result;
                        let NO_2resultSplit = NO_2result.split(',');
                        $scope.dataNO_2.push(cleanValue(NO_2resultSplit[15]));
                        $scope.dataNO_2.push(cleanValue(NO_2resultSplit[30]));
                        $scope.dataNO_2.push(cleanValue(NO_2resultSplit[45]));
                        $scope.dataNO_2.push(cleanValue(NO_2resultSplit[60]));

                        let SO_2result = ctrl.batchData[2].result;
                        let SO_2resultSplit = SO_2result.split(',');
                        $scope.dataSO_2.push(cleanValue(SO_2resultSplit[15]));
                        $scope.dataSO_2.push(cleanValue(SO_2resultSplit[30]));
                        $scope.dataSO_2.push(cleanValue(SO_2resultSplit[45]));
                        $scope.dataSO_2.push(cleanValue(SO_2resultSplit[60]));

                        let PM10result = ctrl.batchData[3].result;
                        let PM10resultSplit = PM10result.split(',');
                        $scope.dataPM10.push(cleanValue(PM10resultSplit[15]));
                        $scope.dataPM10.push(cleanValue(PM10resultSplit[30]));
                        $scope.dataPM10.push(cleanValue(PM10resultSplit[45]));
                        $scope.dataPM10.push(cleanValue(PM10resultSplit[60]));
                    }, function (error) {
                        ErrorStateRedirector.GoToErrorPage({Messaggio: "Errore nell'import dei dati"});
                    });
            }

        }]);