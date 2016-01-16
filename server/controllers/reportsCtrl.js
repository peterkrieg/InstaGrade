var Report = require('../models/Report');
var User = require('../models/User');
var ReportsDummyData = require('../models/Reports.js');

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
				if(i===1){
					console.log('\n\n\n', reportWrapper._id, '\n\n\n');
				}
				var report = reportWrapper.report
				// put date in 
				stats.push([reportWrapper.date]);
				// console.log(typeof reportWrapper.date);
				// console.log(reportWrapper.date);
				// console.log(typeof reportWrapper.date);

				var statsObj = {
					id: reportWrapper.report._id,
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



///////////////////////////////////////////////////
//  Get relationships account function
///////////////////////////////////////////////////

getRelationships: function(req, res, next){
	var userId = req.query.userId;
	console.log(userId);

	User.findById(userId)
	.populate('reports.report')
	.exec(function(err, user){
		var reports = user.reports;
		var lastReport = reports[reports.length-1].report;
		// var dateLastReport = reports[reports.length-1].date;
		// var uniqueFollows = reports[reports.length-1].report.relationships.uniqueFollows;
		// var uniqueFollowers = reports[reports.length-1].report.relationships.uniqueFollowers;

		var relationshipsStats = reports.map(function(report){
			var relObj = {};
			relObj.date = report.date;
			relObj.followers = report.report.relationships.followers;
			relObj.follows = report.report.relationships.follows;
			return relObj;
		});


		var relationshipsData = {
			// dateLastReport: dateLastReport,
			// uniqueFollows: uniqueFollows,
			// uniqueFollowers: uniqueFollowers,
			lastReport: lastReport,
			relationshipsStats: relationshipsStats
		};








		res.send(relationshipsData);
	})



	// res.send({hello: 'hello'});
},

















///////////////////////////////////////////////////
//  End of get relationships
///////////////////////////////////////////////////




///////////////////////////////////////////////////
//  Get stats for demo function
///////////////////////////////////////////////////

getStatsDemo: function(req, res, next){
	console.log('get stats demo');
	res.send(ReportsDummyData)




},
///////////////////////////////////////////////////
//  End get stats demo function
///////////////////////////////////////////////////





getGradeData: function(req, res, next){
	Report.find({})
	.exec(function(err, reports){
		if(err) res.send(err);
		else{
			// console.log(reports);
			console.log('get grade data');
			var grades = {};
			for(var i=0; i<reports.length; i++){
				var reportGrade = reports[i].grade;
				for(var prop in reportGrade){
					if(!grades[prop]){
						grades[prop]=[];
					}
					grades[prop].push(reportGrade[prop]);
				}
			}

			// sort the grades object arrays
			for(var prop in grades){
				var arr = grades[prop];
				arr.sort(function(a,b){return a-b});
			}
			res.send({grades: grades});
			// res.send(reports.length);
		}
	})
}, // end of get grade data






///////////////////////////////////////////////////
//  Maintenance funtion, just making sure everything has scores.  If I change scoring method
// or algorithm in future, will change with this
///////////////////////////////////////////////////
updateScores: function(req, res, next){
	Report.find({})
	.exec(function(err, reports){
		reports.forEach(function(report, index){
			// variables needed by score equations
			var numLikesReceived = report.grade.numLikesReceived;
			var likesRatio = report.grade.likesRatio;
			var averageNumLikes = report.grade.averageNumLikes;
			var adjustedAverageNumLikes = report.grade.adjustedAverageNumLikes;
			var userRatio = report.grade.userRatio;
			var selfLikesRatio = report.grade.selfLikesRatio;

			var scores = {};

			///////////////////////////////////////////////////
			//  Getting scores, now that raw grades calculated
			///////////////////////////////////////////////////

			// get scores, to be put into grade as object 
			// (scores from 0 to 100, for each category, and overall score)


			// #1:  number of likes received score
			if(numLikesReceived<=625){
				scores.numLikesReceived = 2*Math.pow(numLikesReceived, .5);
			}
			// (625, 50)
			if(numLikesReceived>625 && numLikesReceived<=2500){
				scores.numLikesReceived = 20+1.2*Math.pow(numLikesReceived, .5);
			}
			// (2500,80)
			if(numLikesReceived>2500 && numLikesReceived<=9000){
				scores.numLikesReceived = 57.15 + 1*Math.pow(numLikesReceived, .4);
			}
			// (9000, ~95.3177891)
			// linear finish, until I think of better way to generate score
			if(numLikesReceived>9000 && numLikesReceived <=50000){
				scores.numLikesReceived = 95.317777+(numLikesReceived-9000)*.0001;
			}
			// if more than 50,000 likes, score is just 100..
			if(numLikesReceived>50000){
				scores.numLikesReceived = 100;
			}


			//#2: likes ratio score
			if(likesRatio<=.5){
				scores.likesRatio = 100*(Math.pow(likesRatio, .7));
			} // (.5, ~61.55722067)
			if(likesRatio>.5 && likesRatio <=3){
				scores.likesRatio = 21+50*(Math.pow(likesRatio, .3));
			} // (3, 90.5194585)
			if(likesRatio>3 && likesRatio<=18){
				scores.likesRatio = 90.5194585+.6*(likesRatio-3);
			}// (18, ~99.5);
			if(likesRatio>18){
				scores.likesRatio = 100;
			}

			// #3 average number of likes score
			if(averageNumLikes<=9){
				scores.averageNumLikes = 20*(Math.pow(averageNumLikes, .5));
			}
			// (9, 60)
			if(averageNumLikes>9 && averageNumLikes<=30){
				scores.averageNumLikes = 16.85+20*Math.pow(averageNumLikes, .35);
			}// (30, 82.62918116)
			if(averageNumLikes>30&&averageNumLikes<=80){
				scores.averageNumLikes = 35.85+20*Math.pow(averageNumLikes, .25);
			}// (80, 95.66395124)
			if(averageNumLikes>80 &&averageNumLikes<=270){
				scores.averageNumLikes = 95.66395124+(averageNumLikes-80)*.02;
			}
			if(averageNumLikes>270){
				scores.averageNumLikes = 100;
			}

			// #4 adjusted average number likes, not possible to be more than 100, since per 100 followers
			if(adjustedAverageNumLikes <=8){
				scores.adjustedAverageNumLikes = 30*Math.pow(adjustedAverageNumLikes, .5);
			} // 8, 84.85281375
			if(adjustedAverageNumLikes>8 && adjustedAverageNumLikes<=15){
				scores.adjustedAverageNumLikes = 28.86+30*Math.pow(adjustedAverageNumLikes, .3);
			}// (15, 96.46030143)
			if(adjustedAverageNumLikes>15 && adjustedAverageNumLikes<=24){
				scores.adjustedAverageNumLikes = 51.45+30*Math.pow(adjustedAverageNumLikes, .15);
			} // (24, 99.77289459)
			if(adjustedAverageNumLikes>24){
				scores.adjustedAverageNumLikes = 100;
			}


			// #5 user ratio 
			if(userRatio<=.4){
				scores.userRatio = 90*Math.pow(userRatio, .5);
			} // (.4, 56.92099788)
			if(userRatio>.4 && userRatio <=1.8){
				scores.userRatio = 75*Math.pow(userRatio, .3);
			} // (1.8, 89.462908875)
			if(userRatio>1.8 && userRatio<=7){
				scores.userRatio = 89.462908875 +(userRatio-1.8)*2;
			}
			if(userRatio>7){
				scores.userRatio = 100;
			}

			// #6  self likes ratio
			if(selfLikesRatio < 1){
				scores.selfLikesRatio = 50 -400*Math.pow(selfLikesRatio-.5, 3);
			}
			if(selfLikesRatio>=1){
				scores.selfLikesRatio = 0;
			}

			// calculating overall score, weighted average
			// of other scores

			// weights are shown as number multiplied below, adjusted average most important



			scores.overallScore = 
			( scores.numLikesReceived*10 + 
				scores.likesRatio*15 + 
				scores.averageNumLikes*15 + 
				scores.adjustedAverageNumLikes*40 + 
				scores.userRatio*25 + 
				scores.selfLikesRatio*10)/115;

			// console.log('overall score is: \n\n', scores.overallScore);

			// attach scores to report
			report.grade.scores = scores;
			console.log(report.grade.scores);

			//_________________Done with scores__________________________


			console.log(index);


			Report.findByIdAndUpdate(report._id, report, function(err, response){
				if(err) res.send(err);
			});

			// report.save(function(err, response){
			// 	if(err) {
			// 		console.log(err);
			// 		res.send(err);
			// 	}
			// })


		})// for each

res.send('all done');

	});//exec
},   // update scores function



///////////////////////////////////////////////////
//  Function used by demo
///////////////////////////////////////////////////

getReportById: function(req, res, next){
	Report.findById(req.query.id)
	.exec(function(err, report){
		res.send(report);

	}); // exec

},














}; // end of module.exports, nothing below this



