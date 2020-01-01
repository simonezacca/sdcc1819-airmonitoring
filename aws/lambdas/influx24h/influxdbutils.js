let http = require('http');

function sendQueryToInfluxDbFn(post_options, context, cb) {
    let responseBody = '';
    // Set up the request
    let post_req = http.request(post_options, function (res) {
        //console.log("post_options "+ JSON.stringify(post_options));
        console.log(`statusCode: ${res.statusCode}`)
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
            responseBody += chunk;
            //context.succeed();
        });
        res.on('error', function (e) {
            console.log("Got error: " + e.message);
            //context.done(null, 'FAILURE');
        });
        res.on('end', function() {
            cb(responseBody);
        });
    });
    post_req.write(post_options.body);
    post_req.end();
}

exports.sendQueryToInfluxDb = sendQueryToInfluxDbFn;