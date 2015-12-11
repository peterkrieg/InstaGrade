var User = require('../models/User');


module.exports = {

	checkUser: function(req, res, next){
		// console.log('insta ID is', req.session.passport.user.instagramId);
		console.log('\n\nhere is check user controller!\n\n');

		User.findOne({instagramId: "1234567"})

		// want to fill reports array with contents
		// .populate('reports')

		.exec(function(err, user){
			if(err){
				console.log('error!');
				console.log(err);
			}
			else{
				// if there is already user created, and a report exists
				if(user.reports.length>0){
					var report = user.reports[user.reports.length-1];
					res.send(report);
				}
				// report isn't already created, so need to do tons of insta
				// api calls, etc
				else{
					console.log('error, user is falsy, it is: ', user);

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













} //end of module.exports