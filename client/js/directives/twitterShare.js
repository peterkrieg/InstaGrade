// angular.module('myApp')
// .directive('twitterrShare', function($interval){
// 	return {
// 		// scope: {
// 		// 	mostLikesReceived: '='
// 		// },
// 		link: function(elem, scope, attrs){
// 			$(function(){
// 				// console.log('data source is', scope.mostLikesReceived)
// 				console.log('scope is', scope);

// 				//____________________Twitter set up stuff_____________________
// 				// window.twttr = (function(d, s, id) {
// 				// 	var t, js, fjs = d.getElementsByTagName(s)[0];
// 				// 	if (d.getElementById(id)) return;
// 				// 	js = d.createElement(s);
// 				// 	js.id = id;
// 				// 	js.src = "https://platform.twitter.com/widgets.js";
// 				// 	fjs.parentNode.insertBefore(js, fjs);
// 				// 	return window.twttr || (t = {
// 				// 		_e: [],
// 				// 		ready: function(f) {
// 				// 			t._e.push(f)
// 				// 		}
// 				// 	});
// 				// }(document, "script", "twitter-wjs"));
// 				//____________________End twitter set up stuff_____________________

// 				var msg;

// 				// var checkIfLoaded2 = $interval(function(){
// 				// 	console.log(scope);
// 				// 	// if(scope.$parent.mostLikesReceived){
// 				// 	// 	// msg = scope.mostLikesReceived.name+" is my Instagram Crush, liking "+scope.mostLikesReceived.likesReceived+" of my "+scope.user.numMedia+" pieces of media! ("+Math.round(100*Number(scope.mostLikesReceived.likesReceived)/Number(scope.user.numMedia)).toString()+"%).";
// 				// 	// 	// console.log(msg);
// 				// 	// 	console.log('done');
// 				// 	// 	$interval.cancel(checkIfLoaded2)
// 				// 	// }
// 				// 	// else{
// 				// 	// 	console.log('not yet');
// 				// 	// 	msg = '';
// 				// 	// }
// 				// }, 2000);




// 				// createButton();

// 				//________________Twitter create button on page (append to DOM)____________
// 				// function createButton() {


//     //     // Create a New Tweet Element
//     //     // msg  =  document.getElementById('msg').value;
//     //     var link = document.createElement('a');
//     //     link.setAttribute('href', 'https://twitter.com/share');
//     //     link.setAttribute('class', 'twitter-share-button');
//     //     link.setAttribute('style', 'margin-top:5px;');
//     //     link.setAttribute('id', 'twitterbutton');
//     //     link.setAttribute("data-text", "" + msg + "");
//     //     link.setAttribute("data-via", "denvycom");
//     //     link.setAttribute("data-size", "large");

//     //    // Put it inside the twtbox div
//     //    tweetdiv  =  document.getElementById('twtbox');
//     //    tweetdiv.appendChild(link);

//     //    var checkIfLoaded = $interval(function(){
//     //    	if(twttr){
//     //    		if(twttr.widgets){
//     //    			$interval.cancel(checkIfLoaded);
//     //     			twttr.widgets.load();  //very important
//     //     		}
//     //     		else{console.log('widgets not loaded');}
//     //     	}
//     //     	else{console.log('twttrnot loaded')}
//     //     }, 200);

//     //  }






// 			}); // jquery ready
// 		} // link
// 	}; // return
// });  // directive
















angular.module('myApp')
.directive('twitterShare', function($interval){
	return {
		link: function(scope, elem, attrs){
			console.log('scope for twitteer is', scope);
			console.log(scope.mostLikesReceived);
			console.log(scope.user);


			createButton();

			// ________________Twitter create button on page (append to DOM)____________
			function createButton() {
				// var msg = 'yay mediascore';
				var msg = scope.mostLikesReceived.name+" is my Instagram Crush!  Who is yours?  Find out at:" 


        // Create a New Tweet Element
        // msg  =  document.getElementById('msg').value;
        var link = document.createElement('a');
        link.setAttribute('href', 'https://twitter.com/share');
        link.setAttribute('class', 'twitter-share-button');
        link.setAttribute('style', 'margin-top:5px;');
        link.setAttribute('id', 'twitterbutton');
        link.setAttribute("data-text", "" + msg + "");
        link.setAttribute("data-url", 'http://mediascore.rocks');
        // link.setAttribute("data-via", "denvycom");
        link.setAttribute("data-size", "large");

       // Put it inside the twtbox div
       tweetdiv  =  document.getElementById('twtbox');
       tweetdiv.appendChild(link);

       var checkIfLoaded = $interval(function(){
       	if(twttr){
       		if(twttr.widgets){
       			$interval.cancel(checkIfLoaded);
        			twttr.widgets.load();  //very important
        		}
        		else{console.log('widgets not loaded');}
        	}
        	else{console.log('twttrnot loaded')}
        }, 200);

     }












   }
 };
})


















