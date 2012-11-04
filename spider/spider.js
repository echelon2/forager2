// Core libs
var fs = require("fs");
var http = require('http');
var url = require("url");
var jsdom = require("jsdom"); // npm module

// Local libs
var _ = require('./underscore');
var jquery = fs.readFileSync("./jquery.js").toString();

/**
 * Map of UrlString -> PageObject
 */
var DB = {};

/**
 * Request Queue 
 */
var RQ = [];

/**
 * Page class
 */
var Page = function(uri) 
{
	this.uri = uri;
	this.uriP = null; // cached parsed URL
	this.doc = '';
	this.headers = {};
	this.status = 0;
	this.request = null;
	this.fetched = false;

	// Links parsed
	this.linksOut = [];
	this.linksIn = [];

	/**
	 * If URL is on the hostname specified.
	 */
	this.isOnDomain = function(domain) {
		if(!this.uriP || !this.uriP.hostname) {
			return false;
		}
		return !!this.uriP.hostname.match(domain);
	}

	/**
	 * If page is available.
	 */
	this.isOnline = function() {
		return (this.status == 200);
	}
	
	/**
	 * The page is delivered as a stream.
	 */
	this.processChunk = function(chunk) {
		_this.doc += chunk;
	}

	/**
	 * Finalizes the stream.
	 * Constructs and processes the DOM. 
	 */
	this.endPage = function() {
		try {
			if(!_this.doc) {
				console.log("Page error: " + _this.uri);
				return;
			}
			console.log("Recieved: " + _this.doc.length);

			jsdom.env({
				html: _this.doc,
				src: [jquery],
				done: _this.parseLinks,
			});
		}
		catch(e) {
			// nothing
		}
	}

	/**
	 * Parses out anchor tags from the DOM.
	 */
	this.parseLinks = function(err, window) {
		try {
			var $ = window.$;
			
			$('a').each(function(l) {
				var l = $(this).attr('href');
				if(!l) {
					return true; // continue
				}
				var ll = url.parse(l); // FIXME: Doing twice
				if(ll.protocol != 'http:') { // TODO: https
					return true; // continue;
				}
				_this.linksOut.push(url.resolve(_this.uri, l));
			})
			.promise().done(_this.processLinks);
		}
		catch(e) {
			console.log("EXCEPTION: parseLinks");
		}
	}

	/**
	 * Processes links after they've been parsed out.
	 */
	this.processLinks = function() {
		if(!_this.isOnDomain('spsu.edu')) {
			return;
		}

		for(var i in _this.linksOut) {
			var u = _this.linksOut[i];
			var p = null;
			if(!(u in DB)) {
				p = new Page(u);
				DB[u] = p;
				RQ.push(new QueueItem(u, 0));
			}
			else {
				p = DB[u];
				p.linksIn.push(_this.uri);
			}
		}

		processQueue();
	}

	/**
	 * Perform the document fetch.
	 */
	this.fetch = function() {
		//console.log("Sending request for " 
		//		+ this.uriP.hostname);
		this.fetched = true;
		this.request.end();
	}

	/**
	 * CTOR.
	 */
	var u = url.parse(this.uri);
	this.uriP = url.parse(this.uri);

	var ops = {
		hostname: u.hostname,
		method: 'GET',
		path: u.path,
	};

	var _this = this;

	this.request = http.request(ops, function(res) {
		_this.headers = JSON.stringify(res.headers);
		_this.status = res.statusCode;
		res.setEncoding('utf8');
		res.on('data', _this.processChunk);
		res.on('end', _this.endPage);
	});

	this.request.on('error', function(e) {
		// Typically a connection error.
		_this.status = -100;
	});
}

/**
 * Queue items that need processing
 */
var QueueItem = function(uri, depth) {
	this.uri = uri;
	this.depth = depth;
}

/**
 * Proceses any queue items
 */
var processQueue = function() {
	while(RQ.length) {
		var item = RQ.shift();
		if(item.uri in DB && DB[item.uri].fetched) {
			continue;
		}
		var p = new Page(item.uri);
		p.fetch();
	}
}

/**
 * Prints reports on the database.
 */
var reportStats = function() {
	var i = 0;
	for(var x in DB) {
		i++;
	}

	console.log("=====================");
	console.log("DB size:\t" + i);
	console.log("RQ size:\t" + RQ.length);
	console.log("=====================");
}

/**
 * Prints every entry in the database
 */
var reportFull = function() {
	i = 0;
	for(var x in DB) {
		var p = DB[x];
		console.log(i + ") " 
				+ x.substr(7, 40) 
				+ "  "
				+ p.status
		);
		i++;
	}
}

var main = function() 
{
	RQ.push(new QueueItem('http://spsu.edu', 0));
	processQueue();

	setInterval(reportStats, 10*1000);
	setInterval(reportFull, 6*1000);
}

main();
