angular.module('myApp')
.controller('profileCtrl', profileFunc);

function profileFunc($scope, user){
	console.log(user);
	$scope.user = user;







} // end of profile Func, nothing below this