angular.module('myApp')
.service('instaService', instaFunc);

function instaFunc($http, $q, analyzeService){
// everything is inside instaFunc, so going to ignore indentation of wrapper function


this.getMedia = function(token, user){
	var deferred = $q.defer();
	var URL = 'https://api.instagram.com/v1/users/self/media/recent?access_token='+token+'&callback=JSON_CALLBACK';
	// empty big report object.  Will be passed around until
	// completed, and eventuallly changed slightly, then
	// submitted to database.
	var report = {
		user: user,
		media: [],
		relationships: {},
		grade: {},
		analytics: {},
		map: {}
	};

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
				report.media.push(parsedData[i]);
			}

			// last media request if no next_url property, means you're done
			if(!pictures.pagination.next_url){
				// console.log('last of media, now token is ', token);
				// get all likes, moves program flow on long path..
				deferred.resolve(report);
			}
			else{
				// recrsion each following time
				eachRequest(nextURL+'&callback=JSON_CALLBACK');
			}
		},
		function (error) {
			console.log('ERROR',error);
		});

		return deferred.promise;
	}



}; // end of get media function

//______________Next step, once media loaded_________________

// max api call for getting likers of your media, and stuff you have liked
var maxApiCall = 5;


this.getOtherData = function(token, report){
	var deferred = $q.defer();
	getLikesReceived(token, report, deferred);
	return deferred.promise;
}



//_______Getting Likes on Your Media__________________________
// This only returns most recent 120 likes, 
// no way to get around this, unless I want to cache and 
// check later, seems like too much work
function getLikesReceived(token, report, deferred){
	var media = report.media;
	// console.log('get likes token is ', token);
	var counter = 0;
	var likesReceived = [];

	// max number of photos, either maxapi call, or less
	var numPhotosMax;
	if(media.length<=maxApiCall){
		numPhotosMax = media.length;
	}
	else{
		numPhotosMax = maxApiCall;
	}

	for(var i=0; i<numPhotosMax; i++) {
		var id = media[i].id;
		// console.log(id);
		$http({
			method: 'JSONP',
			url: 'https://api.instagram.com/v1/media/'+id+'/likes?access_token='+token+'&callback=JSON_CALLBACK'
		}).then(function(response){
			// console.log(counter);

			//____likeArr is array of likes for each media____
			var likeArr = response.data.data;
			// console.log(likeArr);
			// attached full likes arr to each media, 
			media[counter].likesFull = likeArr;

			// updating report that will be passed around
			report.media = media;



			// adding likes from each media to full big likes arr
			likesReceived.push(likeArr);
			// all likes is array of arrays, length is number
			// of photos, for max media
			// [[like1, like2, like3], [like1, like2], [], etc]

			counter++;

			if(likesReceived.length===numPhotosMax){
				report.relationships.likesReceived = likesReceived;

				// now get user info 
				// deferred.resolve(report);
				getLikesGiven(token, report, deferred);
			}
		});
	}
}


function getLikesGiven(token, report, deferred){
	// instagram returns 20 of your likes at a time, so need recursion..
	var url = 'https://api.instagram.com/v1/users/self/media/liked?access_token='+token+'&callback=JSON_CALLBACK';
	var likesGiven = [];

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
				likesGiven.push(likesArr[i]);
			}
			var nextUrl = responseObj.pagination.next_url;
			if(counter===maxApiCall || !nextUrl){
				report.relationships.likesGiven = likesGiven;
				// console.log('your likes given is...', likesGiven);
				getFollows(token, report, deferred);
			}
			else{
				eachRequest(nextUrl+'&callback=JSON_CALLBACK');
			}
		});
	}
}





function getFollows(token, report, deferred){
	// instagram returns 50 follows at a time, so need recursion again..
	var url = 'https://api.instagram.com/v1/users/self/follows?access_token='+token+'&callback=JSON_CALLBACK';
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
				// console.log('follows is... ', follows);
				report.relationships.follows = follows;
				getFollowers(token, report, deferred);
			}
		});
	}
}

function getFollowers(token, report, deferred){

	var url = 'https://api.instagram.com/v1/users/self/followed-by?access_token='+token+'&callback=JSON_CALLBACK';
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
				// console.log('followers is, ', followers)
				report.relationships.followers = followers;
				// don't need the token, anymore, since no more
				// instagram HTTP requests
				analyzeData(report, deferred);
			}
		});
	}
}


function analyzeData(report, deferred){

	// this function just passes onto different service,
	// analyzeservice is pure vanilla JS, no http calls
	// processes data, to form the grade, and other parts of report

	analyzeService.analyzeData(report, deferred);

} // end of analyze data function


}// end of entire service function, don't go below this


