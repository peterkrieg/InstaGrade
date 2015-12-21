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

	this.toggleReadyForReport = function(status){
		console.log('toggle report ready in service');
		// status can be true, or false (if ready for report or not)
		return $http.put('/api/users/readyForReport', {status: status})
		.then(function(response){
			return response;
		})
	}









}