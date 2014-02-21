var Crawler = require(__dirname + '/../crawler.js');
var KEYS = require(__dirname + '/../config.js').KEYS;

var osc = new Crawler('http://osc.dsync.net/index.php?page=api&action=getuserstatus&api_key=' + KEYS.OSC_DSYNC, function (body) {

    var balance = body.getuserstatus.getuserbalance;
    this.logBalance({
            coin: 'OSC',
            confirmed: balance.confirmed,
            unconfirmed: balance.unconfirmed,
            wallet: 'OSC_DSYNC'
        });

    });

module.exports = osc;
