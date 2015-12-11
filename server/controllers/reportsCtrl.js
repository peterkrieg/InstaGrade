var Report = require('../models/Report');
var User = require('../models/User');

module.exports = {

	addReport: function(req, res, next){
		console.log('\n\nhere is add Report controller!\n\n');
		var report = req.body;

		console.log(report.user.instagramId);
		// res.send('hello');


		new Report(report).save(function(err, report){
			if(err){
				console.log(err);
				return res.status(500).send(err);
			}
			else{
				console.log('\n\n______report id is______\n\n')
				console.log(report.id);
				return res.send(report);
			}


		})



		// console.log(report.user.instagramId);


	}










};
