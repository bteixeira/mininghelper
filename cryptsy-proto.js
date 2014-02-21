var crypto = require('crypto');
var querystring = require('querystring');
var request = require('request');

var KEYS = require(__dirname + '/config.js').KEYS;
var API_KEY = KEYS.CRYPTSY.KEY;
var API_SECRET = KEYS.CRYPTSY.SECRET;

var Cryptsy = function() {};

var URL = 'https://www.cryptsy.com/api';

Cryptsy.prototype.getSignatureFromString = function(str) {
    var hmac = new crypto.createHmac('sha512', API_SECRET);
    hmac.update(str);
    return hmac.digest('hex');
};

Cryptsy.prototype.postRequest = function(params, callback) {
    var options = {
        url: URL,
        method: 'POST',
        form: params,
        headers: {
            'Sign': this.getSignatureFromString(querystring.stringify(params)),
            'Key': API_KEY,
            'User-Agent': this.userAgent
        }
    };

    request.post(options, function (err, response, body) {
        this.parseResponse(err, response, body, callback);
    }.bind(this));
};

Cryptsy.prototype.parseResponse = function(err, response, body, callback) {
    if (err) {
        callback(new Error('Error in server response: ' + JSON.stringify(err)), null);
    } else {
        if (typeof callback === 'function') {
            var data = null;
            var err = null;
            try {
                data = JSON.parse(body);
            } catch(e) {
                err = new Error('Error parsing JSON: ' + body);
            }
            if (err) {
                callback(err, data);
            } else {
                if (data && !!(data.success|0) && data.return) {
                    callback(err, data.return);
                } else {
                    if (data && data.error) {
                        err = new Error(data.error);
                    } else {
                        err = new Error('Unknown error');
                    }
                    callback(err, null);
                }
            }
        }
    }
};

var cryptsy = new Cryptsy(API_KEY, API_SECRET);

var params = {};
params.method = 'getinfo';
params.nonce = new Date().getTime();

cryptsy.postRequest(params, function (err, data) {
    if (err) {
        throw err;
    } else {
        console.log(data);
    }
});
