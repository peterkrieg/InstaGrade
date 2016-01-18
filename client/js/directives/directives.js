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
				scope.setUpTabs = function(){
					// need to use $location.path() instead of
					// window.location.href, which doesn't update quickly enough
					// var url = window.location.href.split('/results')[1];

					// tabs is passed into directive's scope as a string, so need
					// to use JSON.parse to make raw JS
					var tabs = JSON.parse(scope.tabs);

					var url = $location.path();
					// console.log(url);

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
				}; // set up tabs function

				// initially set up tabs
				// scope.setUpTabs();
				scope.$on('$stateChangeSuccess', function(){
					// console.log($location.path());
					// console.log('state has changed!!!');
					scope.setUpTabs();
				})



			}); // jquery ready
		}// link
	}; // return
}); // whole directive



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



//________Navbar, HTML and behavior to show when scrolling up only_____________

angular.module('myApp')
.directive('mainNavbar', function($interval){
	return {
		templateUrl: 'partials/mainNavbar.html',
		link: function(scope, elem, attrs){
			$(function(){
				var $navbar = $(elem).find('div.main-nav')
				// function to slide navbar up when scrolling up, and hide when scrolling down
				var didScroll;
				var lastScrollTop = 0;
				var delta = 5;
				var navbarHeight = $navbar.outerHeight();

				// on scroll, let the interval function know the user has scrolled
				$(window).scroll(function(event){
					didScroll = true;
				});

				// checks every 150ms to see if has scrolled
				$interval(function(){
					if(didScroll) {
						hasScrolled();
						didScroll = false;
					}
				}, 150);

				function hasScrolled(){
					var st = $(this).scrollTop();

					// have delta so that doesn't activate from tiny scroll up or down
					if (Math.abs(lastScrollTop - st) <= delta)
						return;
					// If current position > last position AND scrolled past navbar...
					if (st > lastScrollTop && st > navbarHeight){
					  // Scroll Down
					  $navbar.removeClass('nav-down').addClass('nav-up');
					} 
					else {
				  // Scroll Up
				  // If did not scroll past the document (possible on mac)...
				  if(st + $(window).height() < $(document).height()) { 
				  	$navbar.removeClass('nav-up').addClass('nav-down');
				  }
				}

				lastScrollTop = st;

			}// end of hasScrolled function
			}); // jquery ready
		} // link
	};
});
//____________________End navbar_____________________

///////////////////////////////////////////////////
//  Navbar directive for demo--same except for template URL..
///////////////////////////////////////////////////
angular.module('myApp')
.directive('mainNavbarDemo', function($interval){
	return {
		templateUrl: 'partials/mainNavbarDemo.html',
		link: function(scope, elem, attrs){
			$(function(){
				var $navbar = $(elem).find('div.main-nav')
				// function to slide navbar up when scrolling up, and hide when scrolling down
				var didScroll;
				var lastScrollTop = 0;
				var delta = 5;
				var navbarHeight = $navbar.outerHeight();

				// on scroll, let the interval function know the user has scrolled
				$(window).scroll(function(event){
					didScroll = true;
				});

				// checks every 150ms to see if has scrolled
				$interval(function(){
					if(didScroll) {
						hasScrolled();
						didScroll = false;
					}
				}, 150);

				function hasScrolled(){
					var st = $(this).scrollTop();

					// have delta so that doesn't activate from tiny scroll up or down
					if (Math.abs(lastScrollTop - st) <= delta)
						return;
					// If current position > last position AND scrolled past navbar...
					if (st > lastScrollTop && st > navbarHeight){
					  // Scroll Down
					  $navbar.removeClass('nav-down').addClass('nav-up');
					} 
					else {
				  // Scroll Up
				  // If did not scroll past the document (possible on mac)...
				  if(st + $(window).height() < $(document).height()) { 
				  	$navbar.removeClass('nav-up').addClass('nav-down');
				  }
				}

				lastScrollTop = st;

			}// end of hasScrolled function
			}); // jquery ready
		} // link
	};
});
///////////////////////////////////////////////////
//  End demo navbar
///////////////////////////////////////////////////


///////////////////////////////////////////////////
//  Footer directive, has attributes to say if it is 
//  full footer, or demo, or less version
///////////////////////////////////////////////////

