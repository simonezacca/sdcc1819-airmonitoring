'use strict';
var AWS = require('aws-sdk');
var dynamoDB = new AWS.DynamoDB({apiVersion: '2012-08-10'});

let tableName = "ws_connections";
let ws_endpoint = "https://p7s6xjwg04.execute-api.eu-central-1.amazonaws.com/dev/";


let send = undefined;

function init(event) {
    console.log(event);

    const apiGwMngApi = new AWS.ApiGatewayManagementApi(
        {
            apiVersion: "2018-11-29",
            endpoint: ws_endpoint
        });

    send = async (connectionid, data) => {
        await apiGwMngApi.postToConnection(
            {
                ConnectionId: connectionid,
                Data: JSON.stringify(data)
            }).promise();
    }
}


function getAllConnectionsIds(cb) {
    let params = {
        TableName: tableName
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


exports.handler = function(event, context, callback){
    init(event);

    // take alarm from SNS
    let jsonAlarmObject = JSON.parse(event.Records[0].Sns.Message);
    console.info("jsonAlarmObject" + JSON.stringify(jsonAlarmObject))


    getAllConnectionsIds((connectionIds)=> {
        // for each connection, send a message on ws
        connectionIds.forEach( (singleConn) => {
            console.log("singleConn: " + JSON.stringify(singleConn));
            send(singleConn.connectionid.S,jsonAlarmObject);
            return {};
        });
        callback(null, {status: 200, body: "sent message on ws"})
    })
};
