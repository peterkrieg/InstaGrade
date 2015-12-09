angular.module('myApp')
.directive('gradeDirective', function(){
	return {
		link: function(scope, elem, attrs){
			$(function(){
				var $plus = $(elem).find('span.show-explanation');
				var $explanation = $(elem).find('.grade-explanation');
				
				$explanation.hide();
				$plus.removeClass('reveal');

				$plus.click(function(){
					$(this).toggleClass('reveal');
					$explanation.slideToggle(200);

				})



				
				


			}); // end of jquery ready
		} // link
	} // return
}) // directive