//Invoking HTTP GET or POST request in nodejs from AWS lambda
var http = require('http');
var async = require('async');
var redis = require('redis');
var bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const msgLibs = require('./libs/responseMessage.js');
const GLOBAL_KEY = 'lambda-test';
var compounds = ["CO","PM10","SO_2", "NO_2"];


const redisOptions = {
    host: "18.185.37.159",
    port: 3456
}

redis.debug_mode = true;


function writeOnRedis(event, queryName, result, callback) {

    console.info('Start to connect to Redis Server');
    var client = redis.createClient(redisOptions);
    console.info('Connected to Redis Server');
    let id = queryName;
    console.log("httpMethod: " + event.httpMethod)
    if(event.httpMethod === "POST"){
        if(result){
            console.info('Posting data for [', id, '] with value: ', result);
            client.hmsetAsync(GLOBAL_KEY, id, result).then(res => {
                console.info('Redis responses for post: ', res);
                callback(null, {body: "This is a CREATE operation and it's successful", ret: res});
                // callback(null, {body: "This is a CREATE operation"});
            }).catch(err => {
                console.error("Failed to post data: ", err);
                callback(null, {statusCode: 500, message: "Failed to post data"});
            }).finally(() => {
                console.info('Disconnect to Redis');
                client.quit();
            });
        }
    }
    else {
        callback(null, {statusCode: 500, message: 'no data is posted'})
    }
    /*
    else{
        // Send HTTP 501: Not Implemented
        console.log("Error: unsupported HTTP method (" + event.httpMethod + ")");
        callback(null, {statusCode: 501})
    }*/

}

function query1(post_options, context, cb) {

    // Set up the request
    var post_req = http.request(post_options, function (res) {
        //console.log("post_options "+ JSON.stringify(post_options));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
            cb(chunk);
            //context.succeed();
        });
        res.on('error', function (e) {
            console.log("Got error: " + e.message);
            //context.done(null, 'FAILURE');
        });
    });
    post_req.write(post_options.body);
    post_req.end();
}

function createQueryObject(compound){

    var q = "getMeanForSeason = (year,endYear, interval = 1w) => {\n" +
        " \n" +
        "  SPS = time(v: (year + \"-03-21\"))\n" +
        "  SPE = time(v: (year + \"-06-21\"))\n" +
        "  SUS = time(v: (year + \"-06-22\"))\n" +
        "  SUE = time(v: (year + \"-09-22\"))\n" +
        "  AS = time(v: (year + \"-09-23\"))\n" +
        "  AE = time(v: (year + \"-12-22\"))\n" +
        "  WS = time(v: (year + \"-12-23\"))\n" +
        "  WE = time(v: (endYear + \"-03-20\"))\n" +
        "  \n" +
        "  \t\t\n" +
        "  spring = from(bucket: \"measure2/autogen\")\n" +
        "    |> range(start: SPS, stop:  SPE)\n" +
        "    |> filter(fn:(r) =>\n" +
        "      r._measurement == \"air_monitoring\" and \n" +
        "      r._field == \""+compound+"\"\n" +
        "    )\n" +
        "    |> aggregateWindow(every: interval, fn: max)\n" +
        "    |> mean()\n" +
        "\t|> group(columns: [\"_time\"])\n" +
        "    |>mean()\n" +
        "    |> rename(columns: {_value: \"spring\"})\n" +
        "\n" +
        "  summer = from(bucket:\"measure2/autogen\")\n" +
        "    |> range(start: SUS, stop: SUE)\n" +
        "    |> filter(fn:(r) =>\n" +
        "      r._measurement == \"air_monitoring\" and \n" +
        "      r._field == \""+compound+"\"\n" +
        "    )\n" +
        "    |> aggregateWindow(every: interval, fn: max)\n" +
        "    |> mean()\n" +
        "    |> group(columns: [\"_time\"])\n" +
        "    |>mean()\n" +
        "    |> rename(columns: {_value: \"summer\"})\n" +
        "\n" +
        "  autumn = from(bucket:\"measure2/autogen\")\n" +
        "    |> range(start: AS, stop: AE)\n" +
        "    |> filter(fn:(r) =>\n" +
        "      r._measurement == \"air_monitoring\" and \n" +
        "      r._field == \""+compound+"\"\n" +
        "    )\n" +
        "    |> aggregateWindow(every: interval, fn: max)\n" +
        "    |> mean()\n" +
        "    |> group(columns: [\"_time\"])\n" +
        "    |>mean()\n" +
        "    |> rename(columns: {_value: \"autumn\"})\n" +
        "\n" +
        "  winter = from(bucket:\"measure2/autogen\")\n" +
        "    |> range(start: WS, stop: WE)\n" +
        "    |> filter(fn:(r) =>\n" +
        "      r._measurement == \"air_monitoring\" and \n" +
        "      r._field == \""+compound+"\"\n" +
        "    )\n" +
        "    |> aggregateWindow(every: interval, fn: max)\n" +
        "    |> mean()\n" +
        "    |> group(columns: [\"_time\"])\n" +
        "\t|> mean()\n" +
        "    |> rename(columns: {_value: \"winter\"})\n" +
        "\n" +
        "  \treturn union(tables: [spring,summer,autumn,winter])\n" +
        "    \n" +
        "}\n\n" +
        "getMeanForSeason(year:\"2017\",endYear:\"2018\")";

    return {
        "compound" : compound,
        "query" : q
    }

}

