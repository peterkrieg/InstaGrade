angular.module('myApp')
.directive('hashtagBarChart', function(){
	return {
		link: function(scope, elem, attrs){
			console.log(scope.report.analytics);

			$(function(){
				$(elem).highcharts({
					chart: {
						type: 'column'
					},
					title: {
						text: 'HAshtag analysis'
					},
					subtitle: {
						text: 'subtitle here'
					},
					xAxis: {
						categories: [
						'something1',
						'something2',
						'something3'
						],
						crosshair: true
					},
					yAxis: {
						min: 0,
						title: {
							text: 'Count'
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
						data: [4,5,10]
					}]




				});
			});














		} // link
	} // return
}) // whole directive