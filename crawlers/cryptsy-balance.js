var crypto = require('crypto');
var Crawler = require(__dirname + '/../crawler.js');
var KEYS = require(__dirname + '/../config.js').KEYS;
var util = require('util');
var querystring = require('querystring');
var _ = require('underscore');

var API_KEY = KEYS.CRYPTSY.KEY;
var API_SECRET = KEYS.CRYPTSY.SECRET;

var URL = 'https://www.cryptsy.com/api';

function getMessageSignature(request) {
    var message = querystring.stringify(request);
    http.body = message;
    console.log(message);
    var hmac = new crypto.createHmac('sha512', API_SECRET);
    var hmac_digest = hmac.update(message).digest('hex');

    return hmac_digest;
}

var data = {
    method: 'getinfo'
};

var http = {
    method: 'POST'
};

var cryptsy = new Crawler(URL, function (body) {
    var me = this;
//    console.log(util.inspect(body.return.balances_available));
    _.each(body.return.balances_available, function (v, k) {
        if (k === 'POINTS') {
            return;
        }
        me.logBalance({
            coin: k,
            confirmed: v,
            wallet: 'CRYPTSY'
        });
    });
}, {
    headers: function () {
        data.nonce = new Date() * 1000;
        var sig = getMessageSignature(data);
        return {
            'Key': API_KEY,
            'Sign': sig,
            "Content-type": "application/x-www-form-urlencoded"
        };
    },
    http: http
});

module.exports = cryptsy;

//cryptsy.start();
