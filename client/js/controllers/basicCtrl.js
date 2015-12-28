angular.module('myApp')
.controller('basicCtrl', basicCtrlFunc);

function basicCtrlFunc($scope, userService){

	userService.checkIfLoggedIn()
	.then(function(user){
		console.log(user);
		if(user){
			$scope.user = user;
		}
	})

	// first see if user exists

	// better to have here, so only in DOM, not on static HTML, try to prevent spam
	$scope.email = "pkrieg2@gmail.com";
















} // end of basic ctrl function, nothing below this

