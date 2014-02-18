var _ = require('underscore');
var request = require('request');
var db = require('mongojs').connect('mininghelper', ['balances', 'exchange_rates']);

var TIMEOUT = 60 * 1000;

var Crawler = function (url, handler, opts) {

	var me = this;
	var id;
	var active = false;
    opts = opts || {};
	opts.interval = opts.interval || TIMEOUT;
    opts.headers = opts.headers || function () {
        return {};
    };

	function fetch () {
        var headers = _.extend({}, opts.headers());
        var params = _.extend({
            url: url,
            json: true,
            headers: headers
        }, opts.http);
		request(params, function (err, response, body) {
				if (!active) {
					return;
				}
				if (err) {
					console.log('ERROR', url, err);
				}
				else if (response.statusCode !== 200) {
					console.warn('warning, status code is ' + response.statusCode + ', url=' + url);
					console.warn(body);
				} else {
					console.log('new data from ' + url);
				}
				if (body) {
					handler.call(me, body);
				} else {
					console.warn('no data received');
				}
				id = setTimeout(fetch, opts.interval);
			}
		);
	}
	
	me.start = function () {
		if (!active) {
			active = true;
			fetch();
		}
	};
	
	me.stop = function () {
		if (active) {
			active = false;
		}
		if (id) {
			cancelTimeout(id);
		}
	};
	
	me.setInterval = function (interval) {
        opts.interval = interval;
	};
	
	me.logBalance = function (data) {
		data.time = data.time || new Date().getTime();
		db.balances.save(data);
	};
	
	me.logHashrate = function (data) {
		// DO ME
	};

	me.logDifficulty = function (data) {
		// DO ME
	};

	me.logExchangeRate = function (data) {
		data.time = data.time || new Date().getTime();
//        console.log('logging x-rate', data.exchange, data.buy, data.from, data.rate);
		db.exchange_rates.save(data);
	};

};

module.exports = Crawler;
