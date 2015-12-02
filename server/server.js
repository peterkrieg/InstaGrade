var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//____________________My dependencies__________________________
// var productsCtrl = require('./server/controllers/productsCtrl');
// var usersCtrl = require('./server/controllers/usersCtrl');
// var cartCtrl = require('./server/controllers/cartCtrl');

var mongoUri = 'mongodb://127.0.0.1/mediaScore';


var app = express();



app.use(bodyParser.json());

app.use(express.static(__dirname+'/client'));




//_________________________Mongoose Connecting__________________________

mongoose.connect(mongoUri, function(err){
	if(err) console.log(err);
});

var db = mongoose.connection;

db.on('error', function(){
	console.log('error');
});

db.once('open', function(){
	console.log('mongoDB is running');
});













//_____________Connecting to Port_________________
var port = 3000;

app.listen(port, function(){
	console.log('listening to port ', port);
})