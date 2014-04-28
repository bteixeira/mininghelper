var Crawler = require(__dirname + '/../crawler.js');

var mininpool_co = new Crawler('https://www.miningpool.co/api/currencies', function (body) {

    var me = this;

    body.return.forEach(function (coin) {
        var data = {
            coin: coin.short_code,
            diff: coin.network_difficulty,
            source: 'MININGPOOL_CO'
        };
//        console.log(data);
        me.logDifficulty(data);
    });
}, {
    http: {rejectUnauthorized: false},
    interval: 15 * 1000
});

module.exports = mininpool_co;
