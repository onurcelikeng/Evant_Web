var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser');

var compression = require('compression');
var fs = require('fs');
var db = require('./config/db');

app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression());

var routes = require('./api/routes');
routes(app);

var indexHtml;

fs.readFile("index.html", "utf8", function (err, data) {
  if (err != null) {
    console.log("index file reading error process exiting the error is:" + err);
    setTimeout(process.exit(1), 10000);
  }
  else {
    indexHtml = data;
    db.connect('mongodb://evantmongodb:vFqW9PbNjXkeFnSUneSloxIpDZcFDVYHTnszL9oJJvEAw9VnfzJcd2VPzrvENGN4Snd1b43m3XCxjO86hJGOqw%3D%3D@evantmongodb.documents.azure.com:10255/?ssl=true', function(err) {
      if (err) {
        console.log('Unable to connect to Mongo.')
        process.exit(1)
      } else {
        app.listen(port, function () {
          console.log('Evant RESTful API server started on: ' + port);
        });
      }
    })
  }
});

app.get('/', function (req, res) {
	res.send(indexHtml);
});