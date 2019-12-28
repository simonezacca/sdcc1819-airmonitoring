'use strict';
var AWS = require('aws-sdk');
var dynamoDB = new AWS.DynamoDB({apiVersion: '2012-08-10'});

function deleteConnectionId(connectionId,callback) {
    var params = {
        Key: {
            "connectionid": {
                S: connectionId
            }
        },
        TableName: "ws_connections"
    };

    dynamoDB.deleteItem(params, function(err, data) {
        if (err) {
            // an error occurred
            console.log(err, err.stack);
            callback(null, {
                statusCode: '500',
                body: err
            });
        }
        else {
            console.log(data);// successful response
            callback(null, {
                statusCode: '200',
                body: 'ConnectionId '+ connectionId + ' removed with success'
            });
        }
    });
}

exports.handler = function(event, context, callback){
    const connectionId = event.requestContext.connectionId;
    deleteConnectionId(connectionId,callback);
};
