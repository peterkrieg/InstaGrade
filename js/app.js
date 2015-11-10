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
	.state('results', {
		url: '/results',
		templateUrl: 'partials/results.html',
		controller: 'resultsCtrl'
	})
	//____________All other states descendant of results page__________________
	.state('results.grade', {
		url: '/grade',
		templateUrl: 'partials/results.grade.html',
		// controller: 'resultsCtrl'
	})
	.state('results.photos', {
		url: '/photos',
		templateUrl: 'partials/results.photos.html',
		// controller: 'resultsCtrl'
	})
	.state('results.relationships', {
		url: '/relationships',
		templateUrl: 'partials/results.relationships.html',
		// controller: 'resultsCtrl'
	})
	.state('results.moreAnalytics', {
		url: '/moreAnalytics',
		templateUrl: 'partials/results.moreAnalytics.html',
		// controller: 'resultsCtrl'
	})




	


	;


	$urlRouterProvider.otherwise('/');











});

