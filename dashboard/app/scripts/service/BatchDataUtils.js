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
    .factory('BatchDataUtils', [
        function () {
            let thisFactoryObject = {};
            thisFactoryObject.GetDataForChart = GetDataForChartFn;

            function createDataObject(singleProblemObject) {
                let resultDataObj = {};
                resultDataObj.problem_description = singleProblemObject.problem_description;
                resultDataObj.params = singleProblemObject.params;

                let cleanedStrings = singleProblemObject.result_query.split('\n');
                cleanedStrings.splice(0,3);

                resultDataObj.data = convertCSVStringToObject(cleanedStrings);
                return resultDataObj;
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
                    if (data != "" && data.length>1) {
                        if (data[0]=="") {
                            data.splice(0,1);
                        }
                        let obj = {};
                        for(let j = 0; j < data.length; j++) {
                            obj[headers[j].trim()] = data[j].trim();
                        }
                        jsonObj.push(obj);
                    }
                }
                return jsonObj;
            }

            function createSeries(problemObjects) {
                let resultSeries = [];
                problemObjects.params.forEach(
                    (p) => {
                        resultSeries.push(p.compound_name);
                    }
                )
                return resultSeries;
            }

            function createLabels(problemObjects) {
                function isValid(po) {
                    return po.sensorid != undefined && po.sensorid != null;
                }
                let labels = [];
                problemObjects.data.forEach(
                    (po) => {
                        if (isValid(po)) {
                            labels.push(po.sensorid)
                        }
                    }
                );
                return labels;
            }

            function createDataArrays(seriesArray, procesedData) {
                let resultDataArray = [];
                let data = procesedData.data;
                seriesArray.forEach(
                    (singleCompound) => {
                        let dataCompoundArray = [];
                        data.forEach(
                            (singleDataObj) => {
                                let compoundValue = singleDataObj["count"+singleCompound];
                                dataCompoundArray.push(compoundValue);
                            }
                        );
                        resultDataArray.push(dataCompoundArray);
                    }
                );
                return resultDataArray;
            }

            function getSingleChartDataObject(singleRawBatchData) {
                let resultChartDataObject = {};
                resultChartDataObject.problem_description = singleRawBatchData.problem_description;

                let preProcessedData = createDataObject(singleRawBatchData);
                resultChartDataObject.labels = createLabels(preProcessedData);
                resultChartDataObject.series = createSeries(preProcessedData);

                resultChartDataObject.data = createDataArrays(resultChartDataObject.series,preProcessedData);

                return resultChartDataObject;
            }

            function GetDataForChartFn(rawBatchDataArray) {
                let arrayResultObjects = [];
                arrayResultObjects = rawBatchDataArray.map(
                    (srbd) => getSingleChartDataObject(srbd));

                return arrayResultObjects;
            }

            return thisFactoryObject;
        }]);