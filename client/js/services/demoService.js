angular.module('myApp')
.service('demoService', demoServiceFunc);

function demoServiceFunc($http){
	this.test = function(){
		console.log('test');
	};


	this.getLastDemoReport = function(){
		return $http.get('/api/reports/demoReport?id=569291d4c77eb78e5b804218')
		.then(function(response){
			return response.data;
		})
	};

	this.getStatsDemo = function(){
		console.log('get stats demo service');
		return $http.get('/api/demo/stats')
		.then(function(response){
			return response.data;
		})


	}

	this.getSpecificReport = function(id){
		return $http.get('/api/reports/demoReport?id='+id)
		.then(function(response){
			return response.data;
		})
	}

















} // end of demoService Function ,nothing below this



