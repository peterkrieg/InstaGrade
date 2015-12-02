var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var InstagramStrategy = require('passport-instagram').Strategy;

var cors = require('cors');

var Secret = require('./server/config/Secret');

//____________________My dependencies__________________________
// var productsCtrl = require('./server/controllers/productsCtrl');
// var usersCtrl = require('./server/controllers/usersCtrl');
// var cartCtrl = require('./server/controllers/cartCtrl');

var mongoUri = 'mongodb://127.0.0.1/mediaScore';


var app = express();

app.use(cors());



app.use(bodyParser.json());

app.use(express.static(__dirname+'/client'));



//__________________Authentication__________________

passport.use(new InstagramStrategy({
		// development
		clientID: Secret.development.id,
		clientSecret: Secret.development.secret,

    // production
    // clientID: Secret.production.id,
    // clientSecret: Secret.production.secret,

    callbackURL: "http://localhost:3000/api/auth/instagram/callback"
  },
  function(accessToken, refreshToken, profile, done) {
  	console.log('accessToken is', accessToken);
  	User.findOrCreate({ instagramId: profile.id }, function (err, user) {
  		return done(err, user);
  	});
  }
  ));

//________________Endpoints____________________

app.get('/api/auth/instagram',

	function(req, res, next){
		console.log('geetting here');
		next();
	},


	passport.authenticate('instagram'));

app.get('api/auth/instagram/callback', 
	passport.authenticate('instagram', { failureRedirect: '/' }),
	function(req, res, next) {
		console.log('getting to next step');




    // Successful authentication, redirect home.
    res.redirect('/results/media');
  });




//_________________________Mongoose Connecting__________________________

mongoose.connect(mongoUri, function(err){
	if(err) console.log(err);
});

var db = mongoose.connection;

db.on('error', function(){
	console.log('error');
});

db.once('open', function(){
	console.log('running');
});
















//_____________Connecting to Port_________________
var port = 3000;

app.listen(port, function(){
	console.log('listening to port ', port);
})