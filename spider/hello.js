// Core libs
var fs = require("fs");
var http = require('http');
var url = require("url");
var jsdom = require("jsdom"); // npm module

// Local libs
var _ = require('./underscore');
var jquery = fs.readFileSync("./jquery.js").toString();

/**
 * Page class
 */
var Page = function(uri) 
{
	var that = this;

	this.uri = uri;
	this.doc = '';
	this.headers = {};
	this.status = 0;
	this.request = null;

	/**
	 * The page is delivered as a stream.
	 */
	this.processChunk = function(chunk) {
		this.doc += chunk;
	}

	/**
	 * Finalizes the stream.
	 * Constructs and processes the DOM. 
	 */
	this.endPage = function() {
		var that = this;
		console.log("Page recieved: " + this.doc.length);

		jsdom.env({
			html: that.doc,
			src: [jquery],
			done: function (errors, window) {
				var $ = window.$;
				$('a').each(function(l) {
					var h = $(this).attr('href');
					if(!h) {
						return;
					}
					h = url.resolve(uri, h);
					console.log(h);
				});
			}
		});
	}

	/**
	 * Perform the document fetch.
	 */
	this.fetch = function() {
		console.log("Sending request for " + this.uri);
		this.request.end();
	}

	/**
	 * CTOR.
	 */
	var u = url.parse(this.uri);

	var ops = {
		hostname: u.hostname,
		method: 'GET',
		path: u.path,
	};

	this.request = http.request(ops, function(res) {
		that.headers = JSON.stringify(res.headers);
		that.status = res.statusCode;
		res.setEncoding('utf8');
		res.on('data', that.processChunk);
		res.on('end', that.endPage);
	});

	this.request.on('error', function(e) {
		// TODO
	});

}

uris = [
	'http://spsu.edu',
	//'http://spsu.edu/index.html',
	//'http://reddit.com',
]


_.each(uris, function(u) {
	var p = new Page(u);
	p.fetch();
});

