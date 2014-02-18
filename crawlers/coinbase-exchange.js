var Crawler = require(__dirname + '/../crawler.js');
var _ = require('underscore');

var ALLOWED = {
    usd: true,
    eur: true,
    btc: true
};

var bitminter = new Crawler('https://coinbase.com/api/v1/currencies/exchange_rates', function (body) {

    var me = this;

    _.each(body, function (v, k) {
        var coins = k.split('_to_');
        if (ALLOWED[coins[0]] && ALLOWED[coins[1]]) {
            console.log('coinbase xchange', coins[0], coins[1], v);
            me.logExchangeRate({
                buy: coins[0].toUpperCase(),
                from: coins[1].toUpperCase(),
                rate: v,
                exchange: 'COINBASE'
            });
        }
    });

});

module.exports = bitminter;
