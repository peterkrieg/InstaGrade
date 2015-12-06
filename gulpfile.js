var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var ngAnnotate = require('gulp-ng-annotate');


//___________________Watcher________________________

var watcher = gulp.watch(['./client/js/**/*.js'], ['default']);

watcher.on('change', function(event){
	console.log('File ' + event.path + ' was ' + event.type + ' at ' + new Date() + ' , running tasks...');
})


gulp.task('javascript', function() {
	gulp.src([
		'./client/bower_components/jquery/dist/jquery.js',
		'./client/bower_components/lodash/lodash.js',



		// google maps

		// './client/bower_components/googleMaps.js',

		// 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB9odQywTVtdKtoHNJceQD1nVTzhTB5E0U&callback=initMap',




		









		// './bower_components/bootstrap4/js/src/bootstrap.js',


		// loading each bootstrap JS component in right order
		'./client/bower_components/bootstrap-sass/assets/javascripts/bootstrap/affix.js',
		'./client/bower_components/bootstrap-sass/assets/javascripts/bootstrap/alert.js',
		'./client/bower_components/bootstrap-sass/assets/javascripts/bootstrap/button.js',
		'./client/bower_components/bootstrap-sass/assets/javascripts/bootstrap/carousel.js',
		'./client/bower_components/bootstrap-sass/assets/javascripts/bootstrap/collapse.js',
		'./client/bower_components/bootstrap-sass/assets/javascripts/bootstrap/dropdown.js',
		'./client/bower_components/bootstrap-sass/assets/javascripts/bootstrap/tab.js',
		'./client/bower_components/bootstrap-sass/assets/javascripts/bootstrap/transition.js',
		'./client/bower_components/bootstrap-sass/assets/javascripts/bootstrap/scrollspy.js',
		'./client/bower_components/bootstrap-sass/assets/javascripts/bootstrap/modal.js',
		'./client/bower_components/bootstrap-sass/assets/javascripts/bootstrap/tooltip.js',
		'./client/bower_components/bootstrap-sass/assets/javascripts/bootstrap/popover.js',







		// './bower_components/bootstrap-sass/assets/javascripts/bootstrap/*js',



		'./client/bower_components/angular/angular.js',
		// './bower_components/ngSmoothScroll/lib/angular-smooth-scroll.js',
		'./client/bower_components/angular-ui-router/release/angular-ui-router.js',







		//_________________________GSAP animation__________________________

		// './bower_components/gsap/src/uncompressed/TweenMax.js',

		//_________________________Scroll magic__________________________
		// './bower_components/scrollmagic/scrollmagic/uncompressed/ScrollMagic.js',
		// './bower_components/scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js',
		// './bower_components/scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js',
		// './js/other/*.js',





		//_______My controllers, directives, app.js__________________________
		'./client/js/app.js',
		'./client/js/directives/*.js',
		'./client/js/services/*.js',
		'./client/js/controllers/*.js'


		])
	// .src('./js/lib/angular/angular.js')
	.pipe(ngAnnotate())
	.pipe(concat('all.js'))
	// .pipe(uglify())
	.pipe(gulp.dest('./client/js/scripts'))
});

gulp.task('default', ['javascript']);