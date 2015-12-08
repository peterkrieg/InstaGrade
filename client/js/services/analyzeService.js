angular.module('myApp')
.service('analyzeService', analyzeFunc);
function analyzeFunc(){
// like instaservice, everything is inside this function

this.analyzeData = function(report, deferred){
	var user = report.user;
// everything also inside this function


//____Add up values, looping through all of media_________
function sumUpMedia(){
	var media = report.media;

	var numLikesReceived = 0;
	var numSelfLikes = 0;
	var numPics = 0;
	var numVids = 0;
	var allTags = {};
	var allLocations = [];
	var hashtagScatter = [];
	// var pics = [];
	// var vids = [];


	// big for loop that goes through everything
	for(var i=0; i<media.length; i++){
		var currentMedia = media[i];

		// Adding up videos/pictures
		if(currentMedia.type==="image"){
			numPics++;
		}
		else if(currentMedia.type==="video"){
			numVids++;
		}

		// Adding up total likes received
		numLikesReceived+=currentMedia.likes.count;

		// add up number of times person has liked their own media
		if(currentMedia.user_has_liked===true){
			numSelfLikes++;
		}

		// Adding up locations, for map section (google maps)
		if(currentMedia.location){
			var location = currentMedia.location;
			var locationObj = {
				name: location.name,
				latitude: location.latitude,
				longitude: location.longitude,
				date: currentMedia.created_time,
				pic: currentMedia.images.low_resolution,
				instagramId: location.id
			};
			allLocations.push(locationObj);
		}


		// analyzing hashtag usage
		if(currentMedia.tags.length>0){
			for(var k=0; k<currentMedia.tags.length; k++){
				var tag = currentMedia.tags[k];
				if(allTags.hasOwnProperty(tag)){
					allTags[tag]++;
				}
				else{
					allTags[tag] = 1;
				}
			}
		}

		// hashtag analysis for scatter plot
		if(currentMedia.tags.length>0){
			var scatterPoint = [];
			scatterPoint.push(currentMedia.tags.length);
			scatterPoint.push(currentMedia.comments.count+currentMedia.likes.count);
			scatterPoint.tagNames = currentMedia.tags;
			hashtagScatter.push(scatterPoint);
		}






	}// end of for loop for all media



	report.analytics.numLikesReceived = numLikesReceived;
	report.analytics.numPics = numPics;
	report.analytics.numVids = numVids;

	// find average number of likes per piece of media
	report.analytics.averageNumLikes = numLikesReceived/report.user.numMedia;

	// times you'ved liked own media
	report.analytics.numSelfLikes = numSelfLikes;

	// puts tags on analyze part of report
	report.analytics.allTags = allTags;

	// hashtag scatter plot
	report.analytics.hashtagScatter = hashtagScatter;

	// puts locations on analytics part of report
	// locations are sorted chronologically, earliest is first
	allLocations.sort(function(a,b){return a.date - b.date;});
	report.map.allLocations = allLocations;

	return report;
}

report = sumUpMedia();
// console.log(report);


//_____________Analyzing Likes Received__________________________
function analyzeLikers(){
	var userLikers = {};
	var likes = report.relationships.likesReceived;
	for(var x=0; x<likes.length; x++){
		var likers = likes[x];
		for(var y=0; y<likers.length; y++){
			var currLike = likers[y];
			var name = currLike.full_name || currLike.username;
			var pic = currLike.profile_picture;
			var id = currLike.id;
			if(userLikers.hasOwnProperty(id)){
				userLikers[id].count++;
			}
			else{
				userLikers[id]= {count: 1};
				userLikers[id].name = name;
				userLikers[id].pic = pic;
			}
		}
	}

	// take userLikers object, make into array
	function sortLikers(){
		var userLikersArr = [];
		for(var prop in userLikers){
			var id = prop;
			var currObj = userLikers[id];
			var count = currObj.count;
			var name = currObj.name;
			var pic = currObj.pic;

			var user = {
				id: id,
				name: name,
				count: count,
				pic: pic
			};

			userLikersArr.push(user);
		}

		// now sort array
		userLikersArr.sort(function(a,b){return a.count - b.count;});
		return userLikersArr;
	}

	report.relationships.userLikersArr = sortLikers();
	report.relationships.userLikers = userLikers;

	return report;
}

// update userMedia again to include likers
report = analyzeLikers();



//___________Analyzing YOUR Likes (the stuff you've liked)__________________

function analyzeYourLikes(){
	var yourLikes = report.relationships.likesGiven;

	var yourLikesUsers = {};

	// loop through huge array of stuff you've liked

	for(var i=0; i<yourLikes.length; i++){
		var currYourLike = yourLikes[i];
		var user = currYourLike.user;
		var id = user.id;

		if(yourLikesUsers.hasOwnProperty(id)){
			yourLikesUsers[id].count++;
		}
		else{
			var name = user.full_name || user.username;
			var pic = user.profile_picture; 
			yourLikesUsers[id] = {
				count: 1,
				name: name,
				pic: pic
			};
		}
	}

	// console.log(yourLikesUsers);

	// now turn big object into array, to be sorted
	function sortyourLikesUsers(){
		var yourLikesUsersArr = [];
		for(var prop in yourLikesUsers){
			var id = prop;
			var currObj = yourLikesUsers[prop];
			currObj.id = id;

			yourLikesUsersArr.push(currObj);
		}
		// sort into top likes
		yourLikesUsersArr.sort(function(a,b){return a.count - b.count;});

		// console.log(yourLikesUsersArr);
		return yourLikesUsersArr;
	}

	report.relationships.yourLikesUsers = yourLikesUsers;
	report.relationships.yourLikesUsersArr = sortyourLikesUsers();
	return report;
}

report = analyzeYourLikes();


//___________Analyzing Likes Comparison____________
// just means creating new object and array, comparing likes

function compareLikes(){
	var likesComparison = report.relationships.userLikers;
	for(var prop in likesComparison){
		likesComparison[prop].likesReceived = likesComparison[prop].count;
		delete likesComparison[prop].count;
	}
	var likesGivenUsers = report.relationships.yourLikesUsers;
	// now loop through lives given
	for(var prop in likesGivenUsers){
		if(likesComparison[prop]){
			likesComparison[prop].likesGiven = likesGivenUsers[prop].count;
		}
		else{
			likesComparison[prop] = {};
			likesComparison[prop].pic = likesGivenUsers[prop].pic;
			likesComparison[prop].name = likesGivenUsers[prop].name;
			likesComparison[prop].likesGiven = likesGivenUsers[prop].count;
		}
	}

	// now loop through finished likesComparison, and make sure
	// values are at least 0, if undefined
	//(ie, possible you've never received a like from user, or vice versa)

	for(var prop in likesComparison){
		var currObj = likesComparison[prop];
		if(!currObj.hasOwnProperty('likesReceived')){
			currObj.likesReceived = 0;
		}
		if(!currObj.hasOwnProperty('likesGiven')){
			currObj.likesGiven=0;
		}
		likesComparison[prop] = currObj;
	}

	//______Now put entire likesComparison object as array, to sort__________

	var likesComparisonArr = [];
	for(var prop in likesComparison){
		likesComparison[prop].instagramId = prop;
		likesComparisonArr.push(likesComparison[prop]);
	}
	likesComparisonArr.sort(function(a,b){return (a.likesGiven+a.likesReceived)-(b.likesGiven+b.likesReceived)})


	report.relationships.likesComparison = likesComparison;
	report.relationships.likesComparisonArr = likesComparisonArr

return report;
}


report = compareLikes();


















//_________________________Analyzing follows/followers__________________________

function uniqueFollow(){
	var uniqueFollowers = [];
	var uniqueFollows = [];

	var follows = report.relationships.follows;
	var followers = report.relationships.followers;

	for(var i=0; i<follows.length; i++){
		var currentFollow = follows[i];
		for(var j=0; j<followers.length; j++){
			var currentFollower = followers[j];
			if(currentFollow.id===currentFollower.id){
				// a follow is a follower, not unique
				break;
			}
			if(j===followers.length-1){
				uniqueFollows.push(follows[i]);
			}
		}
	}

	for(var x=0; x<followers.length; x++){
		var currentFollower2 = followers[x];
		for(var y=0; y<follows.length; y++){
			var currentFollow2 = follows[y];
			if(currentFollower2.id===currentFollow2.id){
				// a follow is a follower, not unique
				break;
			}
			if(y===follows.length-1){
				uniqueFollowers.push(followers[x]);
			}
		}
	}
	// console.log('unique followers is ', uniqueFollowers);
	// console.log('unique follows is', uniqueFollows);

	report.relationships.uniqueFollowers = uniqueFollowers;
	report.relationships.uniqueFollows = uniqueFollows;
	// console.log(report);
	return report;
} 

report = uniqueFollow();

//_________________________End of unique follows/followers__________________________


//_______Once all data analyzed, get grade_____________
function getGrade(){
	var numFollowers = user.numFollowers;
	var numFollows = user.numFollows;
	var averageNumLikes = report.analytics.averageNumLikes;

	report.grade.averageNumLikes = averageNumLikes;

	// ratio of followers to follows,
	//  higher number is better for grade
	var userRatio = numFollowers/numFollows;
	report.grade.userRatio = userRatio;

	var numLikesGiven = report.relationships.likesGiven.length;
	var numLikesReceived = report.analytics.numLikesReceived;

	report.analytics.numLikesGiven = numLikesGiven;
	report.grade.numLikesGiven = numLikesGiven;

	report.analytics.numLikesReceived = numLikesReceived;
	report.grade.numLikesReceived = numLikesReceived;


	var likesRatio = numLikesReceived/numLikesGiven;
	report.grade.likesRatio = likesRatio;

	var selfLikesRatio = report.analytics.numSelfLikes/report.user.numMedia;

	report.grade.selfLikesRatio = selfLikesRatio;
	report.grade.numSelfLikes = report.analytics.numSelfLikes;


	// calculating average likes per 100 followers, big part of grade
	var followerRatio = numFollowers/100;
	var adjustedAverageNumLikes = averageNumLikes/followerRatio;
	report.grade.adjustedAverageNumLikes = adjustedAverageNumLikes;


	// turn all tags into an array
	var allTags = report.analytics.allTags;
	var allTagsArr = [];
	for(var prop in allTags){
		allTagsArr.push({
			hashtag: prop,
			count: allTags[prop]
		});
	}
	// sorted from highest number first, to lowest number last in array
	allTagsArr.sort(function(a,b){return b.count - a.count;});
	report.analytics.allTagsArr = allTagsArr;










	return report;
}
// update value of userMedia, after each function
report = getGrade();




















// once all data is analyzed, resolve promise, sending back to resultsCtrl
// console.log(userMedia);
deferred.resolve(report);
};
}



