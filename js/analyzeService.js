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
	var pics = [];
	var vids = [];

	for(var i=0; i<userMedia.length; i++){
		var currentMedia = userMedia[i];
		currentMedia.score = (currentMedia.likes.count*1)+(currentMedia.comments.count*2);
	// if(i%10===0){
	// 	console.log(currentMedia);
	// }
	// console.log(currentMedia);
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





}  // end of for loop

userMedia.sumLikes = sumLikes;

userMedia.numPics = pics.length;
userMedia.numVids = vids.length;

// sort to find most popular photos/videos

var popularPics = pics.sort(function(a,b){return a.score - b.score;});
var popularVids = vids.sort(function(a,b){return a.score - b.score;});

userMedia.popularPics = popularPics;
userMedia.popularVids = popularVids;

// console.log(popularPics);
// console.log(popularVids);













// console.log('alltags object is', allTags);


// analyzing likes, lots of data
var userLikers = {};
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

// console.log(likes);


// sort user likers

//first need to put into array, to sort

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

var userLikersArr = sortLikers();
userMedia.userLikersArr = userLikersArr;









// 
// userLikers = userLikers.sort(function(a,b){return b.count-a.count;});
userMedia.userLikers = userLikers;
// console.log(userMedia.likes);

// console.log(userMedia.userLikers);

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

	// console.log(userMedia.uniqueFollows);






} // end of whole service function




























deferred.resolve(userMedia);













};
















}

