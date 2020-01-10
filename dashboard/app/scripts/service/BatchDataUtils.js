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
            thisFactoryObject.GetDataForMap = GetDataForMapFn;

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


            function GetDataForMapFn(adaptedSensors,adaptedChartData) {
                let resultObj = []
                adaptedChartData.forEach(
                    (problemData) => {
                        resultObj.push(createSensorsAdaptedObject(adaptedSensors,problemData));
                    }
                );
                return resultObj;
            }

            function getValueDataFromIndex(index, problemData) {
                let resultValues = [];
                let dataSeriesSize = problemData.series.length; // 2

                for (let i=0; i<dataSeriesSize; i++) {
                    let val = problemData.data[i][index];
                    resultValues.push(val);
                }
                return resultValues;
            }

            function getIconFromValues(valuesArray,maxValue) {
                let resultIconObj = {
                    path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
                    fillColor: 'yellow',
                    fillOpacity: 0.8,
                    scale: 0.1,
                    strokeColor: 'black',
                    strokeWeight: 1
                };

                let sum = valuesArray.reduce((total,curr) => {
                    return parseFloat(total) + parseFloat(curr);
                });

                let ratio = sum / maxValue;

                if (ratio < 0.5) {
                    resultIconObj.fillColor = "green";
                }
                if (ratio > 0.5 && ratio < 0.75) {
                    resultIconObj.fillColor = "yellow";
                }
                if (ratio > 0.75) {
                    resultIconObj.fillColor = "red";
                }
                return resultIconObj;


            }

            function getMaxValueForDataSeries(problemData) {
                let dataSeriesSize = problemData.series.length; // 2
                let maxResult = 0;

                let dataSeries = problemData.data; // array size 2
                dataSeries.forEach(
                    (dataValue) => {
                        let curMax = 0;
                        for (let i=0;i<dataSeriesSize; i++) {
                            curMax +=  parseFloat(dataValue[i]);
                        }
                        if (curMax>maxResult){
                            maxResult = curMax;
                        }
                });
                return maxResult;
            }

            function createSensorsAdaptedObject(adaptedSensors,problemData) {
                let sensorsIdArray = problemData.labels;
                let maxValue = getMaxValueForDataSeries(problemData);
                let newAdaptedSensors = [];

                sensorsIdArray.forEach(
                    (sensorId, index) => {
                        let valuesForSensor = getValueDataFromIndex(index,problemData);
                        let sensorObject = adaptedSensors.filter((s)=>s.sensor_id==sensorId)[0];
                        sensorObject.icon = getIconFromValues(valuesForSensor,maxValue);
                        newAdaptedSensors.push(sensorObject);
                    }
                );
                console.log(newAdaptedSensors);
                return newAdaptedSensors;

            }

            return thisFactoryObject;
        }]);