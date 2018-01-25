angular.module('myApp')
.directive('hashtagScatter', function($interval){
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
						},
						backgroundColor: '#fafafa'
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
							color: '#458eff',
							marker: {
								// color: '#458eff',
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

				// animating chart by using an interval
				// works with WOWjs, checking to see if chart-container (parent())
				// if visible when user scrolls to it
				// once visible, draw chart, and cancel interval
				var animateChart = $interval(function(){
					if($(elem).parent().css('visibility')==='visible'){
						$(elem).highcharts(chartOptions);
						$interval.cancel(animateChart);
					}
				}, 200);












			});// end of jquery ready

		} // end of link
	};// end of return
}); // end of directive