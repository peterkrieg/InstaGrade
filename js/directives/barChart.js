angular.module('myApp')
.directive('barChart', function(){
	return{
		link: function(scope, elem, attrs){
			$(function(){
				// setting up case for everything but example
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

				// setting up tooltip, to show numbers of hover
				$(elem).hover(function(){
					$(this).popover('show');
				},  function(){
					// on mouseleave
					$(this).popover('hide');
				});












				
			});  // end of jQuery ready function


		}
	}
})

// directive just for example bar chart
angular.module('myApp')
.directive('barChartExample', function(){
	return function(scope, elem, attrs){
		$(elem).hover(function(){
			$(this).popover('show');
		}, function(){
			$(this).popover('hide');
		});
	}
});









