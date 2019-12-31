let async = require('async');

const msgLibs = require('./libs/responseMessage.js');
const influxQueriesFunctions = require('./queries');
const redisUtils = require('./redisutils');
const influxDbUtils = require('./influxdbutils');

let influxDbAPIOptions = {
    host: process.env.INFLUXURL,
    port: '8086',
    path: '/api/v2/query',
    method: 'POST',
    headers: {
        'Content-Type': 'application/vnd.flux',
        'Accept': 'application/csv'
    }
};

const redisAPIOptions = {
    host: process.env.ELASTICACHEHOST,
    port: 3456
};


function doParallelQuerySeasons(post_options,context,finalCallBack) {
    let compounds = ["CO","PM10","SO_2", "NO_2"];
    let queriesObjects = compounds.map(c => influxQueriesFunctions.createQueryObjectSeason(c));

    function doSingleQuery(post_options,queriesObject,callback) {
        let post_options1 = Object.assign({}, post_options);
        post_options1.body = queriesObject.query;
        let compound = queriesObject.compound;
        console.log("QuerySeasons - Compound "+ compound);
        influxDbUtils.sendQueryToInfluxDb(post_options1, context, (chunk) => {
            //console.log(chunk.toString("utf8"));
            let result = {"compound":compound, "result":chunk};
            console.log("Result query seasons: " +JSON.stringify(result));
            callback(null, result);
        });
    }

    async.series([
        (callback) => {
            doSingleQuery(post_options,queriesObjects[0],callback);
        },
        (callback) => {
            doSingleQuery(post_options,queriesObjects[1],callback);
        },
        (callback) => {
            doSingleQuery(post_options,queriesObjects[2],callback);
        },
        (callback) => {
            doSingleQuery(post_options,queriesObjects[3],callback);
        }
    ], (err, result) => {
        console.log("async.parallel completed with "+ JSON.stringify(result));
        finalCallBack(result);
    });
}

function doParallelQueryHealthProblems(post_options,context,finalCallBack) {

    function doSingleQuery(post_options,queryObject,callback) {
        let clonedPostOptions = Object.assign({}, post_options);
        clonedPostOptions.body = queryObject.query;
        console.log("Query "+ queryObject.problem_description);
        influxDbUtils.sendQueryToInfluxDb(clonedPostOptions, context, (chunk) => {
            //console.log(chunk.toString("utf8"));
            let result = {"problem_description":queryObject.problem_description, "result_query":chunk};
            msgLibs.createSuccessResponse(200,result);
            console.log("Result query health problems: " +JSON.stringify(result));
            callback(null, result);
        });
    }

    async.series([
        (callback) => {
            // query influx for polmonary problems
            let queryObject = influxQueriesFunctions.createQueryPolmonaryProblems();
            doSingleQuery(post_options,queryObject,callback);
        },
        (callback) => {
            // query influx for cancer problems
            let queryObject = influxQueriesFunctions.createQueryCancerProblems();
            doSingleQuery(post_options,queryObject,callback);
        },
        (callback) => {
            // query influx for hearth problems
            let queryObject = influxQueriesFunctions.createQueryHearthProblems();
            doSingleQuery(post_options,queryObject,callback);
        }
    ], (err, result) => {
        console.log("async.series completed with "+ JSON.stringify(result));
        finalCallBack(result);
    });
}

exports.handler = function (event, context, callback) {
    let startTime = Date.now();
    let elapsedTime = undefined;

    async.series([
            (callback) => {
                // which seasons is the most pollution?
                doParallelQuerySeasons(influxDbAPIOptions,context,(influxResult) => {
                    redisUtils.writeOnRedis(redisAPIOptions,"query_seasons_pollution",influxResult, callback);
                });
            },
            (callback) => {
                // which area is the most risky to health?
                doParallelQueryHealthProblems(influxDbAPIOptions,context,(influxResult) => {
                    redisUtils.writeOnRedis(redisAPIOptions,"query_healths_problems",influxResult, callback);
                });
            }
        ], (err,result) => {
        console.log("general async.series completed with "+ JSON.stringify(result));
        if (err) {
            elapsedTime = (Date.now() - startTime)/1000 ;
            console.log("Lambda terminated with error in " + elapsedTime + " seconds.")
            callback(null,msgLibs.createErrorResponse(500,err));

        } else {
            elapsedTime = (Date.now() - startTime)/1000 ;
            console.log("Lambda success completed in " + elapsedTime + " seconds.")
            callback(null,msgLibs.createSuccessResponse(200,result));
        }
    });

};

//handler(null,null, (error,lambdaResponse) => console.log(lambdaResponse));