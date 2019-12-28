'use strict';
var AWS = require('aws-sdk');
var dynamoDB = new AWS.DynamoDB({apiVersion: '2012-08-10'});

function addConnectionId(connectionId,callback) {
    dynamoDB.putItem({
        TableName: "ws_connections",
        Item: {
            "connectionid": {
                "S": connectionId
            }
        }
    }, function (err, data) {
        if(err) {
            console.log(err, err.stack);
            callback(null, {
                statusCode: '500',
                body: err
            });
        } else {
            callback(null, {
                statusCode: '200',
                body: 'ConnectionId '+ connectionId + ' added with success'
            });
        }
    })
}

exports.handler = function(event, context, callback){
    const connectionId = event.requestContext.connectionId;
    addConnectionId(connectionId,callback);
};
