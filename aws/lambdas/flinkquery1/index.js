'use strict';
var AWS = require('aws-sdk');
var dynamoDB = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var tableName = "flink-query1";

const msgLibs = require('./libs/responseMessage.js');

function read(compound, timestampStart, timestampEnd, cb) {
    console.log("selected timestamp:", timestampStart);
    var params = {
        TableName: tableName,
        /*Key: {
            "chemical_compound": {"S": compound},
            //"timestamp": {"N": timestamp}
        },*/
        KeyConditionExpression: "chemical_compound = :compound AND #timestamp BETWEEN :timestampStart AND :timestampEnd",
        ExpressionAttributeNames: { "#timestamp": "timestamp" },
        ExpressionAttributeValues: {
            ":timestampStart": {"N": timestampStart},
            ":timestampEnd": {"N": timestampEnd},
            ":compound": {"S": compound}
        }
    };
    //usare query quando si deve lavorare sulla chiave primaria quindi va specificato il
    //KeyConditionExpression
    dynamoDB.query(params, function (err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", err);
        } else {
            console.log("GetItem succeeded:", data);
            cb(data);
        }
    });
}

function readAll(timestampStart, timestampEnd, cb) {
    var params = {
        TableName: tableName,
        FilterExpression: "#timestamp BETWEEN :timestampStart AND :timestampEnd",
        ExpressionAttributeNames: { "#timestamp": "timestamp" },
        ExpressionAttributeValues: {
            ":timestampStart": {"N": timestampStart},
            ":timestampEnd": {"N": timestampEnd}
        }
    };
    //usare scan quando non si deve lavorare sulla chiave primaria quindi non va specificato il
    //KeyConditionExpression ma si usa il FilterExpression
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
    //var jsonObject = JSON.parse(event.body);
    var httpMethod = event.httpMethod;
    var compound = null;
    var timestampStart = null;
    var timestampEnd = null;

    if(event.pathParameters != null && event.pathParameters.compound){
        compound = event.pathParameters.compound;
        //timestamp = event.pathParameters.timestamp;
    }

    //TODO vedere come passare parametri direttamente in pathparameter da api gateway
    if(event.queryStringParameters != null){
        timestampStart = event.queryStringParameters.timestampStart;
        timestampEnd = event.queryStringParameters.timestampEnd;
    }
    console.log("selected compound:", compound);
    console.log("timestampStart:", timestampStart, " timestampEnd: ", timestampEnd);

    if (httpMethod === "GET" && compound != null) {
        console.log("readInvocation");
        read(compound, timestampStart, timestampEnd, (compoundObject) => callback(null, msgLibs.createSuccessResponse(200, compoundObject)));
    } else if (httpMethod === "GET") {
        console.log("readAllInvocation");
        readAll(timestampStart, timestampEnd, (items) => {callback(null, msgLibs.createSuccessResponse(200, items))})
    }
    console.log("Received event: ", event.body);
};
