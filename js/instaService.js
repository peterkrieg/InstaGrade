angular.module('myApp')
.service('instaService', instaFunc);

function instaFunc($http, $q){
// everything is inside instaFunc, so going to ignore indentation of wrapper function


this.getInstaFeed= function(token){
	var deferred = $q.defer();
	var URL = 'https://api.instagram.com/v1/users/self/media/recent?access_token='+token+'&callback=JSON_CALLBACK';
	// empty array that will hold objects of 45 picture objects, or however many
	var userMedia = [];
	// var page = 1;

	// first function call
	return eachRequest(URL);


	function eachRequest(URL){
		// console.log(URL);
		// console.log('getting page:', page++);
		$http({
			method: 'JSONP',
			url: URL
		}).then(function(response){
			// console.log('then page:', page -1);
			var pictures = response.data;
			var parsedData = pictures.data;
			var nextURL = pictures.pagination.next_url;
			for(var i=0; i<parsedData.length; i++){
				userMedia.push(parsedData[i]);
			}

			// last media request if no next_url property, means you're done
			if(!pictures.pagination.next_url){
				// get all likes
				getLikes(userMedia, deferred);
			}

			else{
				console.log('next:', nextURL);
				console.log('#photos:', userMedia.length);
				// recursion each following time
				eachRequest(nextURL+'&callback=JSON_CALLBACK');
			}
			// console.log(parsedData);
			// console.log('length is'+parsedData.data.length);
		},
		function (error) {
			console.log('ERROR',error);
		});

		return deferred.promise;
	}
};




//_________________________Getting Likes__________________________
function getLikes(userMedia, deferred){
	var counter = 0;
	var likes = [];

	// max number of photos, to avoid >100 api calls just to get like data
	var setMaxPhotos = 10;
	var numPhotosMax;
	if(userMedia.length<=setMaxPhotos){
		numPhotosMax = userMedia.length;
	}
	else{
		numPhotosMax = setMaxPhotos;
	}

	for(var j=0; j<numPhotosMax; j++) {
		var id = userMedia[j].id;
		// console.log(id);
		$http({
			method: 'JSONP',
			url: 'https://api.instagram.com/v1/media/'+id+'/likes?access_token='+token+'&callback=JSON_CALLBACK'
		}).then(function(response){
			// console.log(counter);
			var likeArr = response.data;
			// console.log(likeArr);
			likes.push(likeArr);
			likes.sort(function(a,b){return a.data.length-b.data.length;});
			// console.log('likes array sorted is...', likes);
			userMedia[counter].likesFull = likeArr;
			counter++;
			// I cap off the photos to 50 to start off, to avoid so many api calls
			if(likes.length===numPhotosMax){
				console.log('sorted likes array is..', likes);
				// console.log('finished likes is', likes);
				userMedia.likes = likes;
				// console.log('user media is', userMedia);

				// now get user info 
				getUserInfo(userMedia, likes, deferred);
			}
		});
	}
}



function getUserInfo(userMedia, likes, deferred){
	// now get basic info about user

	$http({
		method: 'JSONP',
		url: 'https://api.instagram.com/v1/users/self/?access_token='+token+'&callback=JSON_CALLBACK'
	})
	.then(function(response){
		var userData = response.data.data;
		// var userId = userData.id;
		console.log('user DATA IS...', userData);

		// get follows of user
		getFollows(userMedia, likes, deferred, userData);
	});
}

function getFollows(userMedia, likes, deferred, userData){
	// instagram returns 50 follows at times, so need recursion again..
	var urlFollows = 'https://api.instagram.com/v1/users/'+userData.id+'/follows?access_token='+token+'&callback=JSON_CALLBACK';

	eachRequest(urlFollows);

	var follows = [];

	function eachRequest(url){
		$http({
			method: 'JSONP',
			url: url
		}).then(function(response){
			var followsObj = response.data;
			for(var i=0; i<followsObj.data.length; i++){
				follows.push(followsObj.data[i]);
			}
			var nextUrl = followsObj.pagination.next_url;

			if(nextUrl){
				eachRequest(nextUrl+'&callback=JSON_CALLBACK');
			}
			else if(!nextUrl){
				console.log('list of all follows is', follows);
				// no more follows, all done with getFollows function
				getFollowers(userMedia, likes, deferred, userData, follows);
			}
		});
	}
}

function getFollowers(userMedia, likes, deferred, userData, follows){

	var urlFollows = 'https://api.instagram.com/v1/users/'+userData.id+'/followed-by?access_token='+token+'&callback=JSON_CALLBACK';
	eachRequest(urlFollows);

	var followers = [];

	function eachRequest(url){
		$http({
			method: 'JSONP',
			url: url
		}).then(function(response){
			var followersObj = response.data;
			for(var i=0; i<followersObj.data.length; i++){
				followers.push(followersObj.data[i]);
			}
			var nextUrl = followersObj.pagination.next_url;

			if(nextUrl){
				eachRequest(nextUrl+'&callback=JSON_CALLBACK');
			}
			else if(!nextUrl){
				console.log('list of all followers is', followers);
				// no more follows, all done with getFollows function
				analyzeData(userMedia, likes, deferred, userData, follows, followers);
			}
		});
	}
}







function analyzeData(userMedia, likes, deferred, userData, follows, followers){

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









} // end of analyze data function





















// end of entire service function, don't go below this
}







