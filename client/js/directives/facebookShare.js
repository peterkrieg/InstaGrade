angular.module('myApp')
.directive('facebookShare', function(){
	return{
		link: function(scope, elem, attrs){
			$(function(){

				///////////////////////////////////////////////////
				//  Facebook SDK stuff I need
				//  https://developers.facebook.com/docs/opengraph/getting-started#create-app
				///////////////////////////////////////////////////
				window.fbAsyncInit = function() {
					FB.init({
						appId      : '918086384933928',
						status     : true,
						cookie     : true,
						xfbml      : true,
						version    : 'v2.3'
					});
				};

				(function(d, s, id){
					var js, fjs = d.getElementsByTagName(s)[0];
					if (d.getElementById(id)) {return;}
					js = d.createElement(s); js.id = id;
					js.src = "//connect.facebook.net/en_US/sdk.js";
					fjs.parentNode.insertBefore(js, fjs);
				}(document, 'script', 'facebook-jssdk'));
				///////////////////////////////////////////////////
				//  End facebook SDK
				///////////////////////////////////////////////////




				///////////////////////////////////////////////////
				//  When facebook share button clicked, use SDK to 
				//  share 
				///////////////////////////////////////////////////
				elem.click(function(){
					console.log('facebook share clicked');

					FB.ui({
						method: 'feed',
						href: 'http://mediascore.rocks',
						link: 'http://mediascore.rocks', 
						picture: 'http://cdn01.wallpapersonweb.com/media/tn5/1/3/22466.jpg',
						name: "The name who will be displayed on the post",
						description: "The description who will be displayed"
					}, function(response){
						console.log(response);
					}
					);
				})













			}); // jquery ready
		} // link
	}; // return
}); // whole directive