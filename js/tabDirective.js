angular.module('myApp')
	.directive('tabBehavior', function(){
		return {
			restrict: 'A',
			link: function(scope, elem, attrs){
				elem.on('click', function(){
					elem.siblings().removeClass('active');
					elem.addClass('active');
				});
			}

		};
	});