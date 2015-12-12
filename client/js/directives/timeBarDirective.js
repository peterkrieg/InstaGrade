angular.module('myApp')
.directive('timeBar', function($interval){
	return{
		link: function(scope, elem, attrs){
			$(function(){

				var daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
				var dayCounts = scope.report.analytics.daysOfWeekArr;

				var chartOptions = {
					chart: {
						type: 'column',
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
						categories: daysOfWeek,
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
							text: 'Number of Media',
							style: {
								fontSize: '15px',
								// color: 'green'
							}
						}
					},

					plotOptions: {
						column: {
							color: '#458eff',
							pointPadding: 0.2,
							borderWidth: 0
						}
					},

					series: [{
						name: 'Number of Media',
						data: dayCounts
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





			}); // end of jquery ready
		}  // link
	} // return
}) // whole directive