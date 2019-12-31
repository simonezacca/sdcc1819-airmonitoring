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

            function extractValueForSeason(rawText, seasonString) {
                let start_index = rawText.indexOf(","+seasonString);
                let result = rawText.substring(start_index+13, start_index+13+18);
                return result;
            }

            function refreshInfluxDataFn() {
                console.log("refresh data");
                BatchFactory.GetAllQ1(
                    function (batchData) {
                        console.log(batchData);
                        ctrl.batchData = batchData;


                        let COresult = ctrl.batchData[0].result;

                        $scope.dataCO.push(extractValueForSeason(COresult,"spring"));
                        $scope.dataCO.push(extractValueForSeason(COresult,"summer"));
                        $scope.dataCO.push(extractValueForSeason(COresult,"autumn"));
                        $scope.dataCO.push(extractValueForSeason(COresult,"winter"));

                        let NO_2result = ctrl.batchData[1].result;

                        $scope.dataNO_2.push(extractValueForSeason(NO_2result,"spring"));
                        $scope.dataNO_2.push(extractValueForSeason(NO_2result,"summer"));
                        $scope.dataNO_2.push(extractValueForSeason(NO_2result,"autumn"));
                        $scope.dataNO_2.push(extractValueForSeason(NO_2result,"winter"));

                        let SO_2result = ctrl.batchData[2].result;

                        $scope.dataSO_2.push(extractValueForSeason(SO_2result,"spring"));
                        $scope.dataSO_2.push(extractValueForSeason(SO_2result,"summer"));
                        $scope.dataSO_2.push(extractValueForSeason(SO_2result,"autumn"));
                        $scope.dataSO_2.push(extractValueForSeason(SO_2result,"winter"));

                        let PM10result = ctrl.batchData[3].result;
                        
                        $scope.dataPM10.push(extractValueForSeason(PM10result,"spring"));
                        $scope.dataPM10.push(extractValueForSeason(PM10result,"summer"));
                        $scope.dataPM10.push(extractValueForSeason(PM10result,"autumn"));
                        $scope.dataPM10.push(extractValueForSeason(PM10result,"winter"));
                    }, function (error) {
                        ErrorStateRedirector.GoToErrorPage({Messaggio: "Errore nell'import dei dati"});
                    });
            }

        }]);