var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var InstagramStrategy = require('passport-instagram').Strategy;

var cors = require('cors');

var request = require('request');


//____________________My dependencies__________________________
var usersCtrl = require('./server/controllers/usersCtrl');
var reportsCtrl = require('./server/controllers/reportsCtrl');


// setting status of node environment
process.env.NODE_ENV = process.env.NODE_ENV || 'development';


var Secret = require('./server/config/Secret');


// URI is always 127.0.0.1, for both server and local computer
var mongoUri = 'mongodb://127.0.0.1/mediaScore';



var app = express();

app.use(cors());

//_____________Passport middleware________________

app.use(session({secret: 'blahblah'}));



app.use(passport.initialize());

app.use(passport.session());

passport.serializeUser(function(user, done){
	///////////////////////////////////////////////////
	//  STEP 4 of passport flow:
	//  Once credentials are received, they are serialized
	//  So next request won't contain credentials, but
	//  The unique cookie that identifies the session
	///////////////////////////////////////////////////
	console.log('seralize user');
	// console.log(user);
	done(null, user);
});

passport.deserializeUser(function(user, done){
	done(null, user);
});



// make node be able to handle big file sizes
app.use(bodyParser.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb'}));


app.use(express.static(__dirname+'/client'));





//__________________Authentication__________________

passport.use(new InstagramStrategy({
	clientID: Secret[process.env.NODE_ENV].id,
	clientSecret: Secret[process.env.NODE_ENV].secret,
	callbackURL: Secret[process.env.NODE_ENV].callbackURL,
},
function(accessToken, refreshToken, profile, done) {
  	///////////////////////////////////////////////////
  	//  STEP 3 of authentication, after successful authentication
  	//  Of instagram.  Insta returns info of token, basic profile
  	//  Done is callback to continue passport flow
  	///////////////////////////////////////////////////

  	// console.log(req);

  	console.log('accessToken is', accessToken);
  	var instagramId = profile.id;


  	var instaInfo = JSON.parse(profile._raw).data;
  	// console.log('insta info is', instaInfo);


  	// var instaInfo = JSprofile._raw;
  	// console.log('insta info is...\n\n\n', instaInfo, '\n\n\n');


  	// check if user exists, and do stuff with that

  	// usersCtrl.checkUser(instagramId);










  	var user = {
  		name: instaInfo.full_name,
  		username: instaInfo.username,
  		instagramId: instaInfo.id,
  		bio: instaInfo.bio,
  		website: instaInfo.website,
  		profilePicture: instaInfo.profile_picture,
  		numMedia: instaInfo.counts.media,
  		numFollowers: instaInfo.counts.followed_by,
  		numFollows: instaInfo.counts.follows,
  		token: accessToken,
  		refreshToken: refreshToken
  	};






  	// console.log('user is, \n\n\n', user, '\n\n\n' );


  	return done(null, user);

  }

  // watch out for comma, need as another function below here
  // ,
  // function(accessToken, refreshToken, profile, done) {
  // 	console.log('find or create??!!');
  // 	User.findOrCreate({ instagramId: profile.id }, function (err, user) {
  // 		return done(err, user);
  // 	});

  // }
  ));



//________________Endpoints____________________

///////////////////////////////////////////////////
//  STEP 1 Instagram AUTH-- login button is clicked
//  A href to this endpoint, very first step
///////////////////////////////////////////////////

app.get('/api/auth/instagram',
	function(req, res, next){
		console.log('get request login button');
		next();
	},
	passport.authenticate('instagram'));

///////////////////////////////////////////////////
//  STEP 2: passport.authenticate('instagram')
//  Directs to instagram login site on their page
//  Once user submits their username/password, instagram
//  redirects them to /api/auth/instagram/callback, 
//  The registered callback URI for the site
///////////////////////////////////////////////////

app.get('/api/auth/instagram/callback',
	function(req, res, next){
		console.log('right after getting back from instagram');
		next();
	},
	passport.authenticate('instagram', { failureRedirect: '/', scope: ['relationships'] }),
	




	///////////////////////////////////////////////////
	//  STEP 5 of passport flow:
	//  Once user is serialized, done callback initiated
	//  Returning it to here, req is still passed on
	//  With user stored in req.session.passport.user
	///////////////////////////////////////////////////

	function(req, res, next) {
		console.log('getting to next step');
		console.log(req.session.passport.user.token);
		console.log(req.session.passport.user);


    // Successful authentication, redirect home.
    // last step, then controller fires of that page
    res.redirect('/#/results/media');
  });




//____________________Logout______________________
app.get('/api/auth/instagram/logout', 
	function(req, res, next){
		// doesn't work, somehow need to direct page to 
		// url below to logout on instagram officially,
		// then logout with my backend

		// request.get('https://instagram.com/accounts/logout');


		req.logout();
		
		res.redirect('/');
		// res.redirect('/');
	})





app.get('/api/token', usersCtrl.checkUser);


app.post('/api/insta/relationships', function(req, res, next){
	console.log(req.query);
	var action = req.query.action;
	var token = req.query.token;
	var id = req.query.id;
	var url = 'https://api.instagram.com/v1/users/'+id+'/relationship?action=unfollow&access_token='+token;

	request.post(url, function(error, response, body){
		// console.log(response);
		res.send(response);
	})



})

// adding user to database
app.post('/api/users', usersCtrl.addUser);

// adding report to database
app.post('/api/reports', reportsCtrl.addReport);


















//_________________________Mongoose Connecting__________________________

mongoose.connect(mongoUri, function(err){
	if(err) console.log(err);
});

var db = mongoose.connection;

db.on('error', function(){
	console.log('error');
});

db.once('open', function(){
	console.log('MongoDB is running!');
});
















//_____________Connecting to Port_________________
var port = process.env.PORT || 3000;

app.listen(port, function(){
	console.log('listening to port ', port);
})