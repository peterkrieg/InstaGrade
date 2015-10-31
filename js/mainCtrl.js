angular.module('myApp')
	.controller('mainCtrl', ctrlFunc);

	function ctrlFunc($scope, instaService){
		var homeURL = 'http://peterkrieg.com/insta';

		// function just gets token, based on when user grants insta permission to get info
		$scope.getToken = function(){
			var url = window.location.href.toString();
			var token = url.split('#access_token=')[1];  // gets access token given by instagram
			console.log('access token is '+token);
			// changes page URL back to home page, instead of messy token attached.  doesn't reload page 
			// window.history.pushState({}, 'Title', homeURL);
			// alert('changed URL?');
			return token;
		};
		var token = $scope.getToken();

		//____________Now that token is received, get instagram media, big array of objects______________________

		instaService.getInstaFeed(token).then(function(userMedia){
			console.log('user media received from service is ... see below');
			console.log(userMedia);
			$scope.userMedia = userMedia;
			// $scope.userMedia =userMedia;
		});


	}