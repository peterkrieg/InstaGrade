angular.module('myApp')
.directive('facebookShare', function(){
	return{
		link: function(scope, elem, attrs){
			$(function(){
				console.log('facebook share scope is', scope);

				setTimeout(function(){
					console.log('fb share scope later is', scope)
				}, 5000)

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

				if(attrs.type==="grade"){
					var name = "My Instagram scored a "+scope.scores.overallScoreLetter+" on MediaScore.  What is your score??"; 
					var description = '';
					var picture = 'http://mediascore.rocks/img/mediascoreScore.png';
				}
				if(attrs.type==="crush"){
					var name = scope.mostLikesReceived.name+" is my Instagram Crush!  Who is Yours??";
					var description = scope.mostLikesReceived.name+" has liked "+scope.mostLikesReceived.likesReceived+" of my "+scope.user.numMedia+" pieces of media! ("+Math.round(100*Number(scope.mostLikesReceived.likesReceived)/Number(scope.user.numMedia)).toString()+"%).";
					var picture = 'http://mediascore.rocks/img/mediascore.png'
				}




				///////////////////////////////////////////////////
				//  When facebook share button clicked, use SDK to 
				//  share 
				///////////////////////////////////////////////////
				elem.click(function(){
					// console.log('facebook share clicked');

					// console.log(Math.round(100*Number(scope.mostLikesReceived.likesReceived)/Number(scope.user.numMedia)).toString());




					FB.ui({
						method: 'feed',
						href: 'http://mediascore.rocks',
						link: 'http://mediascore.rocks', 
						picture: picture,
						name: name,
						description: description,
					}, function(response){
						console.log(response);
					}
					);
				})













			}); // jquery ready
		} // link
	}; // return
}); // whole directive