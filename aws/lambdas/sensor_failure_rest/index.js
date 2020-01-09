'use strict';
var AWS = require('aws-sdk');
var dynamoDB = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var tableName = "sensor_failures";

const msgLibs = require('./libs/responseMessage.js');



function readAllFailures(cb) {
    var params = {
        TableName: tableName,
    };
    dynamoDB.scan(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.Items);
            cb(data.Items);
        }
    });
}


exports.handler = function(event, context, callback) {
    console.log(event);
    var jsonObject = JSON.parse(event.body);
    var httpMethod = event.httpMethod;
    var sensorid = null;


    if (httpMethod === "GET") {
        console.log("readAllFailures");
        readAllFailures((items) => {callback(null, msgLibs.createSuccessResponse(200, items))});
    }
    console.log("Received event: ", event.body);
};
