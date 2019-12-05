'use strict';
var AWS = require('aws-sdk');

//var dynamoDB = new AWS.DynamoDB();

exports.handler = function(event, context, callback){
    console.log("test lambda result: " + event.Records[0].body);

};