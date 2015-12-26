angular.module('myApp')
.directive('statsGraph', function($interval){
	return{
		// scope: {
		// 	selectblah: '='
		// },


		link: function(scope, elem, attrs){
			$(function(){

				// have to use this, because otherwise highcharts uses UTC time, by default
				// want to use local time of user's browser, whatever that is, not UTC
				Highcharts.setOptions({
					global: {
						useUTC: false
					},
					// displays comma, to separate thousands place
					lang: {
						thousandsSep: ','
					}
				});

				scope.category= 'numLikesReceived';


				// chart categories, attached to scope, so accessible in multiple places
				// each category is type of stat, and each category has different 
				scope.categories = {
					numFollowers: {
						title: 'Number of Followers',
						yAxis: 'Number of Followers',
						tooltip: 'Followers'
					},
					numFollows: {
						title: 'Number of Follows',
						yAxis: 'Number of Follows',
						tooltip: 'Follows'
					},
					numFollows: {
						title: 'Number of Media',
						yAxis: 'Number of Media',
						tooltip: 'Media'
					},
					numLikesGiven: {
						title: 'Number of Likes Given',
						yAxis: 'Number of Likes',
						tooltip: '# Likes Given'
					},
					numLikesReceived: {
						title: 'Number of Likes Received',
						yAxis: 'Number of Likes',
						tooltip: '# Likes Received'
					},
					userRatio: {
						title: 'User Ratio',
						yAxis: 'User Ratio',
						tooltip: 'User Ratio'
					},
					adjustedAverageNumLikes: {
						title: 'Adjusted Average Number of Likes',
						yAxis: 'Adjusted Average # of Likes',
						tooltip: 'AAL'
					}


				};




				function createChartOptions(){
					var chartOptions = {
					// global: {
					// 	useUTC: false
					// },
					chart: {
						zoomType: 'x',
						style: {
							fontFamily: "'Playfair Display', serif"
						}
					},
					credits: {
						enabled: false
					},
					title: {
						text: 'something for title!!'
					},
					subtitle: {
						text: document.ontouchstart === undefined ?
						'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
					},
					xAxis: {
						type: 'datetime',
						dateTimeLabelFormats: { 
							month: '%e. %b',
							year: '%b',
							labels: {
								style: {
									fontSize: '15px'
								}
							}
						}
					},
					yAxis: {
						title: {
							text: scope.categories[scope.category].yAxis
						},
						labels: {
							style: {
								fontSize: '15px'
							},
							format: '{value:,.2f}'
						}
					},
					tooltip: {
						// headerFormat: '<b>{series.name}</b><br>',
						headerFormat: '<b>{point.x:%b %e,  %Y}</b><br>',
						pointFormat: scope.categories[scope.category].tooltip+': {point.y:,.0f}',
					},
					legend: {
						enabled: false
					},
					plotOptions: {
						area: {
							fillColor: {
								linearGradient: {
									x1: 0,
									y1: 0,
									x2: 0,
									y2: 1
								},
								stops: [
								[0, '#599CFF'],
								[1, '#458eff']
								]
							},
							marker: {
								radius: 2
							},
							lineWidth: 1,
							states: {
								hover: {
									lineWidth: 1
								}
							},
							threshold: null
						}
					}, // plot options
					series: [{
						type: 'area',
						// name: 'USD to EUR',
						data: scope.currentData
					}]



				}; // end of chart options
				return chartOptions;
			} // end of create chart options function












				// create chart at first

				scope.labels = [
				{title: 'Number of Followers', ref: 'numFollowers'},
				{title: 'Number of Follows', ref: 'numFollows'},
				{title: 'Number of Media', ref: 'numMedia'},
				{title: 'Number of Likes Given', ref: 'numLikesGiven'},
				{title: 'Number of Likes Received', ref: 'numLikesReceived'},
				// {title: 'Number of Pictures', ref: 'numPics'},
				// {title: 'Number of Videos', ref: 'numVids'},
				{title: 'User Ratio', ref: 'userRatio'},
				{title: 'Adjusted Average Number of Likes', ref: 'adjustedAverageNumLikes'},
				];

				var stats = scope.stats;



				scope.updateChart = function(category){
					console.log(category);
					console.log('inside directive!');
					scope.category = category;

					scope.currentData = stats.map(function(item, index, array){
						return [ Date.parse(item[0]), 
						item[1][scope.category]];
					});

					$(elem).highcharts(createChartOptions());










				}






				// function fired anytime graph needs to be updated
				// scope.updateChart = function(param){
				// 	console.log(scope.selectblah);
				// 	console.log(scope.$parent.selectedItem);
				// 	console.log('\n\ndirective scope is: \n',scope,'\n\n');
				// 	console.log('param is', param);
				// 	console.log('\n category is', scope.selectedItem+'\n\n');
				// 	console.log(scope.currentData);
				// 	var stats = scope.stats;
				// 	scope.currentData = stats.map(function(item, index, array){
				// 		return [ Date.parse(item[0]), 
				// 		item[1][scope.category]];
				// 	});
				// 	console.log(scope.currentData);

				// 	// draw chart
				// 	$(elem).highcharts(createChartOptions());
				// };

				// scope.updateChart();







				



			}); // jquery ready
		} // link
	}; // return
});  // directive, nothing below this