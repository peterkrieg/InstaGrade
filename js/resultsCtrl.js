angular.module('myApp')
	.controller('resultsCtrl', function($scope, tokenService, instaService){
		$scope.loading = true;

		// var token = instaService.getToken();
		// console.log(token);

		// delete the stuff after || when done with dev
		var token = tokenService.getToken() || '1359984932.c4fe6f4.32721a77599f4b11b20c1f2ffcbedab2';
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