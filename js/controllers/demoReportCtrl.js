angular.module('myApp')
.controller('demoReportCtrl', demoReportCtrlFunc);

function demoReportCtrlFunc($scope, demoService, reportService, userService, instaService, followService, $sce, $filter, $http, $stateParams) {
//make page scroll to top, weird thing with loading when page scrolled down
	window.scroll(0,0)



console.log('demo report ctrl func');

// setting up demo user scope

$scope.user = {
	name: 'Demo User',
	profilePicture: '../demo/profilesmall.jpg'
};


$scope.loadingUser = false;
$scope.loading = true;
$scope.loadingMedia = true;
$scope.loadingEverythingElse = true;

console.log($stateParams);

// if there is a report Id sent to controller, means that need to load specific report
if($stateParams.reportId){
	demoService.getSpecificReport($stateParams.reportId)
	.then(function(report){
		$scope.report=report;
		setUpView(report);;
	})
}
// if no report Id, get the last demo report (which I will manually change, to make more recent over time)
else{
	demoService.getLastDemoReport()
	.then(function(report){
		// console.log(report);
		$scope.report = report;
		setUpView(report);
	}); 
}


function setUpView(report){
	$scope.media = report.media;
	$scope.user.numMedia = report.media.length;
	fixUrls($scope.media);
	finishReportView(report);
}













	// fixing video URLs, weird angular thing..
	function fixUrls(media){
		for(var i=0; i<media.length; i++){
			var currentVid = media[i];
			if(currentVid.type==="video"){
				currentVid.safeurl = $sce.trustAsResourceUrl(currentVid.videos.standard_resolution.url);
			}
		}
	};




// close example on likes comparison part
$scope.closeExample = function(){
	$('div.example').slideToggle(400);
};



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






///////////////////////////////////////////////////
//  Huge finish report view, copied from reportCtrl
///////////////////////////////////////////////////

function finishReportView(report){

	//_________________________Relationships part__________________________

	$scope.clone = {
		uniqueFollows: $scope.report.relationships.uniqueFollows.slice(0),
		uniqueFollowers: $scope.report.relationships.uniqueFollowers.slice(0),
		likesComparisonArr: $scope.report.relationships.likesComparisonArr.slice(0)
	};

	var likesComparisonArr = $scope.report.relationships.likesComparisonArr;
	for(var i=0; i<likesComparisonArr.length; i++){
		var friend = likesComparisonArr[i];
		if(friend.mostLikesReceived){
			$scope.mostLikesReceived = friend;
			console.log($scope.mostLikesReceived);
			break;
		}
	}



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

$scope.scores = report.grade.scores;
console.log('scores is \n\n')
console.log($scope.scores);
var letterGrade = calculateLetterGrade($scope.scores.overallScore);
$scope.scores.overallScoreLetter = letterGrade;




	// loads initial for 4 categories
	$scope.loadMore("uniqueFollows");
	$scope.loadMore("uniqueFollowers");
	$scope.loadMore("likesComparisonArr");

	// finally, everything else is revealed
	$scope.loadingEverythingElse = false;
	$scope.loading = false;
	$scope.loadingMedia = false;

} // end of finishReport view




function calculateLetterGrade(numberGrade){
	numberGrade = Math.round(numberGrade);
	if(numberGrade<60){
		return "F";
	}
	if(numberGrade>99){
		return "A+";
	}
	var numbers = [6, 7, 8, 9];
	var letters = ["D", "C", "B", "A"];

	var firstNumber = Number(numberGrade.toString()[0]);

	var index = numbers.indexOf(firstNumber);

	var letter = letters[index];
	var symbol;

	// now find if grade has -, +, or nothing
	if(numberGrade%10<10){
		symbol = '+';
	}
	if(numberGrade%10<7){
		symbol='';
	}
	if(numberGrade%10<3){
		symbol='-';
	}

	// concatenate the "B" and "+", ie
	var letterGrade = letter+symbol;
	return letterGrade;
	// console.log(letterGrade);
}
































} // end of controlller function, nothing below this








