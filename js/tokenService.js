angular.module('myApp')
.service('tokenService', function(){

		return {
			getToken: function() {
				return token;
			},
			setToken: function(value){
				token = value;
			}
		};
		
});

