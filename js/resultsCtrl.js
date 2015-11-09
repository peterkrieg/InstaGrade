angular.module('myApp')
	.controller('resultsCtrl', function($scope, tokenService, instaService){
		$scope.loading = true;

		// var token = instaService.getToken();
		// console.log(token);

		var token = tokenService.getToken();
		// console.log(token);


		//____________Now that token is received, get instagram media, big array of objects______________________

		instaService.getInstaFeed(token).then(function(userMedia){
			// console.log('user media received from service is ... see below');
			// console.log(userMedia);
			$scope.loading = false;
			$scope.userMedia = userMedia;
			// $scope.userMedia =userMedia;
		});








	});