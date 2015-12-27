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
















} // end of basic ctrl function, nothing below this

