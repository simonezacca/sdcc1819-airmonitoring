'use strict';
var AWS = require('aws-sdk');
var dynamoDB = new AWS.DynamoDB({apiVersion: '2012-08-10'});

exports.handler = function(event, context, callback) {
    var jsonObject = JSON.parse(event.body);
    var httpMethod = JSON.parse(event.httpMethod);
    var sensorid = JSON.parse(event.pathParameters.sensor_id);

    if (httpMethod.localeCompare("POST")) {
        create(jsonObject);
    } else if (httpMethod.localeCompare("PUT")) {
        update(jsonObject);
    } else if (httpMethod.localeCompare("GET") && (sensorid != null || sensorid !== undefined)) {
        read(sensorid);
    } else if (httpMethod.localeCompare("GET")) {
        readAll();
    } else if (httpMethod.localeCompare("DELETE") && (sensorid != null || sensorid !== undefined)) {
        remove(sensorid);
        console.log("Received event: ", event.body);

    }
    ;

    function create(jsonObject) {

        dynamoDB.putItem({
            TableName: "sensor_information",
            Item: {
                "sensor_id": {
                    "S": jsonObject.sensor_id
                },
                "lat": {
                    "S": jsonObject.lat
                },
                "lon": {
                    "S": jsonObject.lon
                },
                /* Se impostiamo i vari valori dei compounds come booleani non c'è bisogno di fare il controllo */
                "compounds": {
                    "L": [
                        {
                            "CO": {
                                "BOOL": jsonObject.CO
                            }
                        },
                        {
                            "NO_2": {
                                "BOOL": jsonObject.NO_2
                            }
                        },
                        {
                            "PM10": {
                                "BOOL": jsonObject.PM10
                            }
                        },
                        {
                            "SO_2": {
                                "BOOL": jsonObject.SO_2
                            }
                        }
                    ]
                }
            }
        }, function (err, data) {
            if (err) {
                console.log(err, err.stack);
                callback(null, {
                    statusCode: '500',
                    body: err
                });
            } else {
                callback(null, {
                    statusCode: '200',
                    body: 'Hello ' + jsonObject + '!'
                });
            }
        })
    }

    function update(jsonObject) {
        var params = {
            TableName: "sensor_information",
            Key: {
                "sensor_id": jsonObject.sensor_id,
            },
            // TODO rivedere bene update
            UpdateExpression: "set item.lat =:lat, item.lon=:lon, item.compounds=:compounds",
            ExpressionAttributeValues: {
                ":lat": jsonObject.lat,
                ":lon": jsonObject.lon,
                ":compounds": [jsonObject.CO, jsonObject.NO_2, jsonObject.PM10, jsonObject.SO_2]
            },
            ReturnValues: "UPDATED_NEW"
        };

        console.log("Updating the item...");
        dynamoDB.update(params, function (err, data) {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            }
        });
    }

    function read(sensorid) {
        var params = {
            TableName: "information_sensor",
            Key: {
                "sensor_id": sensorid
            }
        };
        dynamoDB.get(params, function (err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            }
        });
    }

    function readAll() {
        var params = {
            TableName: "information_sensor",
        };
        dynamoDB.get(params, function (err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            }
        });
    }

    function remove(sensorid) {

        var params = {
            TableName: "sensor_information",
            Key: {
                "sensor_id": sensorid,
            }
        };

        console.log("Attempting a conditional delete...");
        dynamoDB.delete(params, function (err, data) {
            if (err) {
                console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
            }
        });
    }
}
