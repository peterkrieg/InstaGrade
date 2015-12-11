var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReportSchema = Schema({
	media: [{
		caption: {type: String},
		comments: {
			count: {type: Number},
			data: [{
				created_time: {type: Number},
				text: {type: String},
				from: {
					full_name: {type: String},
					id: {type: Number},
					profile_picture: {type: String},
					username: {type: String}
				}
			}]
		},
		created_time: {type: Number},
		filter: {type: String},

			// skipped down to type..
			type: {type: String},
			user_has_liked: {type: Boolean}
		}], // end of media
	relationships: {
		followers: Array,
		follows: Array
	},
	grade: {
		adjustedAverageNumLikes: {type: Number},
		averageNumLikes: {type: Number},
		likesRatio: {type: Number},
		numLikesGiven: {type: Number},
		numLikesReceived: {type: Number},
		numSelfLikes: {type: Number},
		selfLikesRatio: {type: Number},
		userRatio: {type: Number}
	},







	})