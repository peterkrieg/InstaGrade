var Report = require('../models/Report');
var User = require('../models/User');

module.exports = {

	addReport: function(req, res, next){
		console.log('\n\nhere is add Report controller!\n\n');
		var report = req.body;
		// console.log(report.user.instagramId);
		res.send('succes!s');


	}










};
