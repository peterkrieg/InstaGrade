angular.module('myApp')
.controller('basicCtrl', basicCtrlFunc);

function basicCtrlFunc($scope, userService){
	// scroll top of page, so more visible
	window.scroll(0,0)

	userService.checkIfLoggedIn()
	.then(function(user){
		console.log(user);
		if(user.name){
			$scope.user = user;
		}
	})

	// first see if user exists

	// better to have here, so only in DOM, not on static HTML, try to prevent spam
	$scope.email = "pkrieg2@gmail.com";
















} // end of basic ctrl function, nothing below this

