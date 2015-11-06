angular.module('myApp')
.service('instaService', instaFunc);
function instaFunc($http, $q){


	this.getInstaFeed= function(token){
		var deferred = $q.defer();

		var URL = 'https://api.instagram.com/v1/users/self/media/recent?access_token='+token+'&callback=JSON_CALLBACK';

		// empty array that will hold objects of 45 picture objects, or however many
		var userMedia = [];
		var page = 1;
		// first function call
		return eachRequest(URL);

		function eachRequest(URL){
			console.log(URL);
			console.log('getting page:', page++);
			$http({
				method: 'JSONP',
				url: URL
			}).then(function(response){
				console.log('then page:', page -1);
				var pictures = response.data;
				var parsedData = pictures.data;
				var nextURL = pictures.pagination.next_url;

				for(var i=0; i<parsedData.length; i++){
					userMedia.push(parsedData[i]);
				}


				//___________________________________________________	
				// last media request if no next_url property, means you're done
				if(!pictures.pagination.next_url){
					var counter = 0;
					var likes = [];
					// gets likes from all of user's photos, or 50 most recent, whichever case (to avoid hundreds of api calls, if users has lots of photos)


					// max number of photos, to avoid >100 api calls just to get like data
					var numPhotosMax;
					if(userMedia.length<=100){
						numPhotosMax = userMedia.length;
					}
					else{
						numPhotosMax = 100;
					}


					// numPhotosMax = 5;

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
							// console.log(userMedia[counter]);
							userMedia[counter].likesFull = likeArr;
							counter++;
							// I cap off the photos to 50 to start off, to avoid so many api calls
							if(likes.length===numPhotosMax){
								console.log('sorted likes array is..', likes);
								// console.log('finished likes is', likes);
								userMedia.likes = likes;
								// console.log('user media is', userMedia);
								deferred.resolve(userMedia);
							}
							// counter++;  
							// for when I'm using counter, instead of capping at 10 photos
						});


					}


					// var id = userMedia[0].id;
					// console.log(id);
					// $http({
					// 	method: 'JSONP',
					// 	url: 'https://api.instagram.com/v1/media/'+id+'/likes?access_token='+token+'&callback=JSON_CALLBACK'
					// }).then(function(response){
					// 	var likes = response.data;
					// 	userMedia.push(likes);
					// 	console.log('like media likes is', likes);
					// 	console.log(userMedia);


					// 	deferred.resolve(userMedia);

					// });

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




















}