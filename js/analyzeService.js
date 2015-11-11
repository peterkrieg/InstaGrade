angular.module('myApp')
.service('analyzeService', analyzeFunc);
function analyzeFunc(){
// like instaservice, everything is inside this function

this.analyzeData = function(userMedia, deferred){
// everything also inside this function

//_________________________Basic stats/values about user__________________________
function getBasicStats(){
	var userData = userMedia.userData;
	// name used everywhere else in app, either full name, or username
	userMedia.name = userData.full_name || userData.username;
	userMedia.userPic = userData.profile_picture;
	// ratio of followers to follows, higher number is better for grade
	var userRatio = userData.counts.followed_by/userData.counts.follows;
	userMedia.userRatio = userRatio;
	return userMedia;
}
// update value of userMedia, after each function
userMedia = getBasicStats();


//__________Add up values, looping through all userMedia_________________
function sumUpMedia(){
	var sumLikes = 0;
	var selfLiked = 0;
	var numPics = 0;
	var numVids = 0;
	var allTags = {};
	var pics = [];
	var vids = [];

	// big for loop that goes through everything
	for(var i=0; i<userMedia.length; i++){
		var currentMedia = userMedia[i];
		currentMedia.score = (currentMedia.likes.count*1)+(currentMedia.comments.count*2);
		if(currentMedia.user_has_liked===true){
			selfLiked++;
		}

		if(currentMedia.type==="image"){
			pics.push(currentMedia);
		}
		else if(currentMedia.type==="video"){
			vids.push(currentMedia);
		}
		sumLikes+=currentMedia.likes.count;

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
	}

	var popularPics = pics.sort(function(a,b){return a.score - b.score;});
	var popularVids = vids.sort(function(a,b){return a.score - b.score;});

	userMedia.popularPics = popularPics;
	userMedia.popularVids = popularVids;

	userMedia.sumLikes = sumLikes;
	userMedia.numPics = pics.length;
	userMedia.numVids = vids.length;
	return userMedia;
}

userMedia = sumUpMedia();


//_________________________Analyzing Likes__________________________
function analyzeLikers(){
	var userLikers = {};
	var likes = userMedia.likes;
	for(var x=0; x<likes.length; x++){
		var likers = likes[x].data;
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

	userMedia.userLikersArr = sortLikers();
	userMedia.userLikers = userLikers;

	return userMedia;
}

// update userMedia again to include likers
userMedia = analyzeLikers();


//_________________________Analyzing follows/followers__________________________

function uniqueFollow(){
	var uniqueFollowers = [];
	var uniqueFollows = [];

	var follows = userMedia.follows;
	var followers = userMedia.followers;

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
	console.log('unique followers is ', uniqueFollowers);
	console.log('unique follows is', uniqueFollows);

	userMedia.uniqueFollowers = uniqueFollowers;
	userMedia.uniqueFollows = uniqueFollows;
	return userMedia;
} 

userMedia = uniqueFollow();

//_________________________End of unique follows/followers__________________________



















// once all data is analyzed, resolve promise, sending back to resultsCtrl
console.log(userMedia);
deferred.resolve(userMedia);
};
}



