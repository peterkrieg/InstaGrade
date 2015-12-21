var Report = require('../models/Report');
var User = require('../models/User');

module.exports = {

	addReport: function(req, res, next){
		// set one date for whole report, (gets added to report, and 
		// user's reports array)
		var dateOfReport = new Date();

		// console.log('\n\nhere is add Report controller!\n\n');
		var report = req.body;
		report.basicInfo = {
			date: dateOfReport
		};

		// console.log(report.user.instagramId);


		new Report(report).save(function(err, report){
			if(err){
				console.log(err);
				return res.status(500).send(err);
			}
			else{
				console.log('\n\n______report id is______\n\n')
				console.log(report.id);

				console.log('instagram id is\n\n');
				console.log(report.user.instagramId);

				// once report saved, add report mongoose id to user
				// (essential for populating later)
				User.findOne({instagramId: report.user.instagramId})
				.exec(function(err, user){
					if(err) console.log(err);


					console.log('user is \n\n', user, '\n\n');

					var reportWrapper = {
						date: dateOfReport,
						report: report.id
					};

					user.reports.push(reportWrapper);
					user.save(function(err, response){
						console.log('user after is\n\n', user, '\n\n');
						return res.send(report);
					})







					// not sure why I have to do this, but when reports is
					// empty for first time, says it is undefined, and not
					// just empty array..
					// if(user.reports){
					// 	user.reports.push(report.id);
					// }
					// else{
					// 	user.reports = [];
					// 	user.reports.push(report.id);
					// 	user.save(function(err, response){
					// 	// now return report, once everything done
					// 	return res.send(report);
					// })

					// }



				})
			}

		}) // end of adding report





	}










};
