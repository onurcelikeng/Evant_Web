var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser');

var compression = require('compression');
var fs = require('fs');

app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(compression());

var routes = require('./api/routes/accountRoute');
routes(app);

var indexHtml;

fs.readFile("index.html", "utf8", function (err, data) {
  if (err != null) {
    console.log("index file reading error process exiting the error is:" + err);
    setTimeout(process.exit(1), 10000);
  }
  else {
    indexHtml = data;
    app.listen(port, function () {
			console.log('Evant RESTful API server started on: ' + port);
		});
  }
});

app.get('/', function (req, res) {
	res.send(indexHtml);
});