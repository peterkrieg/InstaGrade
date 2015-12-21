angular.module('myApp')
.service('userService', userFunc);

function userFunc($http, $q){

	this.addUser = function(user){
		return $http.post('/api/users', user)
		.then(function(response){
			return response;
		})

	};

	this.getAccount = function(instagramId){
		return $http.get('/api/users/account')
		.then(function(response){
			console.log('response from http get of user account is', response);
			return response.data;
		})


	};











}