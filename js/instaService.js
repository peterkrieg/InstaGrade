angular.module('myApp')
.service('instaService', instaFunc);

function instaFunc($http, $q, analyzeService){
// everything is inside instaFunc, so going to ignore indentation of wrapper function


this.getInstaFeed= function(token){
	var deferred = $q.defer();
	var URL = 'https://api.instagram.com/v1/users/self/media/recent?access_token='+token+'&callback=JSON_CALLBACK';
	// empty array that will hold objects of 45 picture objects, or however many
	var userMedia = [];

	// first function call
	return eachRequest(URL);


	function eachRequest(URL){
		$http({
			method: 'JSONP',
			url: URL
		}).then(function(response){
			var pictures = response.data;
			var parsedData = pictures.data;
			var nextURL = pictures.pagination.next_url;
			for(var i=0; i<parsedData.length; i++){
				userMedia.push(parsedData[i]);
			}

			// last media request if no next_url property, means you're done
			if(!pictures.pagination.next_url){
				// get all likes, moves program flow on long path..
				getLikes(userMedia, deferred);
			}
			else{
				// recursion each following time
				eachRequest(nextURL+'&callback=JSON_CALLBACK');
			}
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

			if(likes.length===numPhotosMax){
				userMedia.likes = likes;
				// console.log('user media is', userMedia);

				// now get user info 
				getUserInfo(userMedia, deferred);
			}
		});
	}
}



function getUserInfo(userMedia, deferred){
	// now get basic info about user

	$http({
		method: 'JSONP',
		url: 'https://api.instagram.com/v1/users/self/?access_token='+token+'&callback=JSON_CALLBACK'
	})
	.then(function(response){
		var userData = response.data.data;
		userMedia.userData = userData;

		// get follows of user
		getYourLikes(userMedia, deferred);
	});
}




function getYourLikes(userMedia, deferred){
	// instagram returns 20 of your likes at a time, so need recursion..
	var url = 'https://api.instagram.com/v1/users/self/media/liked?access_token='+token+'&callback=JSON_CALLBACK';
	var yourLikes = [];

	var maxApiCall = 5;
	var counter = 0;

	eachRequest(url);

	function eachRequest(url){
		$http({
			method: 'JSONP',
			url: url
		})
		.then(function(response){
			counter++;
			var responseObj = response.data;
			var likesArr = response.data.data;
			for(var i=0; i<likesArr.length; i++){
				yourLikes.push(likesArr[i]);
			}
			var nextUrl = responseObj.pagination.next_url;
			if(counter===maxApiCall || !nextUrl){
				userMedia.yourLikes = yourLikes;
				console.log('your likes is...', yourLikes);
				getFollows(userMedia, deferred);
			}
			else{
				eachRequest(nextUrl+'&callback=JSON_CALLBACK');
			}
		});
	}
}

function getFollows(userMedia, deferred){
	// instagram returns 50 follows at a time, so need recursion again..
	var url = 'https://api.instagram.com/v1/users/'+userMedia.userData.id+'/follows?access_token='+token+'&callback=JSON_CALLBACK';
	var follows = [];

	eachRequest(url);

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
				userMedia.follows = follows;
				getFollowers(userMedia, deferred);
			}
		});
	}
}

function getFollowers(userMedia, deferred){

	var url = 'https://api.instagram.com/v1/users/'+userMedia.userData.id+'/followed-by?access_token='+token+'&callback=JSON_CALLBACK';
	eachRequest(url);

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
				userMedia.followers = followers;
				analyzeData(userMedia, deferred);
			}
		});
	}
}




function analyzeData(userMedia, deferred){

	// this function just passes onto different service

	analyzeService.analyzeData(userMedia, deferred);

} // end of analyze data function





// end of entire service function, don't go below this
}







