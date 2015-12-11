angular.module('myApp')
.controller('resultsCtrl', function($scope, reportService, instaService, followService, $sce, $filter){

	$scope.loadingUser = true;
	$scope.loadingMedia = true;
	$scope.loadingEverythingElse = true;
	
// delete the stuff after || when done with dev
// var token = tokenService.getToken() || '1359984932.c4fe6f4.32721a77599f4b11b20c1f2ffcbedab2';





reportService.getToken()
.then(function(response){
	// console.log(response);
	var user = response.data;
	var token = response.data.token;
	$scope.token = token;
	// var user = response.data.profile._json.data;
	// console.log(user);

	// console.log('edited user is', userEdited);

	var numMedia = user.numMedia;
	var numFollows = user.numFollows;
	var numFollowers = user.numFollowers;

	// binding to scope, the entire edited user
	$scope.user = user;
	$scope.loadingUser = false;


	
	//______________Media Messages for loading_______________
	var mediaMessages = {
		fast: 'You have '+numMedia+' pieces of media.  This should only take a few moments',
		medium: 'You have '+numMedia+' pieces of media.  This shouldn\'t take too long',
		slow: 'Wow!  You have '+numMedia+' pieces of media.  We\'re taking care of this as fast as we can, but this might take a minute or two'
	};
	var otherLoadingMessages = {
		fast: 'You have '+numFollowers+' followers and follow '+numFollows+' users.  This should only take a few moments',
		medium: 'You have '+numFollowers+' followers and follow '+numFollows+' users.  This shouldn\'t take too long',
		slow: 'Wow!  You have '+numFollowers+' followers and follow '+numFollows+' users.  We\'re taking care of this as fast as we can, but this might take a minute or two'
	};


	if(numMedia<100){
		$scope.loadingMediaMessage = mediaMessages.fast;
	}
	else if(numMedia>100 && numMedia<300){
		$scope.loadingMediaMessage = mediaMessages.medium;
	}
	else if(numMedia>300){
		$scope.loadingMediaMessage = mediaMessages.slow;
	}
	if(numFollowers <=200 && numFollows<=200){
		$scope.otherLoadingMessage = otherLoadingMessages.fast;
	}
	else if(numFollowers>=1000 || numFollows>= 1000){
		$scope.otherLoadingMessage = otherLoadingMessages.slow;
	}
	else if(numFollowers<1000 || numFollows<1000){
		$scope.otherLoadingMessage = otherLoadingMessages.medium;
	}
	//______________End of loading messages______________


	getMedia(token, user);

})  // end of prepare report





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

		// now submit report to backend, and store on given user

		reportService.addReport(report);




		// report now received, can set up view now
		finishReportView(report);
	})
}


//___________________________________________________



// variable definitions for functions
var calledTimes = {
	uniqueFollows: 0,
	uniqueFollowers: 0,
	userLikersArr: 0,
	yourLikesUsersArr: 0,
	likesComparisonArr: 0
};

$scope.noMore = {
	uniqueFollows: false,
	uniqueFollowers: false,
	userLikersArr: false,
	yourLikesUsersArr: false,
	likesComparisonArr: false
};

$scope.uniqueFollows = [];
$scope.uniqueFollowers = [];
$scope.userLikersArr = [];
$scope.yourLikesUsersArr = [];
$scope.likesComparisonArr = [];


$scope.loadMore = function(category){
	// console.log('scope inside of load more is \n\n', $scope);
	// console.log('category is \t\t', category);
	// console.log($scope[category]);
	// console.log($scope.report.relationships[category]);

	// var count = calledTimes[category];
	calledTimes[category]++
	var count = calledTimes[category];
	for(var i=0; i<12*count; i++){
		var itemToAdd = $scope.report.relationships[category].pop();
		if(itemToAdd){
			$scope[category].push(itemToAdd);
		}
		else{
			$scope.noMore[category] = true;
			return;
		}
	}
}  // end of load more function



