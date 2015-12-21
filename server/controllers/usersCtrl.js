var User = require('../models/User');


module.exports = {

	checkUser: function(req, res, next){
		// console.log('insta ID is', req.session.passport.user.instagramId);
		console.log('\n\nhere is check user controller!\n\n');

		console.log(req.session.passport.user);
		User.findOne({instagramId: req.session.passport.user.instagramId})

		// want to fill reports array with contents
		// because actual report is nested, need to have bit harder populate
		//  http://stackoverflow.com/questions/19222520/populate-nested-array-in-mongoose
		.populate({path: 'reports'})

		.exec(function(err, user){
			// populate options, to find report
			var options = {
				path: 'reports.report',
				model: 'Report'
			};
			if(err){
				console.log('error!');
				console.log(err);
			}
			else{
				// if there is already user created, and a report exists
				if(user){
					if(user.reports.length>0){
						// if user is ready for report (new report button clicked, and
						// it's been 24 hours since last report), then return user,
						// to signal to resultsCtrl that needs to load new report
						if(user.readyForReport){
							return res.send(req.session.passport.user);
						}
						// if not ready for report, or just logging in, without clicking
						// new report button, then return report
						else{
							// at this point, reports is still array of objects, with report
							// not populated yet.  

							User.populate(user, options, function(err, reportRaw){
								// I think that "reportRaw" is report that still hasn't been
								// populated, doesn't make sense to me though
								console.log('report Raw.. \n\n'+reportRaw+'\n\n');
								console.log('\n\n user already exists \n\n')
								// return last report (last element in array)
								var report = user.reports[user.reports.length-1].report;
								res.send(report);
							})
						}
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
	var user = req.body;
	User.findOne({instagramId: user.instagramId})
	.exec(function(err, response){
		// if response is null, user doesn't exist yet, so can actually add one
		if(response===null){
			new User(req.body).save(function(err, response){
				if(err) return res.status(500).send(err);
				else{
					return res.status(200).send(response);
				}
			}) // end of new user
		}
		else{ // user already exists, so don't do anytying basically
			return res.send("user already exists, don't need to create new one!");
		}
	})

},


getUser: function(req, res, next){
	// same instagram that is attached to cookies
	var instagramId = req.session.passport.user.instagramId;
	User.findOne({instagramId: instagramId})
	.exec(function(err, user){
		// if user not logged in, redirect to home
		if(err) return res.redirect('/');
		else{
			return res.send(user);
		}
	})

},

toggleReadyForReport: function(req, res, next){
	// status either true or false, to toggle ready or not
	var status = req.body.status;
	var instagramId = req.session.passport.user.instagramId;
	User.findOne({instagramId: instagramId})
	.exec(function(err, user){
		if(err) return res.redirect('/');

		user.readyForReport = status;
		user.save(function(err, response){
			return res.send(response);
		});
	});
},














} //end of module.exports