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

	var sumLikes = 0;
	var selfLiked = 0;
	var numPics = 0;
	var numVids = 0;
	var allTags = {};
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
		sumLikes+=currentMedia.likes.count;

		// add up number of times person has liked their own media
		if(currentMedia.user_has_liked==="true"){
			selfLiked++;
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
	}// end of for loop for all media



	report.analytics.sumLikes = sumLikes;
	report.analytics.numPics = numPics;
	report.analytics.numVids = numVids;

	// find average number of likes per piece of media
	report.analytics.averageLikes = sumLikes/report.user.numMedia;

	// times you'ved liked own media
	report.analytics.selfLiked = selfLiked;

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

	// ratio of followers to follows,
	//  higher number is better for grade
	var userRatio = numFollowers/numFollows;
	report.grade.userRatio = userRatio;








	return report;
}
// update value of userMedia, after each function
report = getGrade();




















// once all data is analyzed, resolve promise, sending back to resultsCtrl
// console.log(userMedia);
deferred.resolve(report);
};
}



