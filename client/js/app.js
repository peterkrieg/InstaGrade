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
.state('report', {
	url: '/report',
	templateUrl: 'partials/report.html',
	controller: 'reportCtrl'
})




	//____________All these states descendant of report page__________________
	.state('report.media', {
		url: '/media',
		templateUrl: 'partials/report.media.html',
	})
	.state('report.relationships', {
		url: '/relationships',
		templateUrl: 'partials/report.relationships.html'
	})
	.state('report.grade', {
		url: '/grade',
		templateUrl: 'partials/report.grade.html'
	})
	.state('report.analytics', {
		url: '/analytics',
		templateUrl: 'partials/report.analytics.html'
		// controller: 'reportCtrl'
	})
	.state('report.map', {
		url: '/map',
		templateUrl: 'partials/report.map.html'
	})

	//_________________________End of report page__________________________

	//_____________Account page-- states under, just like report page________________

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

	.state('account.stats', {
		url: '/stats',
		templateUrl: '/partials/account.stats.html'
	})





	


	;


	$urlRouterProvider.otherwise('/');











});

