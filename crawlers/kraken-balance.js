var crypto = require('crypto');
var Crawler = require(__dirname + '/../crawler.js');
var KEYS = require(__dirname + '/../config.js').KEYS;
var util = require('util');
var querystring = require('querystring');

var API_KEY = KEYS.KRAKEN.KEY;
var API_SECRET = KEYS.KRAKEN.SECRET;

var PATH = '/0/private/Balance';
var URL = 'https://api.kraken.com' + PATH;

function getMessageSignature(path, request, nonce) {
    var message = querystring.stringify(request);
    var secret = new Buffer(API_SECRET, 'base64');
    var hash = new crypto.createHash('sha256');
    var hmac = new crypto.createHmac('sha512', secret);

    var hash_digest = hash.update(nonce + message).digest('binary');
    var hmac_digest = hmac.update(path + hash_digest, 'binary').digest('base64');

    return hmac_digest;
}

var data = {};

var kraken = new Crawler(URL, function (body) {
    this.logBalance({
        coin: 'LTC',
        confirmed: body.result.XLTC,
        wallet: 'KRAKEN'
    });
}, {
    headers: function () {
        data.nonce = new Date() * 1000;
        var sig = getMessageSignature(PATH, data, data.nonce);
        return {
            'API-Key': API_KEY,
            'API-Sign': sig
        };
    },
    http: {
        method: 'POST',
        form: data // passed as reference, will be updated by headers()
    }
});

module.exports = kraken;
