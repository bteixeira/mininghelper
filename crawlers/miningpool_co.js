var Crawler = require(__dirname + '/../crawler.js');
var KEYS = require(__dirname + '/../config.js').KEYS;

var mininpool_co = new Crawler('https://www.miningpool.co/api/balances?key=' + KEYS.MININGPOOL_CO, function (body) {

    var me = this;

    body.return.forEach(function (coin) {
        me.logBalance({
            coin: coin.short_code,
            confirmed: coin.balance || 0,
            unconfirmed: coin.pending_balance,
            wallet: 'MININGPOOL_CO'
        });
        me.logHashrate({
            coin: coin.short_code,
            hashrate: coin.hashrate || 0,
            pool: 'MININGPOOL_CO'
        });
    });
}, {
    http: {rejectUnauthorized: false}
});

module.exports = mininpool_co;
