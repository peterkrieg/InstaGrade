angular.module('myApp')
	.controller('tokenCtrl', function($scope, $stateParams, $state, tokenService){
		// alert('token controller time!');
		// console.log('token controller time!!');
		// console.log($stateParams.token);

		var token = $stateParams.token;
		// console.log(token);

		tokenService.setToken(token);

		$state.go('summary');












	});