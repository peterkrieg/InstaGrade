angular.module('myApp', ['ui.router'])
.config(function($urlRouterProvider, $stateProvider){

	$stateProvider
	.state('home', {
		url: '/',
		templateUrl: 'partials/home.html',
		controller: 'homeCtrl'
	})
	.state('token', {
		url: '/access_token=:token',
		templateUrl: 'partials/token.html',
		controller: 'tokenCtrl'
	})
	//____________All other states descendant of results page__________________
	.state('results', {
		url: '/results',
		templateUrl: 'partials/results.html',
		controller: 'resultsCtrl'
	})
	.state('results.grade', {
		url: '/grade',
		templateUrl: 'partials/results.grade.html',
		controller: 'resultsCtrl'
	})










	


	;


	$urlRouterProvider.otherwise('/');











});

