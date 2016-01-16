angular.module('myApp')
.controller('accountCtrl', profileFunc);

function profileFunc($scope, user, reportService, userService, $state, $interval, $filter){
	// scroll to top of page, make sure things visible
	window.scroll(0,0);

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

			var hours24 = 1000*60*60*24 // number of milliseconds in a day
			// var hours24=1000*60 // a minute, just for testing purposes
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


// loading stats page, most of logic is in stats graph directive
reportService.getStats()
.then(function(stats){
	$scope.stats = stats;
	// reverse stats, to show newest dates at top
	// stats.reverse();
	$scope.statsReversed = stats.slice(0);
	$scope.statsReversed.reverse();

	console.log($scope.stats);
	console.log($scope.statsReversed);

	$scope.loadingStats = false;

	// first selected item is number likes given, by default
	$scope.selectedItem = "numLikesGiven";

	// once done with stats, get relationships
	getRelationships();


}) // end of getting stats



function getRelationships(){
	console.log(user);
	reportService.getRelationships(user._id)
	.then(function(relationshipsData){
		console.log(relationshipsData);

		// calculate unfollowers (people who have unfollowed you, and when)
		// dates would be approximate (just between date of 2 reports, all info you have)

		var unfollows = [];
		var relationshipsStats = relationshipsData.relationshipsStats;
		$scope.report = relationshipsData.lastReport;

		loop1:
		for(var i=0; i<relationshipsStats.length; i++){
			var followers = relationshipsStats[i].followers;
			loop2:
			for(var j=0; j<followers.length; j++){
				var follower = followers[j];
				loop3:
				for(var k=i+1; k<relationshipsStats.length; k++){
					var followersToCompare = relationshipsStats[k].followers;
					loop4:
					for(var l=0; l<followersToCompare.length; l++){
						var followerToCompare = followersToCompare[l];
				 		// if followers Ids are same, then they havent unfollowed in that report
				 		if(follower.id===followerToCompare.id){
				 			// break the current loop (the 4th nested for loop..)
				 			break;
				 		}

				 		// if reaches end of loop, and still no ids are same, then person unfollowed user..
				 		if(l===followersToCompare.length-1){
				 			var unfollowObj = {
				 				date1: relationshipsStats[k-1].date,
				 				date2: relationshipsStats[k].date,
				 				user: follower
				 			};

				 			// unfollows.push(unfollowObj);

			 				// if unfollows empty, push it for sure
				 			if(unfollows.length===0){
				 				unfollows.push(unfollowObj);
				 				break loop3;
				 			}

				 			// // check if unfollow is already there or not
				 			for(var x=0; x<unfollows.length; x++){
				 				var unfollow = unfollows[x];
				 				if(follower.id===unfollow.user.id){
				 					break loop3;
				 				}
				 				if(x===unfollows.length-1){
				 					unfollows.push(unfollowObj);
				 					break loop3;
				 				}
				 			}


				 			break loop3;
				 		}
				 	}

				 }

				}
			}

			console.log(unfollows);
			$scope.unfollows = unfollows;

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




















} // end of profile Func, nothing below this