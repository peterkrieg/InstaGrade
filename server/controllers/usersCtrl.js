var User = require('../models/User');


module.exports = {

	checkUser: function(req, res, next){
		// console.log('insta ID is', req.session.passport.user.instagramId);
		console.log('\n\nhere is check user controller!\n\n');

		User.findOne({instagramId: req.session.passport.user.instagramId})

		// want to fill reports array with contents
		.populate('reports')

		.exec(function(err, user){
			if(err){
				console.log('error!');
				console.log(err);
			}
			else{
				// if there is already user created, and a report exists
				if(user){
					if(user.reports.length>0){
						console.log('user exists');
						var report = user.reports[user.reports.length-1];
						res.send(report);
					}
					// user exists, but for some reason no reports do
					else{
						res.send(req.session.passport.user);
					}
				}
				// report isn't already created, so need to do tons of insta
				// api calls, etc
				else{
					console.log('no report exists yet, but here is user: ', user);
					console.log('user on session is', req.session.passport.user);
					res.send(req.session.passport.user);

				}
			}
		})






}, // end of check user


addUser: function(req, res, next){
	new User(req.body).save(function(err, response){
		if(err) return res.status(500).send(err);
		else{
			return res.status(200).send(response);
		}
	})


},

getUser: function(req, res, next){
	// same instagram that is attached to cookies
	var instagramId = req.session.passport.user.instagramId;
	User.findOne({instagramId: instagramId})
	.exec(function(err, user){
		// if instagramId 
		if(err) return res.redirect('/');
		else{
			return res.send(user);
		}
	})

}













} //end of module.exports