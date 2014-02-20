var request = require('request');
var crypto = require('crypto');
var querystring = require('querystring');
var util = require('util');
var KEYS = require(__dirname + '/config.js').KEYS;

var API_KEY = KEYS.KRAKEN.KEY;
var API_SECRET = KEYS.KRAKEN.SECRET;
var PATH = '/0/private/Balance';
var URL = 'https://api.kraken.com' + PATH;

function KrakenClient() {
    var self = this;

    var config = {
        key: API_KEY,
        secret: API_SECRET
    };

    function privateMethod(callback) {

        var params = {
            nonce: new Date() * 1000
        };

        var signature = getMessageSignature(PATH, params, params.nonce);

        var headers = {
            'API-Key': config.key,
            'API-Sign': signature
        };

        return rawRequest(URL, headers, params, callback);
    }

    function getMessageSignature(path, request, nonce) {
        var message = querystring.stringify(request);
        var secret = new Buffer(config.secret, 'base64');
        var hash = new crypto.createHash('sha256');
        var hmac = new crypto.createHmac('sha512', secret);

        var hash_digest = hash.update(nonce + message).digest('binary');
        var hmac_digest = hmac.update(path + hash_digest, 'binary').digest('base64');

        return hmac_digest;
    }

    function rawRequest(url, headers, params, callback) {

        var options = {
            url: url,
            method: 'POST',
            headers: headers,
            form: params
        };

        console.log(util.inspect(options));
        request.post(options, function (error, response, body) {
            if (typeof callback === 'function') {
                var data;

                if (error) {
                    throw new Error('Error in server response: ' + JSON.stringify(error));
                }

                try {
                    data = JSON.parse(body);
                }
                catch (e) {
                    throw new Error('Could not understand response from server: ' + body);
                }

                if (data.error && data.error.length) {
                    callback.call(self, data.error, null);
                }
                else {
                    callback.call(self, null, data);
                }
            }
        });

    }

    self.privateMethod = privateMethod;
}

new KrakenClient().privateMethod(function (error, data) {
    if (error) {
        console.log(error);
    }
    else {
        console.log(data.result);
    }
});
