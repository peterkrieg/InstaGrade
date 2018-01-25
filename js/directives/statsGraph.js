angular.module('myApp')
.directive('statsGraph', function($interval){
	return{
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


				// chart categories, attached to scope, so accessible in multiple places
				// each category is type of stat, and each category has different
				// numberFormat is how many decimal places (.0f is 0, .2f is 2, etc)


				scope.categories = {
					numFollowers: {
						title: 'Number of Followers',
						yAxis: 'Number of Followers',
						tooltip: 'Followers',
						numberFormat: '.0f'
					},
					numFollows: {
						title: 'Number of Follows',
						yAxis: 'Number of Follows',
						tooltip: 'Follows',
						numberFormat: '.0f'
					},
					numMedia: {
						title: 'Number of Media',
						yAxis: 'Number of Media',
						tooltip: 'Media',
						numberFormat: '.0f'
					},
					numLikesGiven: {
						title: 'Number of Likes Given',
						yAxis: 'Number of Likes',
						tooltip: '# Likes Given',
						numberFormat: '.0f'
					},
					numLikesReceived: {
						title: 'Number of Likes Received',
						yAxis: 'Number of Likes',
						tooltip: '# Likes Received',
						numberFormat: '.0f'
					},
					userRatio: {
						title: 'User Ratio',
						yAxis: 'User Ratio',
						tooltip: 'User Ratio', 
						numberFormat: '.2f'
					},
					adjustedAverageNumLikes: {
						title: 'Adjusted Average Number of Likes',
						yAxis: 'Adjusted Average # of Likes',
						tooltip: 'AAL',
						numberFormat: '.2f'
					}
				};



				// function to create chart options
				function createChartOptions(){
					// variables for different titles/labels, based on which category of stats
					var yAxis = scope.categories[scope.category].yAxis;
					var numberFormat = scope.categories[scope.category].numberFormat;
					var tooltip = scope.categories[scope.category].tooltip;

					var chartOptions = {
					chart: {
						zoomType: 'x',
						style: {
							fontFamily: "'Playfair Display', serif"
						},
						backgroundColor: '#fafafa'
					},
					credits: {
						enabled: false
					},
					title: {
						// empty string, means no chart title
						text: ''
					},
					subtitle: {
						text: document.ontouchstart === undefined ?
						'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in',
						style: {
							fontSize: '12px',
							fontStyle: 'italic',
							color: '#b0b0b0'
						}
					},
					xAxis: {
						type: 'datetime',
						labels: {
							style: {
								fontSize: '12px'
							}
						},

						dateTimeLabelFormats: { 
							month: '%b-- %e',
							year: '%b',
						}
					},
					yAxis: {
						title: {
							text: scope.categories[scope.category].yAxis,
							style: {
								fontSize: '15px'
							}
						},
						labels: {
							style: {
								fontSize: '13px'
							},
							format: '{value:,'+numberFormat+'}'
						}
					},
					tooltip: {
						// headerFormat: '<b>{series.name}</b><br>',
						headerFormat: '<b>{point.x:%b %e,  %Y}</b><br>',
						pointFormat: scope.categories[scope.category].tooltip+': {point.y:,'+numberFormat+'}',
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






				///////////////////////////////////////////////////
				//  Labels for select drop down menu
				///////////////////////////////////////////////////

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

				// stats are stored in parent scope, accessible here though
				// (the controller scope)

				scope.updateChart = function(category){
					console.log(category);
					scope.category = category;
					// updates current data array, only thing that highcharts uses
					// portion copied from larger stats array
					scope.currentData = scope.stats.map(function(item, index, array){
						return [ Date.parse(item[0]), 
						item[1][scope.category]];
					});
					// creating new highchart
					// function invocation, so that data can be changed correctly
					$(elem).highcharts(createChartOptions());

				}

				// initial default state of graph is number 
				// need to make sure stats are defined on scope first
				// (when page reloaded, takes time for controller to produce stats, like 500ms)
				// but directive doesn't have any .thens, needs stats immediately
				// checks every 50ms to see if scope.stats is ready, if it is, loads graph, cancels interval

				var createFirstStatsChart = $interval(function(){
					if(scope.stats){
						scope.updateChart('numLikesGiven');
						$interval.cancel(createFirstStatsChart);
					}
				}, 50)











				



			}); // jquery ready
		} // link
	}; // return
});  // directive, nothing below this