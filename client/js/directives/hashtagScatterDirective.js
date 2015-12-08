angular.module('myApp')
.directive('hashtagScatter', function(){
	return {
		link: function(scope, elem, attrs){
			$(function(){
				var hashtagScatter = scope.report.analytics.hashtagScatter;

				var chartOptions = {
					chart: {
						type: 'scatter',
						zoomType: 'xy',
						style: {
							fontFamily: "'Playfair Display', serif"
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
						title: {
							enabled: true,
							text: 'Number of Hashtags vs. Number of Interactions'
						},
						startOnTick: true,
						endOnTick: true,
						showLastLabel: true
					},


					// ___________y-axis____________
					yAxis: {
						labels: {
							style: {
								fontSize: '15px'
							}
						},
						// min: 0,
						title: {
							text: 'Number of Interactions ',
							style: {
								fontSize: '15px',
								// color: 'green'
							}
						}
					},

					// plotOptions
					plotOptions: {
						scatter: {
							marker: {
								radius: 5,
								states: {
									hover: {
										enabled: true,
										lineColor: 'rgb(100,100,100)'
									}
								}
							},
							states: {
								hover: {
									marker: {
										enabled: false
									}
								}
							},
							tooltip: {
								headerFormat: '<b>{series.name}</b><br>',
								pointFormat: '{point.x} hashtags, {point.y} interactions'
							}
						}
					},

					series: [{
						name: 'Number of hashtag uses',
						// color: 'rgba(223, 83, 83, .5)',
						data: scope.report.analytics.hashtagScatter
					}]




				};//end of chart options definition

				$(elem).highcharts(chartOptions);

				var chart = $(elem).highcharts();
				












			});// end of jquery ready

		} // end of link
	};// end of return
}); // end of directive