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
					}
				});

				var chartOptions = {
					// global: {
					// 	useUTC: false
					// },
					chart: {
						zoomType: 'x'
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
						year: '%b'
					}
				},
				yAxis: {
					title: {
						text: 'y axis title would change for each category'
					}
				},
				tooltip: {
					headerFormat: '<b>{series.name}</b><br>',
					pointFormat: '{point.x:%e. %b  %Y}: {point.y:.2f} m'
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
							[0, Highcharts.getOptions().colors[0]],
							[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
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
						name: 'USD to EUR',
						data: scope.currentData
					}]



				}; // end of chart options

				// creating highchart
				$(elem).highcharts(chartOptions);








				



			}); // jquery ready
		} // link
	}; // return
});  // directive, nothing below this