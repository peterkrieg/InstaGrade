angular.module('myApp')
.service('userService', userFunc);

function userFunc($http, $q){

	this.addUser = function(user){
		return $http.post('/api/users', user)
		.then(function(response){
			return response;
		})

	}










}