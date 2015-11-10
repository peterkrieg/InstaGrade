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


	//_________________________Clicking Comment Plus__________________________

	angular.module('myApp')
		.directive('commentExpand', function(){
			return {
				link: function(scope, elem, attrs){
					elem.on('click', function(){
						console.log('clicked! ');
						var $comments = elem.parents('ul.stats').siblings('ul.comments');
						$comments.toggleClass('hidden');
						elem.toggleClass('active');

					});

				}
			};

		});