var crypto = require('crypto');
var Crawler = require(__dirname + '/../crawler.js');
var KEYS = require(__dirname + '/../config.js').KEYS;
var util = require('util');

var API_KEY = KEYS.COINBASE.KEY;
var API_SECRET = KEYS.COINBASE.SECRET;

var URL = 'https://coinbase.com/api/v1/account/balance';

var coinbase = new Crawler(URL, function (body) {
    if (!body.currency || !body.amount) {
        console.warn(URL, 'data in unexpected format', util.inspect(body));
        return;
    }
    this.logBalance({
        coin: body.currency.toUpperCase(),
        confirmed: body.amount,
        wallet: 'COINBASE'
    });
}, {
    headers: function () {
        var nonce = new Date().getTime();
        var message = '' + nonce + URL;
        var hmac = crypto.createHmac('sha256', API_SECRET);
        var sig = hmac.update(message).digest('hex');
        return {
            ACCESS_KEY: API_KEY,
            ACCESS_SIGNATURE: sig,
            ACCESS_NONCE: nonce
        };
    }
});

module.exports = coinbase;
