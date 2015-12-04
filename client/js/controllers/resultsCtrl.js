angular.module('myApp')
.controller('resultsCtrl', function($scope, prepareReport, instaService, $sce){

	$scope.loadingMedia = true;
	$scope.loadingEverythingElse = true;
	
// var token = instaService.getToken();
// console.log(token);

// delete the stuff after || when done with dev
// var token = tokenService.getToken() || '1359984932.c4fe6f4.32721a77599f4b11b20c1f2ffcbedab2';

prepareReport.getToken()
.then(function(response){
	var token = response.data.token;
	var user = response.data.profile._json.data;
	// console.log(user);

	var userEdited = prepareReport.startReport(user);
	console.log('edited user is', userEdited);

	var numMedia = userEdited.numMedia;

	// binding to scope, the entire edited user
	$scope.user = userEdited;


	

	var mediaMessages = {
		fast: 'You have '+numMedia+' pieces of media.  This should only take a few moments',
		medium: 'You have '+numMedia+' pieces of media.  This shouldn\'t take too long',
		slow: 'Wow!  You have '+numMedia+' pieces of media.  We\'re taking care of this as fast as we can, but this might take a minute or two'
	}

	if(numMedia<100){
		$scope.loadingMediaMessage = mediaMessages.fast;
	}
	else if(numMedia>100 && numMedia<300){
		$scope.loadingMediaMessage = mediaMessages.medium;
	}
	else if(numMedia>300){
		$scope.loadingMediaMessage = mediaMessages.slow;
	}
	// console.log($scope.user);
	$scope.token = token;
	getMedia(token, userEdited);
})














//_______Gets media, for first tab of results ______________
function getMedia(token, user){
	instaService.getMedia(token, user)
	.then(function(report){
		console.log('REPORT RECEIVED OF JUST MEDIA IS \n\n', report);

		fixUrls(report.media);

		// sorts media by popularity, when first loaded, then directive for controls takes over
		$scope.media = report.media
		.sort(function(a,b){return ((b.comments.count*2+b.likes.count)-(a.comments.count*2+a.likes.count));});
		$scope.loadingMedia = false;

		getOtherData(token, report);


	})
};

// fixing video URLs, weird angular thing..
function fixUrls(media){
	for(var i=0; i<media.length; i++){
		var currentVid = media[i];
		if(currentVid.type==="video"){
			currentVid.safeurl = $sce.trustAsResourceUrl(currentVid.videos.standard_resolution.url);
		}
	}
};

function getOtherData(token, report){
	instaService.getOtherData(token, report)
	.then(function(report){
		console.log('FINAL REPORT RECEIVED IS \n\n', report);

	})



}














}); // end of controller main function, nothing below this









// // console.log(token);


// //____________Now that token is received, get instagram media, big array of objects______________________


// function preparePage(token){
// 	console.log(token);
// 	var token = token;


// 	instaService.getInstaFeed(token).then(function(userMedia){
// 	// console.log('user media received from service is ... see below');
// 	// console.log(userMedia);
// 	$scope.loading = false;
// 	$scope.userMedia = userMedia;

// 	$scope.name = userMedia.name;
// 	$scope.userPic = userMedia.userPic;
// 	console.log(userMedia);


// 	//_________________________prepares userMedia for View__________________________

// 	// console.log(typeof userMedia.numPics);
// 	// console.log(userMedia.numPics);


// 	userMedia.numPics ? $scope.pics = true : $scope.pics = false;
// 	userMedia.numVids ? $scope.vids = true : $scope.vids = false;


// 	//_________________________Set up popular pics__________________________
// 	$scope.popularPics = [];
// 	$scope.noMorePics = false;

// 	$scope.getPopularPics = function(){
// 		for(var i=0; i<6; i++){
// 			var picToAdd = userMedia.popularPics.pop();
// 			if(picToAdd){
// 				$scope.popularPics.push(picToAdd);
// 			}
// 			else{
// 				$scope.noMorePics = true;
// 				return;
// 			}
// 		}
// 	};
// 	$scope.getPopularPics();

// 	//_________________________Fix videos URL__________________________

// 	$scope.fixUrls = function(){
// 		for(var i=0; i<userMedia.popularVids.length; i++){
// 			var currentVid = userMedia.popularVids[i];
// 					// console.log(currentVid);
// 					currentVid.safeurl = $sce.trustAsResourceUrl(currentVid.videos.standard_resolution.url);
// 				}
// 			};
// 			$scope.fixUrls();

// 	//_________________________Set up popular vids__________________________

// 	$scope.popularVids = [];
// 	$scope.noMoreVids = false;
// 	$scope.getPopularVids = function(){
// 		for(var i=0; i<6; i++){
// 			var vidToAdd = userMedia.popularVids.pop();
// 			if(vidToAdd){
// 				$scope.popularVids.push(vidToAdd);
// 			}
// 			else{
// 				$scope.noMoreVids = true;
// 				return;
// 			}
// 		}
// 	};

// 	$scope.getPopularVids();


// 	//_________________________Relationships Section__________________________

// 	$scope.uniqueFollows = [];
// 	$scope.noMoreFollows = false;
// 	$scope.getUniqueFollows = function(){
// 		for(var i=0; i<12; i++){
// 			var followToAdd = userMedia.uniqueFollows.pop();
// 			if(followToAdd){
// 				$scope.uniqueFollows.push(followToAdd);
// 			}
// 			else{
// 				$scope.noMoreFollows = true;
// 				return;
// 			}
// 		}
// 	};

// 	$scope.getUniqueFollows();

// 	// console.log($scope.uniqueFollows);

// 	//_________________________Unique Followers__________________________

// 	$scope.uniqueFollowers = [];
// 	$scope.noMoreFollowers = false;

// 	$scope.getUniqueFollowers = function(){
// 		for(var i=0; i<12; i++){
// 			var followerToAdd = userMedia.uniqueFollowers.pop();
// 			if(followerToAdd){
// 				$scope.uniqueFollowers.push(followerToAdd);
// 			}
// 			else{
// 				$scope.noMoreFollowers = true;
// 				return;
// 			}
// 		}
// 	};

// 	$scope.getUniqueFollowers();


// 	//_________________________User Likers__________________________

// 	// $scope.userLikersArr = userMedia.userLikersArr;

// 	$scope.userLikers = [];
// 	$scope.noMoreLikers = false;

// 	$scope.getLikers = function(){
// 		for(var i=0; i<12; i++){
// 			var likerToAdd = userMedia.userLikersArr.pop();
// 			if(likerToAdd){
// 				$scope.userLikers.push(likerToAdd);
// 			}
// 			else{
// 				$scope.noMoreLikers = true;
// 				return;
// 			}
// 		}
// 	};

// 	$scope.getLikers();

// 	// console.log(userMedia.userLikersArr);






// 	//_____________________Get top users you've liked______________________

// 	console.log(userMedia.yourLikesUsers);
// 	console.log(userMedia.yourLikesUsersArr);

// 	$scope.yourLikesUsersArr = [];
// 	$scope.noMoreLikesUsers = false;

// 	$scope.getYourLikesUsers = function(){
// 		for(var i=0; i<12; i++){
// 			var yourLikeUserToAdd = userMedia.yourLikesUsersArr.pop();
// 			if(yourLikeUserToAdd){
// 				$scope.yourLikesUsersArr.push(yourLikeUserToAdd);
// 			}
// 			else{
// 				$scope.noMoreLikesUsers = true;
// 				return;
// 			}
// 		}
// 	};

// 	$scope.getYourLikesUsers();













































// }); // end of instaservice

// } // end of prepare page








// });