exports.handler = function (event, context, callback) {
    // An object of options to indicate where to post to
    var post_options = {
        host: process.env.INFLUXURL,
        //host: "18.194.247.68",
        port: '8086',
        path: '/api/v2/query',
        method: 'POST',
        headers: {
            'Content-Type': 'application/vnd.flux',
            'accept': 'application/csv'
        }
    };

    var queriesObjects = compounds.map(c => createQueryObject(c));

    /*
    var responses = queriesObjects.map((s) => {

        post_options.body = s.query;
        query1(post_options,context, (chunk) => {
            console.log(chunk);
            return {"compound":s.compound, "result":chunk}}
        )
    });
    */

    async.parallel([
        function(callback) {
            var post_options1 = Object.assign({}, post_options);
            post_options1.body = queriesObjects[0].query;
            var compound = queriesObjects[0].compound;
            console.log("Query1 - 1 Compound");
            query1(post_options1, context, (chunk) => {
                console.log(chunk.toString("utf8"));
                var result = {"compound1":compound, "result1":chunk};
                msgLibs.createSuccessResponse(200,result);
                console.log("result in cb:" +JSON.stringify(result));
                callback(null, result);
            });
        },
        function(callback) {
            var post_options2 = Object.assign({}, post_options);
            post_options2.body = queriesObjects[1].query;
            var compound = queriesObjects[1].compound;
            console.log("Query1 - 2 Compound");
            query1(post_options2, context, (chunk) => {
                console.log(chunk);
                var result = {"compound2": compound, "result2":chunk};
                msgLibs.createSuccessResponse(200,result);
                callback(null, result);
            });
        },
        function(callback) {
            var post_options3 = Object.assign({}, post_options);
            post_options3.body = queriesObjects[2].query;
            var compound = queriesObjects[2].compound;
            console.log("Query1 - 3 Compound");
            query1(post_options3, context, (chunk) => {
                console.log(chunk);
                var result = {"compound3": compound, "result3":chunk};
                msgLibs.createSuccessResponse(200,result);
                callback(null, result);
            });
        },
        function(callback) {
            var post_options4 = Object.assign({}, post_options);
            post_options4.body = queriesObjects[3].query;
            var compound = queriesObjects[3].compound;
            console.log("Query1 - 4 Compound");
            query1(post_options4, context, (chunk) => {
                console.log(chunk);
                var result = {"compound4": compound, "result4":chunk};
                msgLibs.createSuccessResponse(200,result);
                callback(null, result);
            });
        }
    ], function(err, result) {
        // optional callback
        console.log("async.parallel completed with "+ JSON.stringify(result));
        writeOnRedis(event,"query_1",result, callback);
    });
};