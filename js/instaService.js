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

				// last media request if no next_url property, means you're done
				if(!pictures.pagination.next_url){
					// alert('whats');
					deferred.resolve(userMedia);
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