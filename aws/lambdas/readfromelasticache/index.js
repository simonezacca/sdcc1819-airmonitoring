'use strict';
var redis = require('redis');
const msgLibs = require('./libs/responseMessage.js');

const redisOptions = {
    host: process.env.ELASTICACHEHOST,
    port: 3456
};

redis.debug_mode = true;

exports.handler = function(event, context, callback) {
    console.info('Start to connect to Redis Server');
    var client = redis.createClient(redisOptions);
    console.info('Connected to Redis Server');
    console.info('event.httpMethod: ', "GET");
    let id = "query_1";
    if (event.httpMethod === "GET") {
        if (id) {
            client.on('connect', function () {
                console.log('Redis client connected');
            });

            client.on('error', function (err) {
                console.log('Something went wrong ' + err);
            });
            client.get(id, function (error, result) {
                if (error) {
                    console.log(error);
                    callback(null, msgLibs.createErrorResponse(500, error));
                    client.quit();
                    return {};
                }
                console.log('GET result ->' + result);
                callback(null, msgLibs.createSuccessResponse(200,result));
            });
            client.quit();

        } else {
            console.log("Error: unsupported HTTP method (" + event.httpMethod + ")");
            callback(null, {statusCode: 501});
        }
    }
};