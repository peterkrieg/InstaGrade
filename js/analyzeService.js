angular.module('myApp')
.service('analyzeService', analyzeFunc);

function analyzeFunc(){
// like instaservice, everything is inside this function


this.analyzeData = function(userMedia, likes, deferred, userData, follows, followers){



	var userRatio = userData.counts.followed_by/userData.counts.follows;
	console.log('userRatio is', userRatio);

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
	console.log(currentMedia);
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

console.log('alltags object is', allTags);


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

console.log('tons of likes is...', userLikers);








console.log('total number of likes is', sumLikes);
console.log('number of media is', userMedia.length);
console.log('averange number of likes is', sumLikes/userMedia.length);
console.log('number of times you have liked your own photo is', selfLiked);
console.log('numbef of pictures is ', numPics);
console.log('number of videos is ', numVids);





deferred.resolve(userMedia);













};
















}

