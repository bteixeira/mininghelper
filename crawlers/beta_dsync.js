var Crawler = require(__dirname + '/../crawler.js');
var KEYS = require(__dirname + '/../config.js').KEYS;

var beta = new Crawler('http://beta.dsync.net/index.php?page=api&action=getuserbalance&api_key=' + KEYS.BETA_DSYNC, function (body) {

        this.logBalance({
            coin: 'BET',
            confirmed: body.getuserbalance.data.confirmed,
            unconfirmed: body.getuserbalance.data.unconfirmed,
            wallet: 'BETA_DSYNC'
        });

    });

module.exports = beta;
