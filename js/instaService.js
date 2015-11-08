angular.module('myApp')
.service('instaService', instaFunc);

function instaFunc($http, $q, analyzeService){
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
			console.log(parsedData);
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

	// this function just passes onto different service

	analyzeService.analyzeData(userMedia, likes, deferred, userData, follows, followers);

} // end of analyze data function





// end of entire service function, don't go below this
}







