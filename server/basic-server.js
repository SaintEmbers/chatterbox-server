var express = require('express')
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

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
  fs.readFile('store.json', {'encoding':'utf8'}, function(err, data){
  	var rmsg = [];
  	if(!err){
  		rmsg = JSON.parse(data);
		  if(req.params.order === '-createdAt'){
		  	rmsg.reverse();
		  }
		}
	  res.header('Content-Type', 'application/json');
	  res.status(200).send(JSON.stringify({'results': rmsg}))
  });
})

app.post('/classes/messages', function (req, res) {
	fs.readFile('store.json', {'encoding':'utf8'}, function(err, data){
		//data === already existing JSON object of messages
		//n === the new message we should add
		if(err) { data = [] } else { data = JSON.parse(data) };
   
    var n = req.body; n.objectId = data.length;
    data.push(n);
		fs.writeFile("store.json", JSON.stringify(data), function(){
      res.sendStatus(201);
		});
	});
});

app.post('/classes/:room', function (req, res) {
  res.status(201).send(JSON.stringify({}));
})

app.get('/classes/:room', function (req, res) {
	/*var r = messages.map(function(o){
		if(o.roomname === req.params.room){
		return o;
		}
	});
	res.status(201).send(JSON.stringify({'results': r}));*/
});


var server = app.listen(3000, 'localhost', function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
