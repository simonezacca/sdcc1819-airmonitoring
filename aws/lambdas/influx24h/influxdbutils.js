let http = require('http');

function sendQueryToInfluxDbFn(post_options, context, cb) {

    // Set up the request
    let post_req = http.request(post_options, function (res) {
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

exports.sendQueryToInfluxDb = sendQueryToInfluxDbFn;