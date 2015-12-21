var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
	name: {type: String},
	username: {type: String},
	instagramId: {type: String, required: true},
	bio: {type: String},
	website: {type: String},
	profilePicture: {type: String},
	numMedia: {type: Number, required: true},
	numFollowers: {type: Number, required: true},
	numFollows: {type: Number, required: true},
	dateJoined: {type: Date, required: true, default: new Date()},
	reports: [{
		date: {type: Date, required: true, default: new Date()},
		report: {type: Schema.Types.ObjectId, ref: 'Report'}   
	}]  
});

module.exports = mongoose.model('User', UserSchema);