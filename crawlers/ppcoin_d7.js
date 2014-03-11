var Crawler = require(__dirname + '/../crawler.js');
var KEYS = require(__dirname + '/../config.js').KEYS;

var ppcoin_d7 = new Crawler('https://ppcoin.d7.lt/api.php?api_key=' + KEYS.PPCOIN_D7, function (body) {

    if (!body.user) {
        console.warn('body in unknown format', body);
        return;
    }

    this.logBalance({
        coin: 'PPC',
        confirmed: body.user.balance,
        unconfirmed: body.user.unconfirmed_rewards,
        wallet: 'PPCOIN_D7'
    });

    this.logHashrate({
        coin: 'PPC',
        hashrate: body.user.hashrate,
        pool: 'PPCOIN_D7'
    });

    this.logDifficulty({
        coin: 'PPC',
        difficulty: body.pool.difficulty,
        pool: 'PPCOIN_D7'
    });
});

module.exports = ppcoin_d7;
