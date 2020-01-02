let redis = require('redis');

function writeOnRedisFn(redisOptions,queryName, result, callback) {

    console.log('Start to connect to Redis Server');
    let client = redis.createClient(redisOptions);
    client.on('connect', function () {
        console.log('Redis client connected');
    });
    client.on('error', function (err) {
        console.log('Something went wrong ' + err);
    });
    client.set(queryName, JSON.stringify(result), redis.print);
    console.log("Redis SET result message: "+ JSON.stringify(result) + "\n");
    client.quit();
    callback(null, result);
}

exports.writeOnRedis = writeOnRedisFn;