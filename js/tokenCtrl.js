angular.module('myApp')
	.controller('tokenCtrl', function($scope, $stateParams, $state, tokenService){
		// console.log($stateParams.token);
		// alert('token controller fired');

		var token = $stateParams.token;
		// console.log(token);

		tokenService.setToken(token);

		$state.go('results.summary');

	});