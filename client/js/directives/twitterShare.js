angular.module('myApp')
.directive('twitterShare', function(){
	return {
		link: function(elem, scope, attrs){
			$(function(){

				//____________________Twitter set up stuff_____________________
				// window.twttr = (function(d, s, id) {
				// 	var t, js, fjs = d.getElementsByTagName(s)[0];
				// 	if (d.getElementById(id)) return;
				// 	js = d.createElement(s);
				// 	js.id = id;
				// 	js.src = "https://platform.twitter.com/widgets.js";
				// 	fjs.parentNode.insertBefore(js, fjs);
				// 	return window.twttr || (t = {
				// 		_e: [],
				// 		ready: function(f) {
				// 			t._e.push(f)
				// 		}
				// 	});
				// }(document, "script", "twitter-wjs"));
				//____________________End twitter set up stuff_____________________


				var msg = 'yay  mediascore';


				createButton();

				//________________Twitter create button on page (append to DOM)____________
				function createButton() {

        
        // Create a New Tweet Element
        // msg  =  document.getElementById('msg').value;
        var link = document.createElement('a');
        link.setAttribute('href', 'https://twitter.com/share');
        link.setAttribute('class', 'twitter-share-button');
        link.setAttribute('style', 'margin-top:5px;');
        link.setAttribute('id', 'twitterbutton');
        link.setAttribute("data-text", "" + msg + "");
        link.setAttribute("data-via", "denvycom");
        link.setAttribute("data-size", "large");

       // Put it inside the twtbox div
        tweetdiv  =  document.getElementById('twtbox');
        tweetdiv.appendChild(link);

        twttr.widgets.load(); //very important
    }






			}); // jquery ready
		} // link
	}; // return
});  // directive