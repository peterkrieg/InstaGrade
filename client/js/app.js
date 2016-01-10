angular.module('myApp', ['ui.router'])
.config(function($urlRouterProvider, $stateProvider){

	$stateProvider
	.state('home', {
		url: '/',
		templateUrl: 'partials/home.html',
		controller: 'homeCtrl'
	})





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

	///////////////////////////////////////////////////
	//  Special views just for demo, to make sure to separate actions
	//  That can be done, (need to load dummy JSON data)
	///////////////////////////////////////////////////

	.state('demoReport', {
		url: '/demo/report',
		templateUrl: 'partials/report.html',
		controller: 'demoReportCtrl'
	})
	.state('demoReport.media', {
		url: '/media',
		templateUrl: 'partials/report.media.html',
	})
	.state('demoReport.relationships', {
		url: '/relationships',
		templateUrl: 'partials/report.relationships.html'
	})
	.state('demoReport.grade', {
		url: '/grade',
		templateUrl: 'partials/report.grade.html'
	})
	.state('demoReport.analytics', {
		url: '/analytics',
		templateUrl: 'partials/report.analytics.html'
		// controller: 'reportCtrl'
	})
	.state('demoReport.map', {
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
	.state('account.settings', {
		url: '/settings',
		templateUrl: '/partials/account.settings.html'
	})
	.state('account.relationships', {
		url: '/relationships',
		templateUrl: '/partials/account.relationships.html'
	})


	//_________________________Other pages__________________________

	.state('privacy', {
		url: '/privacy',
		templateUrl: 'partials/privacy.html',
		controller: 'basicCtrl'
	})






	;


	$urlRouterProvider.otherwise('/');








})
///////////////////////////////////////////////////
//  End of states config
///////////////////////////////////////////////////




///////////////////////////////////////////////////
//  Need to turn on once deployed--related to google analytics
///////////////////////////////////////////////////


// .run(function($rootScope, $location, $window){
// 	$rootScope
// 	.$on('$stateChangeSuccess',
// 		function(event){
// 			if (!$window.ga){
// 				// alert('no ga!!');
// 				return;
// 			}

// 			$window.ga('send', 'pageview', { page: $location.path() });
// 		});

// })
















;












