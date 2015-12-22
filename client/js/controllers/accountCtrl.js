angular.module('myApp')
.controller('accountCtrl', profileFunc);

function profileFunc($scope, user, reportService, userService, $state){
	console.log(user);
	$scope.user = user;

	$scope.newReport = function(){
		console.log('\n\n new report!! \n\n');
		// first have to check that new report is 24 hours after time of now, to avoid problems
		var currentTime = new Date().getTime(); // # milliseconds since 1970
		reportService.getLatestReportDate()
		.then(function(timeLastReport){
			console.log(currentTime);
			console.log(timeLastReport);

			// var hours24 = 1000*60*60*24 // number of milliseconds in a day
			var hours24=1000*60 // a minute, just for testing purposes
			// if it hasn't been a day since last report, can't fire

			if(currentTime-timeLastReport<hours24){
				console.log('hasnt been day yet!!');
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







} // end of profile Func, nothing below this