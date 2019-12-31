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

            function createDataObjectArray(rawResponseObjArray) {
                let resultDataObjectArray = [];
                rawResponseObjArray.forEach(
                    (singleProblemObject) => {
                        resultDataObjectArray.push(createDataObject(singleProblemObject));
                    }
                );
                return resultDataObjectArray;
            }

            function createDataObject(singleProblemObject) {
                let resultDataObj = {};
                resultDataObj.problem_description = singleProblemObject.problem_description;

                let cleanedStrings = singleProblemObject.result_query.split('\n');
                cleanedStrings.splice(0,3);
                return convertCSVStringToObject(cleanedStrings);
            }

            function convertCSVStringToObject(rawString) {
                let jsonObj = [];
                let headers = rawString[0].split(',');
                //remove first elem
                if (headers[0]=="") {
                    headers.splice(0,1);
                }
                for(let i = 1; i < rawString.length; i++) {
                    let data = rawString[i].split(',');
                    if (data[0]=="") {
                        data.splice(0,1);
                    }
                    let obj = {};
                    for(let j = 0; j < data.length; j++) {
                        obj[headers[j].trim()] = data[j].trim();
                    }
                    jsonObj.push(obj);
                }
                return jsonObj;
            }

            function createLabels(problemObjects) {
                let labels = [];
                problemObjects.forEach(
                    (po) => labels.push(po.sensorid)
                );
                return labels;
            }

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


            refreshInfluxDataFn();

            function refreshInfluxDataFn() {
                console.log("refresh data");
                BatchFactory.GetAllQ2(
                    function (batchData) {
                        ctrl.query2Data = createDataObjectArray(batchData);
                        ctrl.labels = createLabels(ctrl.query2Data[0]);

                    }, function (error) {
                        ErrorStateRedirector.GoToErrorPage({Messaggio: "Errore nell'import dei dati"});
                    });
            }

        }]);