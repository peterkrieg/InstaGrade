angular.module('myApp', ['ui.router'])
.config(function($urlRouterProvider, $stateProvider){

	$stateProvider
	.state('home', {
		url: '/',
		templateUrl: 'partials/home.html',
		controller: 'homeCtrl'
	})
	.state('results', {
		url: '/results',
		templateUrl: 'partials/results.html',
		controller: 'resultsCtrl'
	})
	.state('results.summary', {
		url: '/summary',
		templateUrl: 'partials/results.summary.html',
		controller: 'summaryCtrl'
	})










	.state('token', {
		url: '/access_token=:token',
		templateUrl: 'partials/token.html',
		controller: 'tokenCtrl'
	})


	;


	$urlRouterProvider.otherwise('/');











});

