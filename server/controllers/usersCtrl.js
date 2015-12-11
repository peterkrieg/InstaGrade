var User = require('../models/User');


module.exports = {

	checkUser: function(instagramId){
		console.log('insta ID is', instagramId);
		console.log('here is check user controller!');
		// next();

		User.findOne({instagramId: "1234567"})
		.exec(function(err, user){
			if(err){
				console.log('error!');
				console.log(err);
			}
			else{
				// if there is already user created, 
				if(user){
					
					console.log('user is', user);
				}
				else{
					console.log('error, user is falsy, it is: ', user);
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