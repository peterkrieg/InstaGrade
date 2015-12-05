angular.module('myApp')
.directive('googleMap', function(){
	return {
		link: function(scope, elem, attrs){
			// alert('hello');

			var map;
			function initMap() {
				map = new google.maps.Map(document.getElementById('map'), {
					center: {lat: -34.397, lng: 150.644},
					zoom: 8
				});
			}

			// scope.$apply();




		}
	}
})