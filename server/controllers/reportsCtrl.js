var Report = require('../models/Report');
var User = require('../models/User');

module.exports = {
// 

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

			})
		}
	}) // end of adding report





}, // end of add report big function

getLatestReportDate: function(req, res, next){
	var instagramId = req.session.passport.user.instagramId;

	User.findOne({instagramId: instagramId})
	.exec(function(err, user){
		if(err) return res.status(500).send(err);

		// if success
		var reports = user.reports;
		var latestReportDate = reports[reports.length-1].date;
		res.send(latestReportDate);
	})
},

getStats: function(req, res, next){
	var instagramId = req.session.passport.user.instagramId;

	User.findOne({instagramId: instagramId})
	.populate({path: 'reports'})



	.exec(function(err, user){
		if(err) return res.status(500).send(err);

		var options = {
			path: 'reports.report',
			model: 'Report'
		};

		User.populate(user, options, function(err, user){
			if(err) return res.status(500).send(err);
			var reports = user.reports;
			// console.log('reports is \n\n', reports);

			// stats for now will be stored as big array of many arrays
			// each smaller array represents date
			// [
			// 		[dateObject, {...}]
			// ]
			var stats = [];

			// going through every report, to create stats array
			for(var i=0; i<reports.length; i++){
				var reportWrapper = reports[i];
				var report = reportWrapper.report
				// put date in 
				stats.push([reportWrapper.date]);
				// console.log(typeof reportWrapper.date);
				console.log(reportWrapper.date);
				console.log(typeof reportWrapper.date);

				var statsObj = {
					numFollowers: report.user.numFollowers,
					numFollows: report.user.numFollows,
					numMedia: report.user.numMedia,
					numLikesGiven: report.analytics.numLikesGiven,
					numLikesReceived: report.analytics.numLikesReceived,
					numPics: report.analytics.numPics,
					numVids: report.analytics.numVids,
					userRatio: report.grade.userRatio,
					adjustedAverageNumLikes: report.grade.adjustedAverageNumLikes,
				};

				stats[i].push(statsObj);

			}



			res.send(stats);
		})

});











	}, // end of get stats function











}; // end of module.exports, nothing below this



