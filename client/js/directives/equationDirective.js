angular.module('myApp')
.directive('equation', function(){
	return {
		scope: {
			numerator: '@',
			denominator: '@',
			result: '@'
		},
		templateUrl: 'js/directives/equationDirective.html'




	};
})