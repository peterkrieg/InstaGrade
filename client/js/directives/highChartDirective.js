angular.module('myApp')
.directive('hashtagBarChart', function(){
	return {
		link: function(scope, elem, attrs){
			console.log(scope.report.analytics);

			$(function(){
				var chart = {
					chart: {
						type: 'column',
						style: {
							fontFamily: "'Playfair Display', serif",
							color: 'red'
						}
					},
					credits: {
						enabled: false
					},
					title: {
						text: null,
					},
					subtitle: {
						text: null
					},

					//____________ x-axis____________
					xAxis: {
						categories: scope.report.analytics.currentTags,
						crosshair: true,
						labels: {
							style: {
								fontSize: '15px'
							}
						}
					},

					// ___________y-axis____________
					yAxis: {
						// style: {
						// 	fontSize: '20px'
						// },
						labels: {
							style: {
								fontSize: '15px'
							}
						},
						min: 0,
						title: {
							text: 'Count',
							style: {
								fontSize: '30px',
								// color: 'green'
							}
						}
					},

					plotOptions: {
						column: {
							pointPadding: 0.2,
							borderWidth: 0
						}
					},

					series: [{
						name: 'Number of hashtag uses',
						data: scope.report.analytics.currentTagsCounts
					}]




				};//end of chart definition

				$(elem).highcharts(chart);

				chart = $(elem).highcharts();
				// console.log('new chart is', chart);

				// end of highcharts setup

				///////////////////////////////////////////////////
				//  Events of clicking left or right button, 
				//  Cycling through hashtags
				///////////////////////////////////////////////////


				console.log(scope.report.analytics.tagsGroupsCounts);

				var tagsGroupsNames = scope.report.analytics.tagsGroupsNames;
				var tagsGroupsCounts = scope.report.analytics.tagsGroupsCounts;
				console.log(tagsGroupsCounts);

				var $leftButton = $(elem).parent().find('i.cycle-left');
				var $rightButton = $(elem).parent().find('i.cycle-right');

				// console.log($leftButton);
				// console.log($rightButton);

				$rightButton.on('click', function(e){
					console.log('clicked right');
					console.log(tagsGroupsCounts);
					console.log(scope.report.analytics.tagsGroupsCounts);
					e.preventDefault();


					scope.index++;
					scope.report.analytics.currentTags = tagsGroupsNames[scope.index];
					scope.report.analytics.currentTagsCounts = tagsGroupsCounts[scope.index];

					console.log(tagsGroupsCounts);
					console.log(scope.report.analytics.tagsGroupsCounts);

					
					// // update data of chart
					chart.xAxis[0].setCategories(scope.report.analytics.currentTags);
					chart.series[0].setData(scope.report.analytics.currentTagsCounts);

					scope.noMoreLeft = false;
					scope.$apply();

					if(!tagsGroupsCounts[scope.index+1]){
						scope.noMoreRight = true;
						scope.$apply();
					}

				})// end of right button function

				$leftButton.on('click', function(e){
					console.log('index before is', scope.index);
					e.preventDefault();
					scope.index--;
					console.log('index after is ', scope.index);
					console.log(tagsGroupsCounts);
					scope.report.analytics.currentTags = tagsGroupsNames[scope.index];
					scope.report.analytics.currentTagsCounts = tagsGroupsCounts[scope.index];
					console.log(scope.report.analytics.currentTagsCounts);

					console.log(scope.report.analytics.currentTagsCounts);
					
					// update data of chart
					chart.xAxis[0].setCategories(scope.report.analytics.currentTags);
					chart.series[0].setData(scope.report.analytics.currentTagsCounts);

					scope.noMoreRight = false;
					scope.$apply();

					if(!tagsGroupsCounts[scope.index-1]){
						scope.noMoreLeft = true;
						scope.$apply();
					}

				})// end of left button function



				




























			});// end of jquery ready function, nothing below this 
		} // link
	} // return
}) // whole directive


