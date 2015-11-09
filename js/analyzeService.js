angular.module('myApp')
.service('analyzeService', analyzeFunc);

function analyzeFunc(){
// like instaservice, everything is inside this function


this.analyzeData = function(userMedia, likes, deferred, userData, follows, followers){

	var name = userData.full_name || userData.username;
	var userPic = userData.profile_picture;

	userMedia.name = name;
	userMedia.userPic = userPic;

	var userRatio = userData.counts.followed_by/userData.counts.follows;
	userMedia.userRatio = userRatio;
	// console.log('userRatio is', userRatio);

	var sumLikes = 0;
	var selfLiked = 0;
	var numPics = 0;
	var numVids = 0;
	var allTags = {};

	for(var i=0; i<userMedia.length; i++){
		var currentMedia = userMedia[i];
	// if(i%10===0){
	// 	console.log(currentMedia);
	// }
	// console.log(currentMedia);
	if(currentMedia.user_has_liked===true){
		selfLiked++;
	}

	if(currentMedia.type==="image"){
		numPics++;
	}
	else if(currentMedia.type==="video"){
		numVids++;
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





}  // end of for loop

// console.log('alltags object is', allTags);


// analyzing likes, lots of data
var userLikers = {};
for(var x=0; x<likes.length; x++){
	var likers = likes[x].data;
	for(var y=0; y<likers.length; y++){
		var currLike = likers[y];
		var name = currLike.full_name || currLike.username;
		var id = currLike.id;
		if(userLikers.hasOwnProperty(id)){
			userLikers[id][name]++;
		}
		else{
			userLikers[id]= {};
			userLikers[id][name]=1;
		}

	}

}

// console.log('tons of likes is...', userLikers);








// console.log('total number of likes is', sumLikes);
// console.log('number of media is', userMedia.length);
// console.log('averange number of likes is', sumLikes/userMedia.length);
// console.log('number of times you have liked your own photo is', selfLiked);
// console.log('numbef of pictures is ', numPics);
// console.log('number of videos is ', numVids);



uniqueFollow();



//_________________________Analyzing follows/followers__________________________

function uniqueFollow(){
	// console.log('follows is', follows);
	// console.log('followers are', followers);

	var uniqueFollowers = [];
	var uniqueFollows = [];

	// follows.sort(function(a,b){return a.id - b.id;});
	// console.log('sorted follows is ', follows);
	// for(var i=0; i<follows.length; i++){
	// 	// console.log(follows[i].id);
	// }



	// followers.sort(function(a,b){return a.id-b.id;});
	// console.log('sorted followers is', followers);
	// for(var j=0; j<followers.length; j++){
	// 	// console.log(followers[j].id);
	// }



	// //  need way to find unique follows, and unique followers
	// for(var x=0; x<follows.length; x++){
	// 	var currentFollow = follows[x];
	// 	for(y=0; j)


	// }












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

	// console.log('unique follows is ', uniqueFollows);




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

	// console.log('unique followers is', uniqueFollowers);

	userMedia.uniqueFollowers = uniqueFollowers;
	userMedia.uniqueFollows = uniqueFollows;






} // end of whole service function




























deferred.resolve(userMedia);













};
















}

