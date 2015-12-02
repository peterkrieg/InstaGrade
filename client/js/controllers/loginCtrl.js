angular.module('myApp')
.controller('loginCtrl', ctrlFunc);

function ctrlFunc($scope, loginService){
	// console.log('home controller fired');

	$scope.login = function(){
		loginService.login()
			.then(function(response){
				console.log(response.data)
			})

	}

	$scope.login();


























}