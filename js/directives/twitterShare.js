angular.module('myApp')
.directive('twitterShare', function($interval){
	return {
		link: function(scope, elem, attrs){
			console.log('scope for twitteer is', scope);
			// console.log(scope.mostLikesReceived);
			// console.log(scope.user);

      var checkIfScopeLoaded = $interval(function(){
        if(scope.scores && scope.mostLikesReceived){
          $interval.cancel(checkIfScopeLoaded);
          createButton();
        }
      }, 200);




			// ________________Twitter create button on page (append to DOM)____________
			function createButton() {

        // check attributes, 2 different messages depending on if grade or relationships

        if(attrs.type==="grade"){
          var msg = "My Instagram scored a "+scope.scores.overallScoreLetter+" on MediaScore.  What is your score?? Find out at: " 
        }
        if(attrs.type==="crush"){
          var msg = scope.mostLikesReceived.name+" is my Instagram Crush!  Who is yours?  Find out at:" 
        }




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


















