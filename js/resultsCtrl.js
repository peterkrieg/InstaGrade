angular.module('myApp')
	.controller('resultsCtrl', function($scope, tokenService, instaService, $sce){
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

			$scope.name = userMedia.name;
			$scope.userPic = userMedia.userPic;
			console.log(userMedia);


			//_________________________prepares userMedia for View__________________________

			console.log(typeof userMedia.numPics);
			console.log(userMedia.numPics);


			userMedia.numPics ? $scope.pics = true : $scope.pics = false;
			userMedia.numVids ? $scope.vids = true : $scope.vids = false;


			//_________________________Set up popular pics__________________________

			$scope.popularPics = [];
			$scope.noMorePics = false;

			$scope.getPopularPics = function(){
				for(var i=0; i<6; i++){
					var picToAdd = userMedia.popularPics.pop();
					if(picToAdd){
						$scope.popularPics.push(picToAdd);
					}
					else{
						$scope.noMorePics = true;
						return;
					}
				}
			};

			$scope.getPopularPics();
			// console.log($scope.popularPics);
			// console.log('pouplar vids is', userMedia.popularVids);



			//_________________________Fix videos URL__________________________

			$scope.fixUrls = function(){
				for(var i=0; i<userMedia.popularVids.length; i++){
					var currentVid = userMedia.popularVids[i];
					console.log(currentVid);
					currentVid.safeurl = $sce.trustAsResourceUrl(currentVid.videos.standard_resolution.url);
				}



			};

			$scope.fixUrls();








			//_________________________Set up popular vids__________________________

			$scope.popularVids = [];
			$scope.noMoreVids = false;

			$scope.getPopularVids = function(){
				for(var i=0; i<6; i++){
					var vidToAdd = userMedia.popularVids.pop();
					if(vidToAdd){
						$scope.popularVids.push(vidToAdd);
					}
					else{
						$scope.noMoreVids = true;
						return;
					}
				}
			};

			$scope.getPopularVids();

			console.log($scope.popularVids);
			console.log($scope.popularVids[1].videos.standard_resolution.url);










































		});








	});