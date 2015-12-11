var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Mixed = Schema.Types.Mixed;

var ReportSchema = Schema({
	media: [{
		attribution: Mixed,
		caption: Mixed,
		// comments: Mixed,
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
		},// end of comments
		created_time: {type: Number},
		filter: {type: String},
		images: Mixed,
		likes: {
			count: {type: Number}
		},
		likesFull: Mixed,
		link: {type: String},
		location: Mixed,
		tags: Mixed,
		type: {type: String},
		user_has_liked: {type: Boolean},
		users_in_photo: Mixed,

		// stuff that is unique to videos
		safeurl: Mixed,
		videos: Mixed
	}], // end of media

	relationships: {
		followers: Array,
		follows: Array,
		likesComparisonArr: Mixed,
		uniqueFollowers: Mixed,
		uniqueFollows: Mixed
	}, // end of relationships


	// just accept everything on grade, it won't be much data
	grade: Mixed,

	analytics: {
		allTagsArr: Mixed,
		allTimes: Mixed,
		averageNumLikes: {type: Number},
		currentTags: Mixed,
		currentTagsCounts: Mixed,
		daysOfWeek: Mixed,
		daysOfWeekArr: Mixed,
		hashtagScatter: Mixed,
		numLikesGiven: {type: Number},
		numLikesReceived: {type: Number},
		numPics: {type: Number},
		numVids: {type: Number},
		numSelfLikes: {type: Number},
		tagsGroupsCounts: Mixed,
		tagsGroupsNames: Mixed
	}, // end of analytics.

	map: {
		allLocations: [{
			date: {type: Number},
			instagramId: {type: Number},
			latitude: {type: Number},
			longitude: {type: Number},
			name: {type: String},
			pic: Mixed
		}]
	},


	// user which pretty much is same as User schema, 
	// except I leave out date joined and reports array
	// I decided not to reference user here, because user could
	// change bio/picture/any of their info over time,
	// might be useful to keep track of that
	user: {
		name: {type: String},
		username: {type: String},
		instagramId: {type: Number},
		bio: {type: String},
		website: {type: String},
		profilePicture: {type: String},
		numMedia: {type: Number, required: true},
		numFollowers: {type: Number, required: true},
		numFollows: {type: Number, required: true},
	}







});  // end of report schema


module.exports = mongoose.model('Report', ReportSchema);