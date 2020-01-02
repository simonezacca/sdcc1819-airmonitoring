'use strict';
var redis = require('redis');
const msgLibs = require('./libs/responseMessage.js');

const redisOptions = {
    host: process.env.ELASTICACHEHOST,
    port: 3456
};

redis.debug_mode = true;

function redisGet(queryNameKey, finalCallBack) {
    console.info('Start to connect to Redis Server');
    let client = redis.createClient(redisOptions);
    client.on('connect', function () {
        console.log('Redis client connected');
    });
    client.on('error', function (err) {
        console.log('Something went wrong ' + err);
    });
    console.log("queryNameKey: "+queryNameKey);
    client.get(queryNameKey, function (error, result) {
        if (error) {
            console.log(error);
            client.quit();
            finalCallBack(null, msgLibs.createErrorResponse(500, error));
            return {};
        }
        console.log('query result: ' + result);
        let resultObject = JSON.parse(result);
        finalCallBack(null, msgLibs.createSuccessResponse(200,resultObject));
        client.quit();
    });
}

exports.handler = function(event, context, callback) {

    console.info('Connected to Redis Server');
    //console.info('event.httpMethod: ', "GET");
    console.info('event.requestContext.resourcePath: ',event.requestContext.resourcePath);
    let resourcePath = event.requestContext.resourcePath;
    let queryName = undefined;

    if (resourcePath==="/influxquery1") queryName = "query_seasons_pollution";
    if (resourcePath==="/influxquery2") queryName = "query_healths_problems";

    if (event.httpMethod === "GET") {
        console.log("resourcePath: "+resourcePath);
        if (queryName) {
            redisGet(queryName,callback);
        }
    } else {
        console.log("Error: unsupported HTTP method (" + event.httpMethod + ")");
        callback(null, {statusCode: 501, body:"Error: unsupported HTTP method (" + event.httpMethod + ")"});
    }
};