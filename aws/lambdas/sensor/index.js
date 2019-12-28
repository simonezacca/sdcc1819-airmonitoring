'use strict';
var AWS = require('aws-sdk');
var dynamoDB = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var tableName = "sensor_information";

const msgLibs = require('./libs/responseMessage.js');


function create(jsonObject, cb) {

    dynamoDB.putItem({
        TableName: tableName,
        /*Item: {
            "sensor_id": {
                "S": jsonObject.sensor_id
            },
            "lat": {
                "S": jsonObject.lat
            },
            "lon": {
                "S": jsonObject.lon
            },
            "CO": {
                "BOOL": jsonObject.CO
            },
            "NO_2": {
                "BOOL": jsonObject.NO_2
            },
            "PM10": {
                "BOOL": jsonObject.PM10
            },
            "SO_2": {
                "BOOL": jsonObject.SO_2
            }
        }
         */
    Item: jsonObject
    }, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            /*callback(null, {
                statusCode: '500',
                body: err
            });*/

        } else {
            cb("New sensor with id "+ jsonObject.sensor_id.S + " created with success");
        }
    })
}

function update(sensorid, jsonObject, cb) {
    var params = {
        TableName: tableName,
        Key: {
            "sensor_id": {"S": sensorid}
        },
        UpdateExpression: 'SET lat = :lat, lon= :lon, SO_2= :SO_2, NO_2= :NO_2, CO= :CO, PM10= :PM10',
        ExpressionAttributeValues: {
            ':lat': jsonObject.lat,
            ':lon': jsonObject.lon,
            ':SO_2': jsonObject.SO_2,
            ':NO_2': jsonObject.NO_2,
            ':CO': jsonObject.CO,
            ':PM10': jsonObject.PM10
        }
    };
    console.log("Updating the item...");
    dynamoDB.updateItem(params, function (err, data) {
        if (err) {
            console.error("Unable to update item. Error JSON:", err);
        } else {
            cb("Sensor "+ jsonObject.sensor_id.S + " updated");

        }
    });
}

function read(sensorid, cb) {
    var params = {
        TableName: tableName,
        Key: {
            "sensor_id": {"S": sensorid}
        }
    };
    dynamoDB.getItem(params, function (err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", err);
        } else {
            console.log("GetItem succeeded:", data);
            cb(data);
        }
    });
}

function readAll(cb) {
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

function remove(sensorid, cb) {

    var params = {
        TableName: tableName,
        Key: {
            "sensor_id": {"S": sensorid}
        }
    };

    console.log("Attempting a conditional delete...");
    dynamoDB.deleteItem(params, function (err, data) {
        if (err) {
            console.error("Unable to delete item. Error JSON:", err);
        } else {
            cb("Delete sensor with id "+ sensorid);
        }
    });
}

exports.handler = function(event, context, callback) {
    console.log(event);
    var jsonObject = JSON.parse(event.body);
    var httpMethod = event.httpMethod;
    var sensorid = null;

    if(event.pathParameters != null && event.pathParameters.sensor_id){
        sensorid = event.pathParameters.sensor_id;
    }
    console.log("sensorid:", sensorid);

    if (httpMethod === "GET" && (sensorid != null || sensorid != undefined)) {
        console.log("readInvocation");
        read(sensorid, (sensorObject) => callback(null, msgLibs.createSuccessResponse(200, sensorObject)));
    } else if (httpMethod === "GET") {
        console.log("readAllInvocation");
        readAll((items) => {callback(null, msgLibs.createSuccessResponse(200, items))});
    } else if(httpMethod === "POST"){
        console.log("Create a new Sensor");
        if(jsonObject != null){
            create(jsonObject, (response) => {callback(null,msgLibs.createSuccessResponse(201,response))});
        }
    } else if(httpMethod === "DELETE" && (sensorid != null || sensorid != undefined)){
        console.log("Delete sensor: " + sensorid);
        remove(sensorid, (response) => {callback(null, msgLibs.createSuccessResponse(204,response))})
    } else if(httpMethod === "PUT"){
        console.log("Update sensor: " + sensorid);
        update(sensorid,jsonObject, (response) => {callback(null, msgLibs.createSuccessResponse(204,response))})


    }
    console.log("Received event: ", event.body);
};
