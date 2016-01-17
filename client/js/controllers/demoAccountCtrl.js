angular.module('myApp')
.controller('demoAccountCtrl', profileFuncDemo);

function profileFuncDemo($scope, demoService, reportService, userService, $state, $interval, $filter){
	// scroll to top of page, make sure things visible
	window.scroll(0,0);

	// console.log(user);
	// $scope.user = user;
	$scope.errorNotDay = false;

	// loading state variables
	$scope.loadingStats = true;

	$scope.user = {
		name: 'Demo User',
		profilePicture: '../demo/profilesmall.jpg'
	};

	$scope.loadingUser = false;



	// little utility function used for turning on/off error message
	$scope.toggleError = function(value){
		$scope.errorNotDay = value;
		// if closing error box, need to make sure to cancel
		// $interal, otherwise will be skipping down 2, 3, 4, .. n sec at time, 
		// depending on n times user clicked new report button 
		// (cumulative intervals adding up, strange bug)
		if(value===false){
			$interval.cancel($scope.timer);
		}
	};

	$scope.newReport = function(){
		alert("Sorry, You Can't do That In Demo Mode!");
	}; // end of new Report function

	$scope.loadSpecificReport = function(reportId){
		$state.go('demoReport.media', {reportId: reportId});

	}; // end of load specific report function


// loading stats page, most of logic is in stats graph directive


// loading stats page, most of logic is in stats graph directive
demoService.getStatsDemo()
.then(function(stats){
	$scope.stats = stats;
	// reverse stats, to show newest dates at top
	// stats.reverse();
	$scope.statsReversed = stats.slice(0);
	$scope.statsReversed.reverse();

	$scope.loadingStats = false;

	// first selected item is number likes given, by default
	$scope.selectedItem = "numLikesGiven";

	// once done with stats, get relationships
	getRelationships();


}) // end of getting stats





function getRelationships(){
	// just filling with dummy data, for showing
	$scope.unfollows = [{
		date1: "2015-12-29T18:05:04.352Z",
		date2: "2015-12-30T23:05:55.168Z",
		user: {
			full_name: "Alexandra Smith",
			id: 12345678,
			profile_picture: "http://api.randomuser.me/portraits/med/women/39.jpg",
			username: 'demoaccount'
		}
	},
	{
		date1: "2015-12-24T15:05:03.345Z",
		date2: "2015-12-27T18:05:03.345Z",
		user: {
			full_name: "Jack Unfollower!",
			id: 12345,
			profile_picture: "http://api.randomuser.me/portraits/med/men/20.jpg",
			username: 'demo account'
		}
	},
	{
		date1: "2016-01-15T08:27:50.635Z",
		date2: "2016-01-17T10:30:50.635Z",
		user: {
			full_name: "Samantha Something",
			id: 22,
			profile_picture: "http://api.randomuser.me/portraits/med/women/50.jpg",
			username: 'demo account'
		}
	}

	];

	demoService.getLastDemoReport()
	.then(function(report){
		$scope.report = report;
		setUpView();
	})





} // get relationships function





function setUpView(){

///////////////////////////////////////////////////
//  stuff copied from report Ctrl
///////////////////////////////////////////////////
//___________________________________________________
// variable definitions for functions, global variables
var calledTimes = {
	uniqueFollows: 0,
	uniqueFollowers: 0,
};

$scope.noMore = {
	uniqueFollows: false,
	uniqueFollowers: false,
};

$scope.uniqueFollows = [];
$scope.uniqueFollowers = [];
//__________________End variables___________________



//__________________Load More Function___________________
// have to declare loadMore function here becuase
// called later down
$scope.loadMore = function(category){
	calledTimes[category]++
	var count = calledTimes[category];

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
//  end copied stuff
///////////////////////////////////////////////////

$scope.clone = {
	uniqueFollows: $scope.report.relationships.uniqueFollows.slice(0),
	uniqueFollowers: $scope.report.relationships.uniqueFollowers.slice(0),
};

$scope.loadMore("uniqueFollows");
$scope.loadMore("uniqueFollowers");


}




$scope.deleteUser = function(){
	alert("Sorry, You Can't do That in Demo Mode!");
}














} // end of profile Func, nothing below this