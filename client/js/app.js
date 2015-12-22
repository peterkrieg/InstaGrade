angular.module('myApp', ['ui.router'])
.config(function($urlRouterProvider, $stateProvider){

	$stateProvider
	.state('home', {
		url: '/',
		templateUrl: 'partials/home.html',
		controller: 'homeCtrl'
	})

	.state('login', {
		url: '/login/instagram',
		// templateUrl: 'partials/login.html',
		controller: 'loginCtrl'
	})





	// .state('token', {
	// 	url: '/access_token=:token',
	// 	// templateUrl: 'partials/token.html',
	// 	controller: 'tokenCtrl'
	// })
.state('results', {
	url: '/results',
	templateUrl: 'partials/results.html',
	controller: 'resultsCtrl'
})




	//____________All these states descendant of results page__________________
	.state('results.media', {
		url: '/media',
		templateUrl: 'partials/results.media.html',
	})
	.state('results.relationships', {
		url: '/relationships',
		templateUrl: 'partials/results.relationships.html'
	})
	.state('results.grade', {
		url: '/grade',
		templateUrl: 'partials/results.grade.html'
	})
	.state('results.analytics', {
		url: '/analytics',
		templateUrl: 'partials/results.analytics.html'
		// controller: 'resultsCtrl'
	})
	.state('results.map', {
		url: '/map',
		templateUrl: 'partials/results.map.html'
	})

	//_________________________End of results page__________________________

	//_____________Account page-- states under, just like results page________________

	.state('account', {
		url: '/account',
		templateUrl: 'partials/account.html',
		controller: 'accountCtrl',
		resolve: {
			user: function(userService){
				return userService.getAccount();
			}
		}
	})

	.state('account.reports', {
		url: '/reports',
		templateUrl: '/partials/account.reports.html'
	})

	// new report, forcing report to load
	// .state('new-report', {
	// 	url: '/results/report',
	// 	controller: 'resultsCtrl'
	// 	resolve: {
	// 		forceReport: true
	// 	}
	// })




	


	;


	$urlRouterProvider.otherwise('/');











});

