angular.module('myApp')
.service('prepareReport', function($http){

	this.getToken = function(){
		return $http.get('/api/token')
		.then(function(response){
			return response;
		})
	};




});


