var Crawler = require(__dirname + '/../crawler.js');
var KEYS = require(__dirname + '/../config.js').KEYS;

var bcx = new Crawler('http://bcx.minebig.com/index.php?page=api&action=getuserbalance&api_key=' + KEYS.BCX_MINEBIG, function (body) {

        this.logBalance({
            coin: 'BCX',
            confirmed: body.getuserbalance.data.confirmed,
            unconfirmed: body.getuserbalance.data.unconfirmed,
            wallet: 'BCX_MINEBIG'
        });

    });

module.exports = bcx;
