var webPage = require('webpage')
var page = webPage.create()

page.onConsoleMessage = function(msg, lineNum, sourceId) {
  console.log(msg)
};

file:///C://Full/Path/To/test.html
page.open('test/browser-test/pngitxt-test.html', function(status) {
  // do nothing?
  console.log("Made it", status)
  page.close()
  phantom.exit()
});
