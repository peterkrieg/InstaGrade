angular.module('myApp')
.controller('resultsCtrl', function($scope, tokenService, instaService, $sce){

	$scope.loadingMedia = true;
	$scope.loadingEverythingElse = true;
	
// var token = instaService.getToken();
// console.log(token);

// delete the stuff after || when done with dev
// var token = tokenService.getToken() || '1359984932.c4fe6f4.32721a77599f4b11b20c1f2ffcbedab2';

tokenService.getToken()
.then(function(response){
	console.log(response.data);
	var token = response.data;
	preparePage(token);
})



// console.log(token);


//____________Now that token is received, get instagram media, big array of objects______________________


function preparePage(token){
	console.log(token);
	var token = token;


	instaService.getInstaFeed(token).then(function(userMedia){
	// console.log('user media received from service is ... see below');
	// console.log(userMedia);
	$scope.loading = false;
	$scope.userMedia = userMedia;

	$scope.name = userMedia.name;
	$scope.userPic = userMedia.userPic;
	console.log(userMedia);


	//_________________________prepares userMedia for View__________________________

	// console.log(typeof userMedia.numPics);
	// console.log(userMedia.numPics);


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

	//_________________________Fix videos URL__________________________

	$scope.fixUrls = function(){
		for(var i=0; i<userMedia.popularVids.length; i++){
			var currentVid = userMedia.popularVids[i];
					// console.log(currentVid);
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


	//_________________________Relationships Section__________________________

	$scope.uniqueFollows = [];
	$scope.noMoreFollows = false;
	$scope.getUniqueFollows = function(){
		for(var i=0; i<12; i++){
			var followToAdd = userMedia.uniqueFollows.pop();
			if(followToAdd){
				$scope.uniqueFollows.push(followToAdd);
			}
			else{
				$scope.noMoreFollows = true;
				return;
			}
		}
	};

	$scope.getUniqueFollows();

	// console.log($scope.uniqueFollows);

	//_________________________Unique Followers__________________________

	$scope.uniqueFollowers = [];
	$scope.noMoreFollowers = false;

	$scope.getUniqueFollowers = function(){
		for(var i=0; i<12; i++){
			var followerToAdd = userMedia.uniqueFollowers.pop();
			if(followerToAdd){
				$scope.uniqueFollowers.push(followerToAdd);
			}
			else{
				$scope.noMoreFollowers = true;
				return;
			}
		}
	};

	$scope.getUniqueFollowers();


	//_________________________User Likers__________________________

	// $scope.userLikersArr = userMedia.userLikersArr;

	$scope.userLikers = [];
	$scope.noMoreLikers = false;

	$scope.getLikers = function(){
		for(var i=0; i<12; i++){
			var likerToAdd = userMedia.userLikersArr.pop();
			if(likerToAdd){
				$scope.userLikers.push(likerToAdd);
			}
			else{
				$scope.noMoreLikers = true;
				return;
			}
		}
	};

	$scope.getLikers();

	// console.log(userMedia.userLikersArr);



	


	//_____________________Get top users you've liked______________________

	console.log(userMedia.yourLikesUsers);
	console.log(userMedia.yourLikesUsersArr);

	$scope.yourLikesUsersArr = [];
	$scope.noMoreLikesUsers = false;

	$scope.getYourLikesUsers = function(){
		for(var i=0; i<12; i++){
			var yourLikeUserToAdd = userMedia.yourLikesUsersArr.pop();
			if(yourLikeUserToAdd){
				$scope.yourLikesUsersArr.push(yourLikeUserToAdd);
			}
			else{
				$scope.noMoreLikesUsers = true;
				return;
			}
		}
	};

	$scope.getYourLikesUsers();













































}); // end of instaservice

} // end of prepare page








});