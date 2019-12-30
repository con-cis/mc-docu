var page = new WebPage()
var fs = require('fs');

page.onLoadFinished = function() {
  setTimeout(function() {
	  console.log("page load finished");
	  fs.write('xpathie.html', page.content, 'w');
	  phantom.exit();
  }, 2000); //added timeout for executing the JS in the xphath.html
};

page.open("http://YOURPAGE.URL/xpath.html", function() {
  page.evaluate(function() {});
});
