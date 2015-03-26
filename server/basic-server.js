var express = require('express')
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

var messages = [];

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.all('*', function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'content-type, accept');
	res.header('Access-Control-Max-Age', 10);

	if(req.method === 'OPTIONS') {
		res.status(200).send(null);
	} else {
		return next();
	}
});

app.get('/classes/messages', function (req, res) {
  var rmsg = messages;
  if(req.params.order === '-createdAt'){
  	rmsg.reverse();
  }
  res.header('Content-Type', 'application/json');
  res.status(200).send(JSON.stringify({'results': rmsg}))
})

app.post('/classes/messages', function (req, res) {
  var n = req.body; n.objectId = messages.length;
  messages.push(n)
  res.sendStatus(201)
})

app.post('/classes/:room', function (req, res) {
  res.status(201).send(JSON.stringify({}));
})

app.get('/classes/:room', function (req, res) {
	var r = messages.map(function(o){
		if(o.roomname === req.params.room){
		return o;
		}
	});
	res.status(201).send(JSON.stringify({'results': r}));
});


var server = app.listen(3000, 'localhost', function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
