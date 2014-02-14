var https = require('https');

var options = {
    hostname: 'www.miningpool.co',
    port: 443,
    path: '/api/balances?key=1b487e3de60f68b6e29c9270959fbb2ff2870ba0',
    method: 'GET',
    rejectUnauthorized: false
};

var req = https.request(options, function(res) {
    console.log("statusCode: ", res.statusCode);
    console.log("headers: ", res.headers);

    res.on('data', function(d) {
        process.stdout.write(d);
    });
});
req.end();

req.on('error', function(e) {
    console.error(e);
});
