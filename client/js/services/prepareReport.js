angular.module('myApp')
.service('prepareReport', function($http){

	this.getToken = function(){
		return $http.get('/api/token')
		.then(function(response){
			return response;
		})
	};

	this.startReport = function(user){
		var userEdited = {
			name: user.full_name || user.username,
			instagramId: user.id,
			// userBio: user.bio || 'no bio provided :(',
			userPic: user.profile_picture,
			numMedia: user.counts.media,
			numFollowers: user.counts.followed_by,
			numFollows:user.counts.follows,
			website: user.website
		};
		return userEdited;

	};




});

