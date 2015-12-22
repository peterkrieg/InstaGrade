angular.module('myApp')
.controller('resultsCtrl', function($scope, reportService, userService, instaService, followService, $sce, $filter, $http){

	console.log('results controller loaded!');
	// 3 different states, to have loading status
	$scope.loadingUser = true;
	$scope.loadingMedia = true;
	$scope.loadingEverythingElse = true;



	




	reportService.getToken()
	.then(function(response){
		console.log('results controller getting response!');
		console.log(response.data);

	// if response is report, then user already has done report,
	// and not time to do new report (user.readyForReport is false)
	// or specific report clicked, delivered back here
	if(response.data.analytics){
		console.log('user already exists!!!');
		// make sure no specific report
		userService.toggleSpecificReport(null);
		var report = response.data;
		$scope.report = report;
		var user = response.data.user;
		user.newUser = false;
		loadingMessages(null, user);
	}
	// else if response is a user, means that user doesn't have report yet,
	// or valid for new report (new report button clicked, and has been 24 hrs)
	else if(response.data.numMedia){
		console.log('new user, need to do lots of api calls!');
		var user = response.data;
		var token = response.data.token;
		user.newUser = true;
		loadingMessages(token, user);
	}

	function loadingMessages(token, user){
		var token = token;
		var user = user;
		$scope.token = token;

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

		finishLoading(token, user);
	} // end of loading Messages function

	// once intermediary stuff of loading messages done,
	// if user is new, need to do all of api calls, 
	// (get media), otherwise skip all that and just prepare report
	// that was given from backend
	function finishLoading(token, user){
		if(user.newUser){
			console.log('user is new')
			getMedia(token, user);
		}
		else{
			console.log('user is not new');
			console.log(report);

			// need to do things that would be done in getMedia
			// since getMedia isn't fired, if user not new
			fixUrls(report.media);
			$scope.media = report.media
			.sort(function(a,b){return ((b.comments.count*2+b.likes.count)-(a.comments.count*2+a.likes.count));});
			$scope.loadingMedia = false;
			finishReportView(report);
		}
	}

})  // end of report service getting token/report





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
		$scope.report = report;

		// add user to backend, before report being added

		userService.addUser(report.user)
		.then(function(response){
			// want to do .then to make sure user is added,
			// before report checks for user already existing
			// now add report to backend
			console.log('about to add report!!!');
			console.log('this is step that is not working');
			reportService.addReport(report);

			// Need to make user not ready for another report now, since report added
			userService.toggleReadyForReport(false);
			userService.toggleSpecificReport(null);

			// can set up view now
			finishReportView(report);
		})

	})
}


//___________________________________________________
// variable definitions for functions, global variables
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
//__________________End variables___________________



//__________________Load More Function___________________
// have to declare loadMore function here becuase
// called later down
$scope.loadMore = function(category){
	// console.log('scope inside of load more is \n\n', $scope);
	// console.log('category is \t\t', category);
	// console.log($scope[category]);
	// console.log($scope.report.relationships[category]);

	// var count = calledTimes[category];
	calledTimes[category]++
	var count = calledTimes[category];
	// var clone = $scope.report.relationships[category].slice(0);
	for(var i=0; i<12*count; i++){
		var itemToAdd = $scope.clone[category].pop();
		if(itemToAdd){
			$scope[category].push(itemToAdd);
		}
		else{
			$scope.noMore[category] = true;
			return;
		}
	}
}  // end of load more function
//___________________________________________________





//____________Huge finishReportView Function____________
function finishReportView(report){





	// console.log(report);
	// $scope.report = report;

	$scope.clone = {
		uniqueFollows: $scope.report.relationships.uniqueFollows.slice(0),
		uniqueFollowers: $scope.report.relationships.uniqueFollowers.slice(0),
		likesComparisonArr: $scope.report.relationships.likesComparisonArr.slice(0)
	};



//__________________Analytics part_____________________

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

//____________________End analytics____________________



//_____________________Grade Part____________________
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
	$scope.loadMore("likesComparisonArr");

	// finally, everything else is revealed
	$scope.loadingEverythingElse = false;


} // end of finishReport view


///////////////////////////////////////////////////
//  end of finishReportView Function
//  now everything below this is run only on user
//  interaction, event driven
///////////////////////////////////////////////////




// unfollowing and following not working
// until instagram approves my app
// need to submit better application
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


// close example on likes comparison part
$scope.closeExample = function(){
	$('div.example').slideToggle(400);
}















});  // controller, nothing should go below this