angular.module('myApp')
.directive('myFooter', function(){
	return {
		templateUrl: 'partials/mainFooter.html',
		link: function(scope, elem, attrs){
			if(attrs.type==="full"){
				scope.full = true;
			}
			else if(attrs.type==="demo"){
				scope.demo = true;
			}
			else if(attrs.type==="less"){
				scope.less = true;
			}

			// for basic ctrl, to check if demo, or full
			else if(attrs.type==="check"){
				if(scope.$parent.demo===true){
					scope.demo = true;
				}
				else if(scope.$parent.full===true){
					scope.full = true;
				}
			}
			// end 


		} // link
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


//_______________Heart behavior--best friend of likes comparison__________
angular.module('myApp')
.directive('heartBehavior', function($interval, $timeout, $location, $state){
	return {
		link: function(scope, elem, attrs){
			$(function(){
				var $modal = $('div.instagram-crush-modal');
				var $modalContent = $modal.find('.modal-content');
				var $matchTitle = $modalContent.find('h4.match-title');
				var $matchSubTitle = $modalContent.find('h6.match-subtitle');
				var $userImg = $modalContent.find('img.user');
				var $heart = $(elem);
				var $navbar = $('div.main-nav');
				// console.log(elem.css('visibility'));



				// way to check if heart is viewable, to popup the instagram crush modal
				var checkHeart = $interval(function(){
					if($heart.css('visibility')==='visible' && ($state.current.name==='report.relationships' || $state.current.name==='demoReport.relationships') && isElementInViewport($heart)){
						$heart.removeClass('invisible');
						openInstagramCrushModal();
						$heart.addClass('pulse');
						$interval.cancel(checkHeart);
					}
					else{
						// cancel interval, if leave tab, but interval was running before
						if($state.current.name!=='report.relationships' && $state.current.name!=='demoReport.relationships'){
							$interval.cancel(checkHeart);
						}
						// console.log(isElementInViewport($heart));
					}
				}, 200);
				//____________________End interval checking heart_____________________

				// function to open instagram crush modal and make navbar appear right
				function openInstagramCrushModal(){
					$modal.modal('toggle');
					// make sure modal appears right, if navbar is down, need to push down on page
					if($navbar.hasClass('nav-down')){
						$modal.find('.modal-content').css('top', '50px');
					}
					else{
						// otherwise, just cancel css, to make sure appears right with no navbar
						$modal.find('.modal-content').css('top', '');
					}
				} // open instagram crush modal



				$heart.click(function(){
					openInstagramCrushModal();
					
					// $heart.removeClass('pulse');

					// now need to have delays right for css animations
					$userImg.addClass('hidden');
					$matchSubTitle.addClass('hidden');

					$timeout(function(){
						$matchSubTitle.removeClass('hidden');
					}, 200);

					$timeout(function(){
						$userImg.removeClass('hidden');
					}, 100);

					console.log(scope.mostLikesReceived);
					console.log(scope.$parent.$parent.$parent);
					scope.rootUser = scope.$parent.$parent.$parent;


				});




			}); // jquery ready


			//____________________Check if in viewport_____________________
			function isElementInViewport (el) {

		    //special bonus for those using jQuery
		    if (typeof jQuery === "function" && el instanceof jQuery) {
		    	el = el[0];
		    }

		    var rect = el.getBoundingClientRect();

		    return (
		    	rect.top >= 0 &&
		    	rect.left >= 0 &&
		    	rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
		    	rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
		    	);
		  }



		} // link
	}; // return
})


angular.module('myApp')
.directive('openDeleteAccountModal', function(){
	return {
		link: function(scope, elem, attrs){
			elem.click(function(){
				console.log('blah');

				var $navbar = $('div.main-nav');
				console.log($navbar)
				var $modal = $('#deleteAccountModal');

				$modal.modal('toggle');
				// make sure modal appears right, if navbar is down, need to push down on page
				if($navbar.hasClass('nav-down')){
					console.log('down!!');
					$modal.find('.modal-content').css('top', '50px');
				}
				else{
					// otherwise, just cancel css, to make sure appears right with no navbar
					$modal.find('.modal-content').css('top', '');
				}
			})
		} // link
	}; // return
}); // directive



angular.module('myApp')
.directive('faqBehavior', function(){
	return {
		link: function(scope, elem, attrs){
			console.log('blah123');
			var $qBox = $(elem);
			var $caret = $qBox.find('i.fa-caret-right');
			var $aBox = $qBox.find('.answer-container');


			$qBox.find('.answer-container').hide();



				// clicking anywhere in question box opens the question, and shuts all other
				// questions that may be open, like accordion affect
				elem.click(function(){
					// don't do anything if already open
					if($(this).hasClass('reveal')){
						return;
					}

					// first close other boxes that may be open
					$('.question-box').removeClass('reveal')
					$('.question-box .answer-container').slideUp();


					$qBox.addClass('reveal');
					$aBox.slideDown();

					console.log('blah');
				})
				

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