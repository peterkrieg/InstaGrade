angular.module('myApp', ['ui.router'])
.config(function($urlRouterProvider, $stateProvider){

	$stateProvider
	.state('home', {
		url: '/',
		templateUrl: 'partials/home.html',
		controller: 'homeCtrl'
	})
	.state('summary', {
		url: '/summary',
		templateUrl: 'partials/summary.html',
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

