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
	var that = this;

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
		try {
			var th = this;
			if(!this.doc) {
				console.log("Page error: " + this.uri);
				return;
			}
			console.log("Page recieved: " + this.doc.length);

			jsdom.env({
				html: th.doc,
				src: [jquery],
				done: that.parseLinks,
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
			var th = this;
			var $ = window.$;
			
			$('a').each(function(l) {
				var l = $(this).attr('href');
				if(!l) {
					return true; // continue
				}
				that.linksOut.push(url.resolve(that.uri, l));
			})
			.promise().done(that.processLinks);
		}
		catch(e) {
			// nothing
		}
	}

	/**
	 * Processes links after they've been parsed out.
	 */
	this.processLinks = function() {
		if(!that.isOnDomain('spsu.edu')) {
			return;
		}
		//console.log(that.uri.substr(6,26) 
		//		+ "\t>> LINKS: " + that.linksOut.length);

		for(var i in that.linksOut) {
			var u = that.linksOut[i];
			var p = null;
			if(!(u in DB)) {
				p = new Page(u);
				DB[u] = p;
				RQ.push(new QueueItem(u, 0));
			}
			else {
				p = DB[u];
				p.linksIn.push(that.uri);
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

/**
 * Queue items that need processing
 */
var QueueItem = function(uri, depth) {
	this.uri = uri;
	this.depth = depth;
}

var processQueue = function() {
	while(RQ.length) {
		var item = RQ.shift();
		//console.log("* Processing item");
		if(item.uri in DB && DB[item.uri].fetched) {
			continue;
		}
		var p = new Page(item.uri);
		p.fetch();
	}
}

var main = function() 
{
	//console.log(RQ);

	RQ.push(new QueueItem('http://spsu.edu', 0));
	processQueue();
}

main();
