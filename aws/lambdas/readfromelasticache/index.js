'use strict';
var redis = require('redis');
var http = require('http');
var bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const GLOBAL_KEY = 'lambda-test';
const redisOptions = {
    host: "18.185.37.159",
    port: 3456
}

redis.debug_mode = true;

exports.handler = function(event, context, callback) {
    console.info('Start to connect to Redis Server');
    var client = redis.createClient(redisOptions);
    console.info('Connected to Redis Server');

    console.info('event.httpMethod: ', "GET");
    let id = "query_1";
    if(event.httpMethod ==="GET") {
        if (id) {
            console.info('get by id');
            client.hgetAsync(GLOBAL_KEY, id).then(res => {
                console.info('Redis responses for get single: ', res);
                res.map((obj) => {console.info("Che ci sta in questo cazzo di array? " + JSON.stringify(obj))});
                callback(null, {body: "This is a READ operation on product ID " + id, ret: JSON.stringify(res)});
                // callback(null, {body: "This is a READ operation on product ID " + id});
            }).catch(err => {
                console.error("Failed to get single: ", err)
                callback(null, {statusCode: 500, message: "Failed to get data"});
            }).finally(() => {
                console.info('Disconnect to Redis');
                client.quit();
            });
        }
    }else {
        console.log("Error: unsupported HTTP method (" + event.httpMethod + ")");
        callback(null, {statusCode: 501});
    }
};