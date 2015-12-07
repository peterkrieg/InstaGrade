angular.module('myApp')
.directive('barChart', function($interpolate){
	return{
		link: function(scope, elem, attrs){
			$(function(){
				var $barCharts = elem.find('div.bar');

				// console.log(scope);
				// console.log(scope.user);

				var likesReceived = scope.user.likesReceived;
				var likesGiven = scope.user.likesGiven;

				if(likesReceived>likesGiven){
					elem.find('.likes-received').css('width', '100%');
					elem.find('.likes-given').css('width', (likesGiven/likesReceived)*100+'%');
				}
				else if(likesReceived<likesGiven){
					elem.find('.likes-given').css('width', '100%');
					elem.find('.likes-received').css('width', (likesReceived/likesGiven)*100+'%');
				}
				else if(likesReceived===likesGiven){
					elem.find('.bar').css('width', '100%');
				}












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