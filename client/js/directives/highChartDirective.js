angular.module('myApp')
.directive('hashtagBarChart', function(){
	return {
		link: function(scope, elem, attrs){
			console.log(scope.report.analytics);

			$(function(){
				$(elem).highcharts({
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




				});
			});














		} // link
	} // return
}) // whole directive