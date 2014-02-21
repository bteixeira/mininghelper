//var crypto = require('crypto');
//var KEYS = require(__dirname + '/../config.js').KEYS;
//var util = require('util');
//var request = require('request');
//
//var API_KEY = KEYS.COINBASE.KEY;
//var API_SECRET = KEYS.COINBASE.SECRET;
//
//function get_http (url) {
////    opener = urllib2.build_opener()
//    var nonce = new Date().getTime();
//    var message = '' + nonce + url;
//    var hmac = crypto.createHmac('sha256', API_SECRET);
//    var sig = hmac.update(message).digest('hex');
//    opener.addheaders = [('ACCESS_KEY', API_KEY),
//        ('ACCESS_SIGNATURE', signature),
//        ('ACCESS_NONCE', nonce)]
//    request()
//}
//
//print get_http('https://coinbase.com/api/v1/account/balance').read()
