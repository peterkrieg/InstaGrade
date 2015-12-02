angular.module('myApp')
.service('tokenService', function($http){

		// return {
		// 	getToken: function() {
		// 		return token;
		// 	},
		// 	setToken: function(value){
		// 		token = value;
		// 	}
		// };


		this.getToken = function(){
			return $http.get('/api/token')
				.then(function(response){
					return response;
				})

		}


});

