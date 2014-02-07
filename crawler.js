var request = require('request');
var db = require('mongojs').connect('mininghelper', ['balances']);

var TIMEOUT = 60 * 1000;

var Crawler = function (url, handler, interval) {

	var me = this;
	var id;
	var active = false;
	interval = interval || TIMEOUT;

	function fetch () {
		request({
				url: url,
				json: true
			}, function (err, response, body) {
				if (!active) {
					return;
				}
				if (err) {
					throw err;
				}
				if (response.statusCode !== 200) {
					console.warn('warning, status code is ' + response.statusCode);
				}
				if (body) {
					handler.call(me, body);
				} else {
					console.warn('no data received');
				}
				id = setTimeout(fetch, interval);
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
	
	me.setInterval = function (_interval) {
		interval = _interval;
	};
	
	me.logBalance = function (data) {
		data.time = data.time || new Date().getTime();
		db.balances.save(data);
	};
	
	me.logHashrate = function () {
		// DO ME
	};

};

module.exports = Crawler;
