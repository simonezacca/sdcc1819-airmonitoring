'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */

mainAngularModule
    .controller('Query2BatchController', ['$scope', '$state', 'BatchFactory', 'DTOptionsBuilder', 'DTColumnDefBuilder',
        'ErrorStateRedirector', 'BatchDataUtils' , 'SensorsMapFactory',
        function ($scope, $state, BatchFactory, DTOptionsBuilder, DTColumnDefBuilder, ErrorStateRedirector,
                  BatchDataUtils,SensorsMapFactory) {


            let ctrl = this;

            ctrl.refreshInfluxData = refreshInfluxDataFn;

            $scope.ColorBar = ['#90EE90', '#FF6600'];

            $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
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
                        },
                        {
                            id: 'y-axis-2',
                            type: 'linear',
                            display: true,
                            position: 'right'
                        }]
                }
            };

            refreshInfluxDataFn();

            function refreshInfluxDataFn() {
                console.log("refresh data");
                BatchFactory.GetAllQ2(
                    function (batchData) {
                        ctrl.query2DataForChart = BatchDataUtils.GetDataForChart(batchData);
                        SensorsMapFactory.GetAdaptedSensors(
                            (adaptedSensors) => {
                                ctrl.query2DataForMap = BatchDataUtils.GetDataForMap(adaptedSensors,ctrl.query2DataForChart);
                            }
                        );
                    }, function (error) {
                        ErrorStateRedirector.GoToErrorPage({Messaggio: "Errore nell'import dei dati"});
                    });
            }

        }]);