function finishReportView(report){
	// console.log(report);
	$scope.report = report;

	// relationships part__

	// $scope.showExample = true;




// analytics part

// getting current tags for chart
var tagsArr = $scope.report.analytics.allTagsArr;

var tagsGroupsNames = [];
var tagsGroupsCounts = [];

var index = -1;
for(var i=0; i<tagsArr.length; i++){
	// if there are still tags
	if(tagsArr[i]){
		var hashtag = tagsArr[i].hashtag;
		var count = tagsArr[i].count;
		if(i%12===0){
			index++;
			tagsGroupsNames.push([hashtag]);
			tagsGroupsCounts.push([count]);
		}
		else{
			tagsGroupsNames[index].push(hashtag);
			tagsGroupsCounts[index].push(count);
		}
	}
	// if there are no more tags, just exit the for loop
	else{
		break;
	}
}


$scope.noMoreLeft = true;
$scope.noMoreRight = false;
$scope.index = 0;




var currentTags = tagsGroupsNames[0];
var currentTagsCounts = tagsGroupsCounts[0];





$scope.report.analytics.currentTags = currentTags;
$scope.report.analytics.currentTagsCounts = currentTagsCounts;

$scope.report.analytics.tagsGroupsNames = tagsGroupsNames;
$scope.report.analytics.tagsGroupsCounts = tagsGroupsCounts;











//___ Grade Part ___
var selfLikesPercentage = $filter('number')(report.grade.selfLikesRatio*100, 1);


var selfLikesRatio = report.grade.selfLikesRatio;
if(selfLikesRatio===0){
	$scope.likesRatioMessage = "Wow, you haven't liked a single one of your photos!  Thank you for "
}
if(selfLikesRatio<.2){
	$scope.likesRatioMessage = "Congrats, you must not be very self-centered!  You have only liked "
	+report.grade.numSelfLikes+" ("+selfLikesPercentage+"%) of your media.  ";
}
else if(selfLikesRatio<.5){
	$scope.likesRatioMessage = "Okay, you've liked "
	+report.grade.numSelfLikes+" ("+selfLikesPercentage+"%) of your media.  Not too high, but try to be a little ";
}











	// loads initial for 4 categories
	$scope.loadMore("uniqueFollows");
	$scope.loadMore("uniqueFollowers");
	$scope.loadMore("userLikersArr");
	$scope.loadMore("yourLikesUsersArr");
	$scope.loadMore("likesComparisonArr");

	$scope.loadingEverythingElse = false;


} // end of finishReportView Function


// Now views have finished loading, everything else
// is event-driven

$scope.unfollowUser = function(id){
	// console.log('follow user fired!, id is ', id);
	followService.unfollowUser(id, $scope.token)
		// .then(function(response){
		// 	console.log(response.data);
		// });





}

$scope.followUser = function(id){
	// console.log('follow user fired, id is', id);
	followService.followUser(id)
		// .then(function(response){
		// 	console.log(response.data);
		// });
}


$scope.closeExample = function(){
	$('div.example').slideToggle(400);


}




//__________Analytics part, cycling through hashtags________________

$scope.cycleThroughTags = function(direction){
	var tagsGroupsCounts = $scope.report.analytics.tagsGroupsCounts;
	var tagsGroupsNames = $scope.report.analytics.tagsGroupsNames;


	if(direction==='right'){
		console.log('right');
		if(tagsGroupsCounts[$scope.index+1]){
			$scope.index++;
			$scope.report.analytics.currentTags = tagsGroupsNames[$scope.index];
			$scope.report.analytics.currentTagsCounts = tagsGroupsCounts[$scope.index];
			$scope.noMoreLeft = false;

			if(!tagsGroupsCounts[$scope.index+1]){
				$scope.noMoreRight = true;
			}
			// $scope.$apply();

		}

	}
	else if(direction==='left'){
		alert('left!!');
	}
}


























});  // controller, nothing should go below this

