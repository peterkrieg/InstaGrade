angular.module('myApp')
.service('reportService', function($http){

	this.getToken = function(){
		return $http.get('/api/token')
		.then(function(response){
			console.log(response);
			return response;
		})
	};

	this.addReport = function(report){
		console.log('add report!');
		$http.post('/api/reports', report);
		return;
	}




});


