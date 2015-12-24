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
	};

	this.getLatestReportDate = function(){
		return $http.get('/api/reports/latestDate')
		.then(function(response){
			var time = response.data;
			// time is stored in server as UTC string, like 2015-12-21T03:25:30.239Z
			// need to get number of ms, parse date string
			var numberMs = Date.parse(time)

			// console.log(numb/1000/60/60/24/365);

			return numberMs;
		})
	};

	this.getStats = function(){
		return $http.get('/api/reports/stats')
		.then(function(response){
			// console.log(response);
			return response.data;


		})
	}




});


