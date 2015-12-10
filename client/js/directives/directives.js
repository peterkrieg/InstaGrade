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


//_________________________Wow JS______________

// just to init WOWJS
angular.module('myApp')
.directive('wow', function(){
	return {
		link: function(scope, elem, attrs){
			$(function(){
				new WOW().init();   
			});
		}
	}
});

// user menu of results tab
angular.module('myApp')
.directive('userMenu', function(){
	return {
		link: function(scope, elem, attrs){
			$(function(){
				var $userMenu = $(elem).find('.user-menu');

				// hides usermenu at first, to be sure
				$(elem).removeClass('show-menu');
				$userMenu.hide();

				// when clicked, toggle userMenu, and toggle class
				// font awesome caret icon
				$(elem).click(function(){
					$userMenu.toggle();
					$(elem).toggleClass('show-menu');
				})
				



			});
		}
	}
})

















	//_________________________Clicking Comment Plus__________________________

	angular.module('myApp')
	.directive('commentExpand', function(){
		return {
			link: function(scope, elem, attrs){
				elem.on('click', function(){
						// console.log('clicked! ');
						var $comments = elem.parents('ul.stats').siblings('ul.comments');
						$comments.toggleClass('hidden');
						elem.toggleClass('active');

					});

			}
		};

	});


//______________Order By Controls, media_______________

angular.module('myApp')
.directive('orderByControls', function(){
	return {
		link: function(scope, elem, attrs){
			var arrowIcon = '<i class="fa fa-caret-up"></i>';
			var refreshIcon = '<i class="fa fa-refresh"></i>';

			var sortFunctions = {
				popularity: function(a,b){return ((b.comments.count*2+b.likes.count)-(a.comments.count*2+a.likes.count));},
				date: function(a,b){return (b.created_time - a.created_time); },
				type: function(a,b){
					// shows videos first, by default ("ascending order")
					if(a.type > b.type) return -1;
					if(a.type < b.type) return 1;
					return 0;
				}
			}

				// when page first loads, will be sorted by popularity
				elem.find('li.active').append(arrowIcon);
				// when switching back to media tab from other tab,
				// bug where active class added 
				if(scope.$parent.media){
					scope.$parent.media.sort(sortFunctions.popularity);
				}

				// console.log('PARENT SCOPE IS', scope.$parent);
				// console.log('something is', scope.$parent.$id);
				// scope.$parent.media = scope.$parent.media.sort(sortFunctions.popularity);


				elem.find('li').on('click', function(e){
					e.preventDefault();
					var $liClicked = $(this);
					var dataType = $liClicked.attr('data-type');
					var sortFunction = sortFunctions[dataType];

					// have to add && to make sure that when keep clicking
					// random, it doesn't just reverse back and forth
					if($liClicked.hasClass('active') && $liClicked.attr('data-type')!=='random'){
						$liClicked.toggleClass('descending');
						// scope.$parent.media = [];
						scope.$parent.media.reverse();
						// had to use $apply(), to update scope
						scope.$apply();
						// console.log(scope.$parent.media);
					}

					else if($liClicked.attr('data-type')==='random'){
						if($liClicked.hasClass('active')){
							// alert('active');
							$liClicked.toggleClass('descending');
							scope.$parent.media = _.shuffle(scope.$parent.media);
							scope.$apply();
						}
						else{
							elem.find('li.active').removeClass('active descending')
							.find('i').remove();

							$liClicked.addClass('active');
							$liClicked.append(refreshIcon);

							scope.$parent.media = _.shuffle(scope.$parent.media);
							scope.$apply();
						}


					}

					else{
						elem.find('li.active').removeClass('active descending')
						// then delete the up arrow font awesome icon
						.find('i').remove();

						$liClicked.addClass('active');
						$liClicked.append(arrowIcon);

						scope.$parent.media = scope.$parent.media.sort(sortFunction);
						scope.$apply();

					}
				})
			}
}
})