'use strict';
//TODO completare la scrittura dei msg SQS in dynamoDB table
var AWS = require('aws-sdk');
var dynamoDB = new AWS.DynamoDB({apiVersion: '2012-08-10'}); //da vedere api version

exports.handler = function(event, context, callback){
    var jsonObject = event.Records[0].body; //JSON.parse();

    console.log("test lambda result: " + event.Records[0].body);
    dynamoDB.putItem({
        TableName: "test-dynamo",      //creare tabella in dynamoDB
        Item: {     // definire tutti i campi da inserire nella query
            "chemical_compound": {     //capire come prendere tutti i valori dal body del msg sqs
                S: jsonObject.chemical_compound
            },
            "timestamp" : {
                N: jsonObject.timestamp
            },
            "value" : {
                N: jsonObject.value
            },
            "sensor_id" : {
                S: jsonObject.sensor_id
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
                body: 'Hello ' + event.Records[0].body + '!'
            });
        }
    })

};