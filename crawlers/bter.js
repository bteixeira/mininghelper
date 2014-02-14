var Crawler = require(__dirname + '/../crawler.js');
var _ = require('underscore');

var bter = new Crawler('http://data.bter.com/api/1/tickers', function (body) {

    var me = this;
    _.each(body, function (v, k) {
        k = k.split('_');
        me.logExchangeRate({
            buy: k[0].toUpperCase(),
            from: k[1].toUpperCase(),
            rate: v.avg,
            exchange: 'BTER'
        });
    });

});

/*
// THIS WILL BE USEFUL SOMEDAY

function getBterUrl(buy, from) {
    return 'http://data.bter.com/api/1/ticker/' + buy.toLowerCase() + '_' + from.toLowerCase();
}
var pairs = [
    {buy: 'PPC', from: 'BTC'},
    {buy: 'ZET', from: 'BTC'},
    {buy: 'FRC', from: 'BTC'},
    //{buy: 'FRC', from: 'LTC'},
    {buy: 'NMC', from: 'BTC'},
    //{buy: 'NMC', from: 'LTC'}
    {buy: 'DOGE', from: 'BTC'},
    {buy: 'BTB', from: 'BTC'}
];

var crawlers = [];
pairs.forEach(function (v) {
    var buy = v.buy;
    var from = v.from;
    crawlers.push(new Crawler(getBterUrl(buy, from), function (body) {
        this.logExchangeRate({
            buy: buy,
            from: from,
            rate: body.avg,
            exchange: 'BTER'
        });
    }));
});

var aggregate = new Crawler();
_.each(aggregate, function (v, k) {
    if (_.isFunction(v)) {
        aggregate[k] = function () {
            var args = arguments;
            _.each(crawlers, function (crawler) {
                crawler[k].apply(crawler, args);
            });
        };
    }
});

module.exports = aggregate;
*/

module.exports = bter;
