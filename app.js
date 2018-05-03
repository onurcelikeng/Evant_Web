// get the packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var fs = require('fs');
var config = require('./config');
var routes = require('./api/routes');

// configurations
var port = process.env.PORT || 3000;

app.set('superSecret', config.secret);
app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

routes(app);

var indexHtml;

fs.readFile("index.html", "utf8", function (err, data) {
  if (err != null) {
    console.log("index file reading error process exiting the error is:" + err);
    setTimeout(process.exit(1), 10000);
  }
  else {
    indexHtml = data;
    mongoose.connect(config.database);
  }
});

app.get('/', function (req, res) {
	res.send(indexHtml);
});

app.listen(port);