var Crawler = require(__dirname + '/../crawler.js');
var util = require('util');
var _ = require('underscore');

var cryptsy = new Crawler('http://pubapi.cryptsy.com/api.php?method=marketdatav2', function (body) {

    var me = this;

//    console.log(util.inspect(body.return.markets['UNO/BTC'].buyorders[0]));

    if (!body || !body.return) {
        return;
    }

    _.each(body.return.markets, function (v, k) {
        var coins = k.split('/');
        var order = v.buyorders[0];
        var rate = {
            buy: coins[0],
            from: coins[1],
            rate: order.price,
            exchange: 'CRYPTSY'
        };
//        console.log(util.inspect(rate));
        me.logExchangeRate(rate);
    });

});

module.exports = cryptsy;
