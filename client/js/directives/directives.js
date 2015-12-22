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

///////////////////////////////////////////////////
//  Set up tabs, so that media tab isn't always active
//  Needs to account for people refreshing page
///////////////////////////////////////////////////

angular.module('myApp')
.directive('setUpTabs', function($location){
	return {
		scope: {
			tabs: '@'
		},
		link: function(scope, elem, attrs){
			$(function(){
				// need to use $location.path() instead of
				// window.location.href, which doesn't update quickly enough

				// var url = window.location.href.split('/results')[1];

				// tabs is passed into directive's scope as a string, so need
				// to use JSON.parse to make raw JS
				console.log(scope.tabs);
				console.log(typeof scope.tabs)

				// var tabs = scope.tabs;
				var tabs = JSON.parse(scope.tabs);
				console.log(typeof tabs);
				console.log(Array.isArray(tabs));

				var url = $location.path();
				console.log(url);

				// $tabElems is array of raw HTML, need to make jquery
				// wrapper object later to use addClass method
				var $tabElems = $(elem).find('li');
				$tabElems.removeClass('active');
				// looping through tabs, checking which one active
				for(var i=0; i<tabs.length; i++){
					var tab = tabs[i];
					if(url.indexOf(tab)>-1){
						$($tabElems[i]).addClass('active');
					}
				}
			});

		}
	}
})



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
				var $userProfile = $(elem);
				var $userMenu = $userProfile.find('.user-menu');

				// hides usermenu at first, to be sure
				$userProfile.removeClass('show-menu');
				$userMenu.hide();

				// when clicked, toggle userMenu, and toggle class
				// font awesome caret icon
				$userProfile.click(function(e){
					e.stopPropagation();
					$userMenu.toggle();
					$userProfile.toggleClass('show-menu');
				});

				// clicking anywhere else can close window as well
				$('html').click(function(e){
					if($userProfile.hasClass('show-menu')) {
						$userProfile.removeClass('show-menu');
						$userMenu.toggle();
					}
				}) // end of html click event

			}) // jquery ready
		}
	}
});

//_________________________Navbar, just HTML Directive__________________________

angular.module('myApp')
.directive('mainNavbar', function(){
	return {
		templateUrl: 'partials/mainNavbar.html'
	};
})





//_________________________Logout behavior__________________________

angular.module('myApp')
.directive('logout', function(){
	return {
		link: function(scope, elem, attrs){
			$(elem).click(function(){
				// console.log('logout!');
				var s = document.createElement("script");
				s.src = "https://instagram.com/accounts/logout";
				$("head").append(s);
			})
		}
	}
});

angular.module('myApp')
.directive('searchbarExpand', function(){
	return {
		link: function(scope, elem, attrs){
			$(function(){
				var $searchWrapper = $(elem);
				var $input = $searchWrapper.find('input.search-bar');

				$input.focus(function(){
					$searchWrapper.animate({
						width: "330px"
					}, 200);
				});
				$input.blur(function(){
					$searchWrapper.css('width', '270px')
				})
				// $input.blur(function(){
				// 	$searchWrapper.animate({
				// 		width: '270px'
				// 	}, 150);
				// })
				



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