angular.module('myApp')
.controller('accountCtrl', profileFunc);

function profileFunc($scope, user, reportService, userService, $state, $interval, $filter){
	console.log(user);
	$scope.user = user;
	$scope.errorNotDay = false;

	// loading state variables
	$scope.loadingStats = true;


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
		console.log('\n\n new report!! \n\n');
		// first have to check that new report is 24 hours after time of now, to avoid problems
		var currentTime = new Date().getTime(); // # milliseconds since 1970
		reportService.getLatestReportDate()
		.then(function(timeLastReport){
			// console.log(currentTime);
			// console.log(timeLastReport);

			// var hours24 = 1000*60*60*24 // number of milliseconds in a day
			var hours24=1000*60 // a minute, just for testing purposes
			// if it hasn't been a day since last report, can't fire

			if(currentTime-timeLastReport<hours24){
				console.log('hasnt been day yet!!');
				// time left is for displaying countdown until report can be shown
				var timeLeft = hours24- (currentTime-timeLastReport);
				// console.log(timeLeft) ;
				$scope.timeLeft = timeLeft;

				// coutndown timer, to show time left to user until report

				$scope.timer = $interval(function(){
					$scope.timeLeft-=1000;
					// rare case that user looks at countdown as it gets down to a few seconds
					// if so, need to close error box 
					if($scope.timeLeft<=0){
						$scope.errorNotDay = false;
					}
				}, 1000);

				$scope.toggleError(true);

			}
			else{
				userService.toggleReadyForReport(true)
				.then(function(response){
					$state.go('report.media');
				})
			}
		});
	}; // end of new Report function

	$scope.loadSpecificReport = function(reportId){
		console.log('load specific report fired!!');
		console.log(reportId);
		userService.toggleSpecificReport(reportId)
		.then(function(response){
			$state.go('report.media');
		})
	}; // end of load specific report function


// loading stats page
reportService.getStats()
.then(function(stats){
	$scope.stats = stats;
	console.log(stats);
	console.log(Date.parse(stats[4][0]));
	console.log(typeof stats[0][0]);

	console.log('\n\n\ncontroller scope is: \n',$scope,'\n\n');

	// $scope.selectedItem = "numFollows";

	// $scope.$watch('selectedItem', function(){
	// 	console.log('controller fired!');
	// })

	// $scope.updateChart = function(param){
	// 	console.log($scope.selectedItem);
	// 	console.log(param);
	// }





	// setting up stats

	// $scope.category = "numLikesReceived";

	// $scope.currentData = stats.map(function(item, index, array){
	// 	return [ Date.parse(item[0]), 

	// 	item[1][$scope.category]];
	// });
	// console.log($scope.currentData);

	// labels for the dropdown menu, used by ng-options
	// the ref is the data for each one, to then get data, same key names 
	// as the stats object received by controller
	// $scope.labels = [
	// {title: 'Number of Followers', ref: 'numFollowers'},
	// {title: 'Number of Follows', ref: 'numFollows'},
	// {title: 'Number of Media', ref: 'numMedia'},
	// {title: 'Number of Likes Given', ref: 'numLikesGiven'},
	// {title: 'Number of Likes Received', ref: 'numLikesReceived'},
	// // {title: 'Number of Pictures', ref: 'numPics'},
	// // {title: 'Number of Videos', ref: 'numVids'},
	// {title: 'User Ratio', ref: 'userRatio'},
	// {title: 'Adjusted Average Number of Likes', ref: 'adjustedAverageNumLikes'},
	// ];

	// create chart to start

	// $scope.updateChart();






}) // end of getting stats











} // end of profile Func, nothing below this