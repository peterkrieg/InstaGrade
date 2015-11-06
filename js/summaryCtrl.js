angular.module('myApp')
	.controller('summaryCtrl', function($scope, tokenService, instaService){

		// var token = instaService.getToken();
		// console.log(token);

		var token = tokenService.getToken();
		console.log(token);







	});