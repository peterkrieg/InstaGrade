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


///////////////////////////////////////////////////
//  Determining color of grade bar, based on width given by scope 
///////////////////////////////////////////////////

angular.module('myApp')
.directive('scoreBar', function(){
	return {
		link: function(scope, elem, attrs){
			$(function(){
				// category is attached to data-category of HTML
				// but angular just shows it without data, I guess making it easier
				var category = attrs.category;

				// first get width of bar from scope scores, then change it
				var width = scope.scores[category];
				elem.css('width', width+'%');

				// now color bar based on score
				var color = gradeColor(width);
				elem.css('background', color);
			}); // jquery ready
		} // link
	};
})


function gradeColor(width){
	var hue;

	// have dark red be for failing, under 60
	if(width<20){ // D91E18
		hue = 350+Math.round(width/2); // produces from 350 to 360
		return 'hsl('+hue+', 100%, 41%)';
	}
	if(width<40){
		hue = Math.round((width-20)/2);
		return 'hsl('+hue+', 100%, 41%)';
	}
	if(width<60){ // EF4836
		hue = Math.round((width-28)/2);
		return 'hsl('+hue+', 85%, 57%)';
	}
	if(width<70){ //F27935
		hue = Math.round((width-51)*2);
		return 'hsl('+hue+', 88%, 58%)';
	}
	if(width<80){
		hue = Math.round((width-50)*2);
		return 'hsl('+hue+', 85%, 58%)';
	}
	if(width<90){
		hue = Math.round((width-40)*2);
		return 'hsl('+hue+', 60%, 66%)';
	}
	if(width<=100){
		hue = Math.round((240-width));
		return 'hsl('+hue+', 100%, 35%)';
	}

} // end of grade color function



















