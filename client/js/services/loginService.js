angular.module('myApp')
.service('loginService', function($http, $q){

	this.login = function(){
		return $http.get('/api/auth/instagram')
		.then(function(response){
			console.log(response);
		})




	};


});

