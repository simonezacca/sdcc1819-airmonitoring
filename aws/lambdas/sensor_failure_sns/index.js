'use strict';
var AWS = require('aws-sdk');
var dynamoDB = new AWS.DynamoDB({apiVersion: '2012-08-10'});

exports.handler = function(event, context, callback){
    var jsonObject = JSON.parse(event.Records[0].Sns.Message);

    console.log("Received event: ", event.Records[0].Sns.Message);
    dynamoDB.putItem({
        TableName: "sensor_failures",
        Item: {
            "sensor_id": {
                "S": jsonObject.sensor_id
            },
            "timestamp" : {
                "N": jsonObject.timestamp
            },
            "fault_counter" : {
                "N": jsonObject.fault_counter
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
                body: 'Hello ' + event.Records[0].Sns.Message + '!'
            });
        }
    })
};
