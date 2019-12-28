'use strict';

var redis = require('redis');
var bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const GLOBAL_KEY = 'lambda-test';
const redisOptions = {
    host: "18.185.37.159",
    port: 3456
}

redis.debug_mode = true;

exports.handler = (event, context, callback) => {
    console.info('Start to connect to Redis Server')
    var client = redis.createClient(redisOptions);
    console.info('Connected to Redis Server')

    console.info('event.pathParameters: ', event.pathParameters);
    console.info('event.httpMethod: ', event.httpMethod);
    let id = (event.pathParameters || {}).product || false;
    let data = event.data;

    /*
    let data = [{ compound1: 'CO',
        result1: '#datatype,string,long,double,double,double,double\r\n#group,false,false,false,false,false,false\r\n#default,_result,,,,,\r\n,result,table,winter,summer,autumn,spring\r\n,,0,1.1649999946,,,\r\n,,0,,0.852142862257143,,\r\n,,0,,,1.8035714251928572,\r\n,,0,,,,0.9292857140285713\r\n\r\n' },
    { compound2: 'PM10',
        result2: '#datatype,string,long,double,double,double,double\r\n#group,false,false,false,false,false,false\r\n#default,_result,,,,,\r\n,result,table,winter,spring,summer,autumn\r\n,,0,38.166666666666664,,,\r\n,,0,,64.59523809523809,,\r\n,,0,,,64.70833333333333,\r\n,,0,,,,69.86904761904763\r\n\r\n' },
    { compound3: 'SO_2',
        result3: '#datatype,string,long,double,double,double,double\r\n#group,false,false,false,false,false,false\r\n#default,_result,,,,,\r\n,result,table,winter,summer,autumn,spring\r\n,,0,14.55,,,\r\n,,0,,9.657142857142858,,\r\n,,0,,,20.05,\r\n,,0,,,,10.32857142857143\r\n\r\n' },
    { compound4: 'NO_2',
        result4: '#datatype,string,long,double,double,double,double\r\n#group,false,false,false,false,false,false\r\n#default,_result,,,,,\r\n,result,table,winter,spring,summer,autumn\r\n,,0,103.0625,,,\r\n,,0,,119.33333333333336,,\r\n,,0,,,117.2440476190476,\r\n,,0,,,,169.97023809523813\r\n\r\n' }
    ];
    */
    switch (event.httpMethod) {

        case "GET":
            if (id) {
                console.info('get by id')
                client.hgetAsync(GLOBAL_KEY, id).then(res => {
                    console.info('Redis responses for get single: ', res);
                    callback(null, {body:  "This is a READ operation on product ID " + id, ret: res});
                    // callback(null, {body: "This is a READ operation on product ID " + id});
                }).catch(err => {
                    console.error("Failed to get single: ", err)
                    callback(null, {statusCode: 500, message: "Failed to get data"});
                }).finally(() => {
                    console.info('Disconnect to Redis');
                    client.quit();
                });

                return;
            } else {
                console.info('get all')
                client.hgetallAsync(GLOBAL_KEY).then(res => {
                    console.info('Redis responses for get all: ', res)
                    callback(null, {body: "This is a LIST operation, return all products", ret: res});
                    // callback(null, {body: "This is a LIST operation, return all products"});
                }).catch(err => {
                    console.error("Failed to post data: ", err)
                    callback(null, {statusCode: 500, message: "Failed to get data"});
                }).finally(() => {
                    console.info('Disconnect to Redis');
                    client.quit();
                });
            }
            break;

        case "POST":
            if (data) {
                console.info('Posting data for [', id, '] with value: ', data);
                client.hmsetAsync(GLOBAL_KEY, id, data).then(res => {
                    console.info('Redis responses for post: ', res)
                    callback(null, {body: "This is a CREATE operation and it's successful", ret: res});
                    // callback(null, {body: "This is a CREATE operation"});
                }).catch(err => {
                    console.error("Failed to post data: ", err)
                    callback(null, {statusCode: 500, message: "Failed to post data"});
                }).finally(() => {
                    console.info('Disconnect to Redis');
                    client.quit();
                });
            }
            else {
                callback(null, {statusCode: 500, message: 'no data is posted'})
            }
            break;

        case "PUT":
            callback(null, {body: "This is an UPDATE operation on product ID " + id});
            break;

        case "DELETE":
            console.info('delete a prod');
            client.delAsync(GLOBAL_KEY).then(res => {
                console.info('Redis responses for get single: ', res);
                callback(null, {body:  "This is a DELETE operation on product ID " + id, ret: res});
                // callback(null, {body: "This is a DELETE operation on product ID " + id});
            }).catch(err => {
                console.error("Failed to delete single: ", err);
                callback(null, {statusCode: 500, message: "Failed to delete data"});
            }).finally(() => {
                console.info('Disconnect to Redis');
                client.quit();
            });

            break;

        default:
            // Send HTTP 501: Not Implemented
            console.log("Error: unsupported HTTP method (" + event.httpMethod + ")");
            callback(null, {statusCode: 501})
    }

}