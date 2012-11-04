STATUS
======
* Brandon has to study for tomorrow's Analytical exam.
	* Analytical is 5 credit hours
	* Tomorrow's exam covers 6 chapters of chemical 
	  equilibria systems
	* If I make significant progress tonight, I'll work
	  on our project a bit more

* Yes, Brandon will finish this, but it's _not_ an 
  immediate priority anymore.

* The website interface is super easy &mdash; mostly a 
  copy/paste from the last project with some messy exec() 
  calls and some minor database queries.

* The node.js (NJS) spider is having lots of issues because I 
  didn't keep the 'this' scope clean. 
  	* Considering tearing it down and using a different 
	  class approach (Crockford's).
	* Took me awhile to get comfortable writing all nonblocking IO
	  as it's not 'classical' programming

* If you want to test something, I'll just run the 'forager'
  I developed for g3. 
  	* You can't take screenshots of it, because it will be 
	  different. 
	* It doesn't have start/stop/pause. This one will once
	  I sort out the NJS issues.

Libraries/etc used for PHP website
----------------------------------
* [PHP](http://php.net) &mdash;
	used for the backend
* [SqLite](http://www.sqlite.org/) &mdash;
	represents and retains the backend model
* [Javascript](https://developer.mozilla.org/en-US/docs/JavaScript) &mdash;
	used for the UI 
* [Fat-Free Framework (F3)](http://bcosca.github.com/fatfree/) &mdash; 
	a PHP microframework that provides MVC and other 
	functionality in a very lightweight package.
* [Smarty template engine](http://www.smarty.net) &mdash;
	a PHP template system that separates business logic
	from presentational logic 
* [jQuery](http://jquery.org/) &mdash;
	Javascript DOM scripting and more
* [Twitter Bootstrap](http://twitter.github.com/bootstrap/) &mdash;
	semantic, fluid, modern HTML layouts
* [Apache2](http://httpd.apache.org/) &mdash; development server 

Libraries used for Node.js webcrawler
-------------------------------------
* jsdom (npm package) &mdash; for parsing the dom and 
	extracting the links
* underscore.js &mdash; functional closures 
* jquery

