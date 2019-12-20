'use strict';

var redis = require('redis');
var http = require('http');
var bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const GLOBAL_KEY = 'airmonitoring-cachekey';
const redisOptions = {
    host: "elasticache-influx-001.kzez0j.0001.euc1.cache.amazonaws.com",
    port: 6379
}

redis.debug_mode = true;

function handler(event, context, callback) {
    console.info('Start to connect to Redis Server');
    var client = redis.createClient(redisOptions);
    console.info('Connected to Redis Server');

    //console.info('event.pathParameters: ', event.pathParameters);
    //console.info('event.httpMethod: ', "GET");
    //let id = (event.pathParameters || {}).product || false;
    let id = "query_1"

   // if(event.httpMethod ==="GET") {
        if (id) {
            console.info('get by id');
            client.hgetAsync(GLOBAL_KEY, id).then(res => {
                console.info('Redis responses for get single: ', res);
                callback(null, {body: "This is a READ operation on product ID " + id, ret: JSON.stringify(res)});
                // callback(null, {body: "This is a READ operation on product ID " + id});
            }).catch(err => {
                console.error("Failed to get single: ", err)
                callback(null, {statusCode: 500, message: "Failed to get data"});
            }).finally(() => {
                console.info('Disconnect to Redis');
                client.quit();
            });

            return;
      //  }
    }else {
        console.log("Error: unsupported HTTP method (" + event.httpMethod + ")");
        callback(null, {statusCode: 501});
    }
}

handler({},{},{});