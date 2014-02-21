var Crawler = require(__dirname + '/../crawler.js');
var util = require('util');
var _ = require('underscore');

var coinex = new Crawler('https://coinex.pw/api/v2/trade_pairs', function (body) {

    var me = this;

//    console.log(util.inspect(body.return.markets['UNO/BTC'].buyorders[0]));

    if (!body || !body.trade_pairs) {
        return;
    }

    _.each(body.trade_pairs, function (v, k) {
        var coins = v.url_slug.split('_');
        var rate = {
            buy: coins[0].toUpperCase(),
            from: coins[1].toUpperCase(),
            rate: v.last_price / 1000 / 1000 / 100,
            exchange: 'COINEX'
        };
//        console.log(util.inspect(rate));
        me.logExchangeRate(rate);
    });

}, {
    headers: function () {
        return {
            cookie: '__cfduid=dd461db7a2423f5fc8aec3a2b1e2303121392914592989; cf_clearance=86a7d8f4525bae30b6237352c2febef98305a2ac-1392914598-3600'
        };
    },
    interval: 10 * 60 * 1000
});

module.exports = coinex;

//coinex.start();
