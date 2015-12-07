angular.module('myApp')
.directive('barChart', function($interpolate){
	return{
		link: function(scope, elem, attrs){
			$(function(){
				var $barCharts = elem.find('div.bar');


				console.log(scope.user);











				// for(var i=0; i<$barCharts.length; i++){
				// 	var $currBar = $barCharts[i];












					// console.log($currBar);
					// console.log($currBar.getAttribute('data-bar-width'));
					// var value =$interpolate($currBar.getAttribute('data-bar-width'));
					// console.log(value);


					// console.log('width is  ', $currBar.attr('data-bar-width'));
					// $currBar.css('width', $currBarr.attr('data-bar-width'));
				// }



				// console.log($barCharts);



				// console.log('is directive working??');




				
			});


		}
	}
})