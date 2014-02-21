var Crawler = require(__dirname + '/../crawler.js');
var KEYS = require(__dirname + '/../config.js').KEYS;

var dem = new Crawler('http://dem.coin-pool.org/index.php?page=api&action=getuserbalance&api_key=' + KEYS.DEM_COINPOOL, function (body) {

    var balance = body.getuserbalance.data;
    this.logBalance({
            coin: 'DEM',
            confirmed: balance.confirmed,
            unconfirmed: balance.unconfirmed,
            wallet: 'DEM_COINPOOL'
        });

    });

module.exports = dem;
